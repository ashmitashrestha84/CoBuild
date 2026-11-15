"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const env_config_1 = __importDefault(require("./config/env.config"));
const db_config_1 = require("./config/db.config");
const PORT = env_config_1.default.PORT;
const DB_URI = env_config_1.default.DB_URI;
(0, db_config_1.connectDatabase)(DB_URI);
const server = app_1.default.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
