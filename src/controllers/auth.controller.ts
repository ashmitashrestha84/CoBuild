import mongoose from "mongoose";
import { catchAsync } from "../utils/catchAsync.utils";
import { NextFunction, Request, Response } from "express";
import User from "../model/usermodel";
import { sendResponse } from "../utils/sendResponse.utils";
import { hashPassword } from "../utils/bcrypt.utils";


//*signup
export const register=catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
        const {full_name,email,password,phone}=req.body;
        const user=new User({
            full_name,
            email,
            password,
            phone
        })
        const hashPass= await hashPassword(password);
        user.password=hashPass;
    await user.save();
    sendResponse(res,{
        message:"Account created",
        statusCode:201,
        data:user,
    })
    }   
)