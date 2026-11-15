import mongoose from "mongoose";
import { Role } from "../types/enumtypes";
import { imageSchema } from "./imagemodel";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "full_name is required"],
      minLength: [3, "name must be at least 3 characters long"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "user already exists"],
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
    },

    // Profile information
    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
    },

    skills: {
      type: [String],
      default: [],
    },

    github: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    portfolio: {
      type: String,
      trim: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
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
