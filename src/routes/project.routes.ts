import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProject,
  getmyProject,
  getProjectById,
  updateProject,
  updateProjectCoverImage,
} from "../controllers/project.controller";
import { uploader } from "../middleware/multer.middleware";

const router = express.Router();
const upload = uploader();

//create project
router.post(
  "/create",
  authenticate(),
  upload.single("cover_image"),
  createProject,
);

//get all project
router.get("/", authenticate(), getAllProject);

//get my project
router.get("/myProject", authenticate(), getmyProject);

//get project by id
router.get("/:id", authenticate(), getProjectById);

//update project
router.patch("/:id/update-project", authenticate(), updateProject);

//update cover-image
router.patch(
  "/:id/cover-image",
  authenticate(),
  upload.single("cover_image"),
  updateProjectCoverImage,
);

export default router;
