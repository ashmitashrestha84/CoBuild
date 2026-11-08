import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Project from "../model/projectmodel";
import { upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import appError from "../utils/appError.utils";
import { ProjectVisibility } from "../types/enumtypes";

const uploadFolder = "/cover-image";

//* Create Project
export const createProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      description,
      category,
      tech_stack,
      status,
      visibility,
      required_skills,
      github_url,
      demo_url,
    } = req.body;
    const file = req.file;
    const project = new Project({
      title,
      description,
      category,
      tech_stack,
      owner: req.user._id,
      status,
      visibility,
      required_skills,
      github_url,
      demo_url,
    });
    if (file) {
      const { path, public_id } = await upload(file, uploadFolder);
      project.cover_image = {
        path,
        public_id,
      };
    }
    await project.save();
    sendResponse(res, {
      message: "Project created successfully",
      statusCode: 201,
      data: project,
    });
  },
);

//* Get All Projects
export const getAllProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const projects = await Project.find({
      visibility: ProjectVisibility.PUBLIC,
    });

    if (projects.length === 0) {
      throw new appError("No projects found", 404);
    }

    sendResponse(res, {
      message: "Projects fetched successfully",
      statusCode: 200,
      data: projects,
    });
  },
);

//* Get Project by ID

//* Get My Projects

//* Update Project

//* Delete Project

//* Search Projects
