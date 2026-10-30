import express from "express";
import { register } from "../controllers/auth.controller";
import { uploader } from "../middleware/multer.middleware";
const upload = uploader();

const router = express.Router();
router.post(
  "/register",
  (req, res, next) => {
    console.log("1. Request received");
    next();
  },
  upload.single("profile_image"),
  (req, res, next) => {
    console.log("2. Multer completed");
    console.log("Body:", req.body);
    console.log("File:", req.file);
    next();
  },
  register,
);

export default router;
