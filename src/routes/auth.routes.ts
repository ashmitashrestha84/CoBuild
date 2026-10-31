import express from "express";
import { login, register } from "../controllers/auth.controller";
import { uploader } from "../middleware/multer.middleware";
const upload = uploader();

const router = express.Router();
router.post("/register", upload.single("profile_image"), register);
router.post("/login", login);
export default router;
