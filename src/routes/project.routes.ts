import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createProject } from "../controllers/project.controller";

const router = express.Router();

//create project
router.post("/create project", authenticate(), createProject);
