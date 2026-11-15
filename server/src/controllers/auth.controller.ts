import { catchAsync } from "../utils/catchAsync.utils";
import { NextFunction, Request, Response } from "express";
import User from "../model/usermodel";
import { sendResponse } from "../utils/sendResponse.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";
import { IJwtPayLoad } from "../types/globaltypes";
import {
  generateEmailVerificationToken,
  generateJwtToken,
} from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";
import { upload } from "../utils/cloudinary.utils";
import { sendEmail } from "../utils/emailService.utils";
import {
  accountCreatedHtml,
  forgotPasswordHtml,
  newLoginDetectedHtml,
  verifyEmailHtml,
} from "../utils/emailTemplate.utils";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "crypto";

const uploadFolder = "/profile_images";

//* SIGNUP
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      full_name,
      email,
      password,
      phone,
      bio,
      skills,
      github,
      linkedin,
      portfolio,
    } = req.body;

    const file = req.file;

    const user = new User({
      full_name,
      email,
      password,
      phone,
      bio,
      skills,
      github,
      linkedin,
      portfolio,
    });

    if (file) {
      const { path, public_id } = await upload(file, uploadFolder);

      user.profile_image = {
        path,
        public_id,
      };
    }

    const hashPass = await hashPassword(password);
    user.password = hashPass;

    await user.save();

    const verificationToken = generateEmailVerificationToken(user.email);

    await sendEmail({
      to: user.email,
      subject: "Account Created",
      html: accountCreatedHtml({
        full_name: user.full_name,
        email: user.email,
        createdAt: user.createdAt,
      }),
    });

    await sendEmail({
      to: user.email,
      subject: "Verify Your CoBuild Email",
      html: verifyEmailHtml({
        full_name: user.full_name,
        verificationToken,
      }),
    });

    const { password: p, ...userData } = user.toObject();

    sendResponse(res, {
      message: "Account created successfully",
      statusCode: 201,
      data: userData,
    });
  },
);

//* LOGIN
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new appError("User with provided email does not exist", 400);
    }

    const matchpass = await comparePassword(password, user.password);

    if (!matchpass) {
      throw new appError("Credentials do not match", 400);
    }

    const payload: IJwtPayLoad = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const access_token = generateJwtToken(payload);

    res.cookie("access_token", access_token, {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });

    await sendEmail({
      to: user.email,
      subject: "New Login Detected",
      html: newLoginDetectedHtml({
        full_name: user.full_name,
        email: user.email,
        loginTime: new Date(),
        device: req.headers["user-agent"] ?? "Unknown device",
      }),
    });

    const { password: p, ...rest } = user.toObject();

    sendResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: {
        user: rest,
        access_token,
      },
    });
  },
);

//* GET ME
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new appError("User not found", 404);
    }

    sendResponse(res, {
      message: "User fetched successfully",
      statusCode: 200,
      data: user,
    });
  },
);

//* LOGOUT
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("access_token", {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none",
    });

    sendResponse(res, {
      message: "User logout successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//* VERIFY EMAIL
export const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;

    if (!token || typeof token !== "string") {
      throw new appError("Verification token is required", 400);
    }

    let decoded: jwt.JwtPayload;

    try {
      const result = jwt.verify(token, ENV_CONFIG.JWT_SECRET);

      if (typeof result === "string") {
        throw new appError("Invalid verification token", 400);
      }

      decoded = result;
    } catch (error) {
      if (error instanceof appError) {
        throw error;
      }

      throw new appError("Verification token is invalid or has expired", 400);
    }

    if (
      decoded.purpose !== "email-verification" ||
      typeof decoded.email !== "string"
    ) {
      throw new appError("Invalid verification token", 400);
    }

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      throw new appError("User not found", 404);
    }

    if (user.isEmailVerified) {
      sendResponse(res, {
        message: "Email is already verified",
        statusCode: 200,
        data: null,
      });

      return;
    }

    user.isEmailVerified = true;

    await user.save();

    sendResponse(res, {
      message: "Email verified successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//* CHANGE PASSWORD
export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findOne({
      _id: req.user._id,
    }).select("+password");

    if (!user) {
      throw new appError("User does not exist", 404);
    }

    const isPassMatched = await comparePassword(currentPassword, user.password);

    if (!isPassMatched) {
      throw new appError("Credentials do not match", 400);
    }

    const isSamePassword = await comparePassword(newPassword, user.password);

    if (isSamePassword) {
      throw new appError(
        "New password must be different from current password",
        400,
      );
    }

    const hashPass = await hashPassword(newPassword);

    user.password = hashPass;

    await user.save();

    sendResponse(res, {
      message: "Password changed successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//* FORGOT PASSWORD
export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new appError("User does not exist", 404);
    }

    const resetToken = randomBytes(32).toString("hex");

    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Reset Your CoBuild Password",
      html: forgotPasswordHtml({
        full_name: user.full_name,
        resetToken,
      }),
    });

    sendResponse(res, {
      statusCode: 200,
      message: "Password reset link sent to your email",
      data: null,
    });
  },
);

//* RESET PASSWORD
export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      throw new appError("New password and confirm password do not match", 400);
    }

    const hashedToken = createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      throw new appError("Invalid or expired reset token", 400);
    }

    const hashPass = await hashPassword(newPassword);

    user.password = hashPass;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendResponse(res, {
      statusCode: 200,
      message: "Password reset successfully",
      data: null,
    });
  },
);
