"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up & running",
        success: true,
        data: null,
    });
});
app.use("/api/v1", routes_1.default);
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
