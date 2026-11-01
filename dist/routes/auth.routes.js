"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middleware_1 = require("../middleware/multer.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload = (0, multer_middleware_1.uploader)();
const router = express_1.default.Router();
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.get("/me", (0, auth_middleware_1.authenticate)(), auth_controller_1.getMe);
router.post("/logout", (0, auth_middleware_1.authenticate)(), auth_controller_1.logout);
router.patch("/change-password", (0, auth_middleware_1.authenticate)(), auth_controller_1.changePassword);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.patch("/reset-password", auth_controller_1.resetPassword);
exports.default = router;
