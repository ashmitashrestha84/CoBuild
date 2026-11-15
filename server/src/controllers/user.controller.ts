import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import User from "../model/usermodel";
import appError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { Role } from "../types/enumtypes";
const uploadFolder = "/profile_image";

//* get by id
export const getUserbyID = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new appError("User doesnot exist", 404);
    }
    sendResponse(res, {
      message: "User Fetched Successsfully",
      statusCode: 200,
      data: user,
    });
  },
);

//* get all
export const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.find({ role: Role.USER });
    if (!user || user.length === 0) {
      throw new appError("No User found", 404);
    }
    sendResponse(res, {
      message: "User fetched Successfully",
      data: user,
      statusCode: 200,
    });
  },
);

//* get all admin
export const getAllAdmins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const admins = await User.find({
      role: {
        $in: [Role.ADMIN, Role.SUPER_ADMIN],
      },
    });
    res.status(201).json({
      message: "User fetched",
      status: "Success",
      success: true,
      data: admins,
    });
  },
);

//*updateProfile

export const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { full_name, phone, bio, skills, github, linkedin, portfolio } =
      req.body;
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      throw new appError("User does not exist", 404);
    }

    // Update only the fields provided by the user
    if (full_name !== undefined) user.full_name = full_name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;

    // Save updated information
    await user.save();

    sendResponse(res, {
      message: "Profile updated successfully",
      statusCode: 200,
      data: user,
    });
  },
);

//*updateProfileImage
export const updateProfileImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      throw new appError("profile_image is required", 400);
    }
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new appError("User doesnot exist", 404);
    }
    if (user.profile_image && user.profile_image.public_id) {
      await deleteFile(user.profile_image.public_id);
    }
    const { path, public_id } = await upload(file, uploadFolder);
    user.profile_image = {
      path,
      public_id,
    };
    await user.save();
    sendResponse(res, {
      message: "Profile Image updated Successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//*searchUsers
export const searchUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const search = String(req.query.q).trim();
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedSearch, "i");

    const users = await User.find({
      _id: { $ne: req.user._id }, //$ne:excludes the id of the cureently loginuser and provide the id for the search user
      $or: [
        //$or:search by either name or skill
        { full_name: searchRegex },
        { skills: searchRegex },
      ],
    }).select("full_name profile_image bio skills github linkedin portfolio");

    sendResponse(res, {
      message: "Users fetched successfully",
      statusCode: 200,
      data: users,
    });
  },
);

//*deleteUser
export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new appError("User doesnot exist", 404);
    }
    if (user.profile_image?.public_id) {
      await deleteFile(user.profile_image.public_id);
    }
    await user.deleteOne();

    sendResponse(res, {
      message: "Account deleted successfully",
      statusCode: 200,
      data: null,
    });
  },
);
