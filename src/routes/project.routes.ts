import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProject,
  getmyProject,
  getProjectById,
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

//get project by id
router.get("/:id", authenticate(), getProjectById);

//get my project
router.get("/myproject", authenticate(), getmyProject);
export default router;
