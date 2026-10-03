"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const ENV_CONFIG = {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
};
exports.default = ENV_CONFIG;
