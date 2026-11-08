import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createProject,
  getAllProject,
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

export default router;
