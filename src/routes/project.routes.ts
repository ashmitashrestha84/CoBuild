import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject } from "../controllers/project.controller";
import { uploader } from "../middleware/multer.middleware";

const router = express.Router();
const upload=uploader()

//create project
router.post("/create", authenticate(), upload.single("cover_image"),createProject);

export default router