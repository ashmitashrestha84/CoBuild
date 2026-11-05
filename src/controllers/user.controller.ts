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

//*earchUsers

//*deleteUser
