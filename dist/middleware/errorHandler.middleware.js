"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const errorHandler = (error, req, res, next) => {
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
    if (error instanceof jsonwebtoken_1.TokenExpiredError) {
        message = "Token expired. Please log in again.";
        statusCode = 401;
        status = "fail";
    }
    else if (error instanceof jsonwebtoken_1.JsonWebTokenError) {
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
exports.errorHandler = errorHandler;
