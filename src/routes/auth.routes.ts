import express from "express";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../controllers/auth.controller";
import { uploader } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";
const upload = uploader();

const router = express.Router();
router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.get("/me", authenticate(), getMe);
router.post("/logout", authenticate(), logout);
router.patch("/change-password", authenticate(), changePassword);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
export default router;
