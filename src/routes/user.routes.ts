import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getAllUser, getUserbyID, updateProfileImage } from "../controllers/user.controller";
import { All_Admin } from "../types/enumtypes";
import { uploader } from "../middleware/multer.middleware";

const router = express.Router();
const upload=uploader()
router.get("/:id", authenticate(), getUserbyID);
router.get("/", authenticate(All_Admin), getAllUser);
router.patch(
  "/profile-image",
  upload.single("profile_image"),
  authenticate(),
  updateProfileImage
);
export default router;
