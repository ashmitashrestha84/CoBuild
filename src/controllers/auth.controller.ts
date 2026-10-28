import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.utils";
import { NextFunction, Request, Response } from "express";
import User from "../model/usermodel";
import { sendResponse } from "../utils/sendResponse.utils";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import appError from "../utils/appError.utils";
import { IJwtPayLoad } from "../types/globaltypes";
import { generateJwtToken } from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";

//*signup
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { full_name, email, password, phone } = req.body;
     const file=req.file();
     if(file){
      const {path,public_id}=await upload
     }
    const user = new User({
      full_name,
      email,
      password,
      phone,
    });
   
    const hashPass = await hashPassword(password);
    user.password = hashPass;
    await user.save();
    sendResponse(res, {
      message: "Account created",
      statusCode: 201,
      data: user,
    });
  },
);

//login
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      throw new appError("User with provided email doesnot exists", 400);
    }
    const matchpass = await comparePassword(password, user.password);
    if (!matchpass) {
      throw new appError("Credentials doesnot matched", 400);
    }
    const payload: IJwtPayLoad = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };
    const access_token = generateJwtToken(payload);
    res.cookie("access_token", access_token, {
      httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false : true, //production->true  development->false
      secure: ENV_CONFIG.NODE_ENV === "development" ? false : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: ENV_CONFIG.NODE_ENV === "development" ? "lax" : "none", //production->none
    });
    const { password: p, ...rest } = user.toObject();

    sendResponse(res, {
      statusCode: 200,
      message: "Login user",
      data: {
        user: rest,
        access_token,
      },
    });
  },
);
