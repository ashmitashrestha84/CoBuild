import mongoose, { Schema } from "mongoose";
import { ProjectStatus, ProjectVisibility } from "../types/enumtypes";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Project title must be at least 3 characters"],
      maxlength: [100, "Project title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: [true, "Project category is required"],
      trim: true,
    },

    tech_stack: {
      type: [String],
      required: [true, "Technology stack is required"],
      default: [],
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Project owner is required"],
    },

    status: {
      type: String,
      status: Object.values(ProjectStatus),
      default:ProjectStatus.PLANNING,
    },

    visibility: {
      type: String,
      visibility: Object.values(ProjectVisibility),
      default: ProjectVisibility.PUBLIC,
    },

    cover_image: {
      type: {
        path: String,
        public_id: String,
      },
      default: null,
    },

    required_skills: {
      type: [String],
      default: [],
    },

    github_url: {
      type: String,
      trim: true,
    },

    demo_url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("project", projectSchema);

export default Project;
