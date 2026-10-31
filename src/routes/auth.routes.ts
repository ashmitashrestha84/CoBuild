import express from "express";
import { getMe, login, logout, register } from "../controllers/auth.controller";
import { uploader } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";
const upload = uploader();

const router = express.Router();
router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
router.get("/me",authenticate(),getMe);
router.post("/logout",authenticate(),logout)
export default router;
