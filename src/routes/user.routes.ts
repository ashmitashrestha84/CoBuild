import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getAllAdmins,
  getAllUser,
  getUserbyID,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller";
import { All_Admin } from "../types/enumtypes";
import { uploader } from "../middleware/multer.middleware";
import { validate } from "../middleware/validator.middleware";
import { updateProfileSchema } from "../validators/user.validator";

const router = express.Router();
const upload = uploader();

// Get all users (Admin and Super Admin)
router.get("/users", authenticate(All_Admin), getAllUser);

// Get all admins (Admin and Super Admin)
router.get("/admin", authenticate(All_Admin), getAllAdmins);

// Get user by ID
router.get("/:id", authenticate(), getUserbyID);

// update profile
router.patch(
  "/profile",
  authenticate(),
  validate(updateProfileSchema),
  updateProfile,
);

// Update profile image
router.patch(
  "/profile-image",
  authenticate(),
  upload.single("profile_image"),
  updateProfileImage,
);

export default router;
