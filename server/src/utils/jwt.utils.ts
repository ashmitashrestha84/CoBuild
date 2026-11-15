import jwt from "jsonwebtoken";
import { IJwtPayLoad, IJwtReturn } from "../types/globaltypes";
import ENV_CONFIG from "../config/env.config";

//generate token
export const generateJwtToken = (payload: IJwtPayLoad) => {
  try {
    return jwt.sign(payload, ENV_CONFIG.JWT_SECRET, {
      expiresIn: ENV_CONFIG.JWT_EXPIRES_IN as any,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//verify jwt token

export const verifyJwtToken = (token: string): IJwtReturn => {
  try {
    return jwt.verify(token, ENV_CONFIG.JWT_SECRET) as IJwtReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Generate email verification token
export const generateEmailVerificationToken = (email: string) => {
  return jwt.sign(
    {
      email,
      purpose: "email-verification",
    },
    ENV_CONFIG.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};
