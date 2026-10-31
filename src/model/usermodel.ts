import mongoose from "mongoose";
import { Role } from "../types/enumtypes";
import { imageSchema } from "./imagemodel";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "name must be atleast 3 character long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "user already exist"],
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    profile_image: {
      type: imageSchema,
      default: null,
    },
    phone: {
      type: Number,
      required: false,
      maxLength: [10, "phone number at most be 10 digit long"],
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);

export default User;
