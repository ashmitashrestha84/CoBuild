import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  let message = error?.message ?? "Internal Server Error";
  let statusCode = error?.statusCode ?? 500;
  let status = error?.status ?? "error";

  const success = false;

  // MongoDB duplicate-key error
  if (error?.code === 11000 || error?.cause?.code === 11000) {
    message = "Duplicate value. This record already exists.";
    statusCode = 400;
    status = "fail";
  }

  // Expired JWT token — check before JsonWebTokenError
  if (error instanceof TokenExpiredError) {
    message = "Token expired. Please log in again.";
    statusCode = 401;
    status = "fail";
  } else if (error instanceof JsonWebTokenError) {
    message = "Invalid token. Login required.";
    statusCode = 401;
    status = "fail";
  }

  res.status(statusCode).json({
    message,
    success,
    status,
    statusCode,
    data: null,
    details: error?.errors ?? null,
    ...(process.env.NODE_ENV === "development"
      ? { originalError: error?.stack }
      : {}),
  });
};
