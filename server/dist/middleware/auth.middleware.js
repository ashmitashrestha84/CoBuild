"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const authenticate = (role) => {
    return (req, res, next) => {
        try {
            //get access token
            const cookies = req.cookies;
            const access_token = cookies["access_token"];
            if (!access_token) {
                throw new appError_utils_1.default("Unauthorized Access.Login required", 401);
            }
            //verify access token
            const decoded_data = (0, jwt_utils_1.verifyJwtToken)(access_token);
            if (!decoded_data) {
                throw new appError_utils_1.default("Invalid token.Login Required", 401);
            }
            console.log(decoded_data);
            //check token expiry
            if (decoded_data.exp * 1000 < Date.now()) {
                res.clearCookie("access_token", {
                    httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true, //production->true  development->false
                    secure: env_config_1.default.NODE_ENV === "development" ? false : true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: env_config_1.default.NODE_ENV === "development" ? "lax" : "none",
                });
                throw new appError_utils_1.default("Token Expired.Access Denied", 401);
            }
            // check role
            if (role && role.length > 0 && !role.includes(decoded_data.role)) {
                throw new appError_utils_1.default("unauthorized.Access denied", 401);
            }
            req.user = {
                _id: decoded_data._id,
                email: decoded_data.email,
                role: decoded_data.role,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
