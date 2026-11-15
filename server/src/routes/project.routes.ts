import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { uploader } from "../middleware/multer.middleware";


import {
  createProject,
  deleteProject,
  getAllProject,
  getmyProject,
  getProjectById,
  searchProjects,
  updateProject,
  updateProjectCoverImage,
} from "../controllers/project.controller";
import { validate } from "../middleware/validator.middleware";
import { createProjectSchema, deleteProjectSchema, getProjectByIdSchema, searchProjectSchema, updateProjectCoverImageSchema, updateProjectSchema } from "../validators/project..validators";


const router = express.Router();
const upload = uploader();

// Create project
router.post(
  "/create",
  authenticate(),
  upload.single("cover_image"),
  validate(createProjectSchema),
  createProject,
);

// Get all projects
router.get("/", authenticate(), getAllProject);

// Get my projects
router.get("/myProject", authenticate(), getmyProject);

// Search projects
router.get(
  "/search",
  authenticate(),
  validate(searchProjectSchema),
  searchProjects,
);

// Get project by ID
router.get(
  "/:id",
  authenticate(),
  validate(getProjectByIdSchema),
  getProjectById,
);

// Update project
router.patch(
  "/:id/update-project",
  authenticate(),
  validate(updateProjectSchema),
  updateProject,
);

// Update cover image
router.patch(
  "/:id/cover-image",
  authenticate(),
  validate(updateProjectCoverImageSchema),
  upload.single("cover_image"),
  updateProjectCoverImage,
);

// Delete project
router.delete(
  "/:id",
  authenticate(),
  validate(deleteProjectSchema),
  deleteProject,
);

export default router;
