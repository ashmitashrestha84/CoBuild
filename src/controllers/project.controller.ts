import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync.utils";
import Project from "../model/projectmodel";
import { deleteFile, upload } from "../utils/cloudinary.utils";
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
export const getProjectById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await Project.findOne({ _id: id });
    if (!project) {
      throw new appError("No project found", 404);
    }
    sendResponse(res, {
      message: "Project fetched successfully",
      statusCode: 200,
      data: project,
    });
  },
);

//* Get My Projects
export const getmyProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const project = await Project.find({ owner: req.user._id });

    if (project.length === 0) {
      throw new appError("You have not created any projects yet", 404);
    }
    sendResponse(res, {
      message: "Project fetched successfully",
      statusCode: 200,
      data: project,
    });
  },
);

//* Update Project
export const updateProject = catchAsync(
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
    const { id } = req.params;
    const project = await Project.findOne({ _id: id, owner: req.user._id });

    if (!project) {
      throw new appError("Project not found or you are not the owner", 404);
    }
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (category !== undefined) project.category = category;
    if (tech_stack !== undefined) project.tech_stack = tech_stack;
    if (status !== undefined) project.status = status;
    if (visibility !== undefined) project.visibility = visibility;
    if (required_skills !== undefined)
      project.required_skills = required_skills;
    if (github_url !== undefined) project.github_url = github_url;
    if (demo_url !== undefined) project.demo_url = demo_url;

    await project.save();

    sendResponse(res, {
      message: "Project updated successfully",
      statusCode: 200,
      data: project,
    });
  },
);

//* update cover-image
export const updateProjectCoverImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const { id } = req.params;
    if (!file) {
      throw new appError("cover_image is required", 400);
    }
    const project = await Project.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!project) {
      throw new appError("Project not found or you are not the owner", 404);
    }
    const oldPublicId = project.cover_image?.public_id;
    const { path, public_id } = await upload(file, uploadFolder);
    project.cover_image = {
      path,
      public_id,
    };

    await project.save();
    if (oldPublicId) {
      await deleteFile(oldPublicId);
    }
    sendResponse(res, {
      message: "Project Cover Image updated successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//* Delete Project
//* deleteProject
export const deleteProject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const project = await Project.findOne({
      _id: id,
      owner: req.user._id,
    });

    if (!project) {
      throw new appError("Project not found or you are not the owner", 404);
    }
    if (project.cover_image?.public_id) {
      await deleteFile(project.cover_image.public_id);
    }

    await project.deleteOne();
    sendResponse(res, {
      message: "Project deleted successfully",
      statusCode: 200,
      data: null,
    });
  },
);

//* Search Project
