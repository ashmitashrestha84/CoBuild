import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  deleteUser,
  getAllAdmins,
  getAllUser,
  getUserbyID,
  searchUsers,
  updateProfile,
  updateProfileImage,
} from "../controllers/user.controller";
import { All_Admin } from "../types/enumtypes";
import { uploader } from "../middleware/multer.middleware";
import { validate } from "../middleware/validator.middleware";
import {
  searchProfileSchema,
  updateProfileSchema,
} from "../validators/user.validator";

const router = express.Router();
const upload = uploader();

// Get all users (Admin and Super Admin)
router.get("/users", authenticate(All_Admin), getAllUser);

// Get all admins (Admin and Super Admin)
router.get("/admin", authenticate(All_Admin), getAllAdmins);

//search user
router.get(
  "/search",
  authenticate(),
  validate(searchProfileSchema),
  searchUsers,
);

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

// Delete user
router.delete("/delete-account", authenticate(), deleteUser);
export default router;
