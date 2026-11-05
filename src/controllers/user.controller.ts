import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import User from "../model/usermodel";
import appError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";

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
    const user = await User.find();
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
