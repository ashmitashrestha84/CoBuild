import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProject,
  getmyProject,
  getProjectById,
  updateProject,
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
router.patch("/update-project", authenticate(), updateProject);

export default router;
