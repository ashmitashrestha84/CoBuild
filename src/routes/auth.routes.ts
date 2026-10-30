import express from "express";
import { register } from "../controllers/auth.controller";
import { uploader } from "../middleware/multer.middleware";
const upload = uploader();

const router = express.Router();
router.post("/register", upload.single("profile_image"), register);

export default router;
