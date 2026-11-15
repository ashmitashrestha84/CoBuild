import mongoose from "mongoose";
import { Role } from "./enumtypes";
export interface IJwtPayLoad {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: Role;
}

export interface IJwtReturn extends IJwtPayLoad {
  iat: number;
  exp: number;
}
export interface IEmailVerificationPayload {
  email: string;
  purpose: "email-verification";
}
