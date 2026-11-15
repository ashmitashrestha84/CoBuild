"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.logout = exports.getMe = exports.login = exports.register = void 0;
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const usermodel_1 = __importDefault(require("../model/usermodel"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const emailService_utils_1 = require("../utils/emailService.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const uploadFolder = "/profile_images";
//*signup
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { full_name, email, password, phone } = req.body;
    const file = req.file;
    const user = new usermodel_1.default({
        full_name,
        email,
        password,
        phone,
    });
    if (file) {
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        user.profile_image = {
            path,
            public_id,
        };
    }
    (0, emailService_utils_1.sendEmail)({
        to: user.email,
        subject: "Account Created",
        html: (0, emailTemplate_utils_1.accountCreatedHtml)({
            full_name: user.full_name,
            email: user.email,
            createdAt: user.createdAt,
        }),
    });
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashPass;
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account created",
        statusCode: 201,
        data: user,
    });
});
//login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await usermodel_1.default.findOne({ email: email }).select("+password");
    if (!user) {
        throw new appError_utils_1.default("User with provided email doesnot exists", 400);
    }
    const matchpass = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!matchpass) {
        throw new appError_utils_1.default("Credentials doesnot matched", 400);
    }
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie("access_token", access_token, {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true, //production->true  development->false
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none", //production->none
    });
    (0, emailService_utils_1.sendEmail)({
        to: user.email,
        subject: "Account Created",
        html: (0, emailTemplate_utils_1.newLoginDetectedHtml)({
            full_name: user.full_name,
            email: user.email,
            loginTime: new Date(Date.now()),
            device: req.headers["user-agent"],
        }),
    });
    const { password: p, ...rest } = user.toObject();
    (0, sendResponse_utils_1.sendResponse)(res, {
        statusCode: 200,
        message: "Login user",
        data: {
            user: rest,
            access_token,
        },
    });
});
//* get me
exports.getMe = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = await usermodel_1.default.findOne({ _id: req.user._id });
    if (!user) {
        throw new appError_utils_1.default("User not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User fetched successfully",
        statusCode: 200,
        data: user,
    });
});
//*logout
exports.logout = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    res.clearCookie("access_token", {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User logout successfully",
        statusCode: 200,
        data: null,
    });
});
//*change password
exports.changePassword = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    const user = await usermodel_1.default.findOne({ _id: req.user._id }).select("+password");
    if (!user) {
        throw new appError_utils_1.default("User doesnot exist", 404);
    }
    const isPassMatched = await (0, bcrypt_utils_1.comparePassword)(currentPassword, user.password);
    if (!isPassMatched) {
        throw new appError_utils_1.default("Credentials don't match", 400);
    }
    const isSamePassword = await (0, bcrypt_utils_1.comparePassword)(newPassword, user.password);
    if (isSamePassword) {
        throw new appError_utils_1.default("Current password must be different from current password", 400);
    }
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(newPassword);
    user.password = hashPass;
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Password changed successfully",
        statusCode: 200,
        data: null,
    });
});
const crypto_1 = __importDefault(require("crypto"));
//* forgot password
exports.forgotPassword = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { email } = req.body;
    const user = await usermodel_1.default.findOne({ email });
    if (!user) {
        throw new appError_utils_1.default("User does not exist", 404);
    }
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });
    await (0, emailService_utils_1.sendEmail)({
        to: user.email,
        subject: "Reset Your CoBuild Password",
        html: (0, emailTemplate_utils_1.forgotPasswordHtml)({
            full_name: user.full_name,
            resetToken,
        }),
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        statusCode: 200,
        message: "Password reset link sent to your email",
        data: user,
    });
});
//* reset password
exports.resetPassword = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { token, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
        throw new appError_utils_1.default("New Password and Confirm Password doesnot match", 404);
    }
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await usermodel_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");
    if (!user) {
        throw new appError_utils_1.default("Invalid or expired reset token", 400);
    }
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(newPassword);
    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        statusCode: 200,
        message: "Password reset successfully",
        data: null,
    });
});
