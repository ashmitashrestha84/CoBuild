import { z } from "zod";
import { ProjectStatus, ProjectVisibility } from "../types/enumtypes";

//* Create Project
export const createProjectSchema = z.object({
  body: z.object({
    title: z
      .string("title must be string")
      .min(3, "title must be at least 3 characters long")
      .max(100, "title must not exceed 100 characters"),

    description: z
      .string("description must be string")
      .min(10, "description must be at least 10 characters long"),

    category: z
      .string("category must be string")
      .min(1, "category is required"),

    tech_stack: z
      .array(z.string().min(1))
      .min(1, "at least one technology is required"),

    status: z.enum(ProjectStatus).optional(),

    visibility: z.enum(ProjectVisibility).optional(),

    required_skills: z.array(z.string().min(1)).optional(),

    github_url: z.url("invalid github URL").optional(),

    demo_url: z.url("invalid demo URL").optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

//* Update Project
export const updateProjectSchema = z.object({
  body: z
    .object({
      title: z
        .string("title must be string")
        .min(3, "title must be at least 3 characters long")
        .max(100, "title must not exceed 100 characters")
        .optional(),

      description: z
        .string("description must be string")
        .min(10, "description must be at least 10 characters long")
        .optional(),

      category: z
        .string("category must be string")
        .min(1, "category is required")
        .optional(),

      tech_stack: z
        .array(z.string().min(1))
        .min(1, "at least one technology is required")
        .optional(),

      status: z.enum(ProjectStatus).optional(),

      visibility: z.enum(ProjectVisibility).optional(),

      required_skills: z.array(z.string().min(1)).optional(),

      github_url: z.url("invalid github URL").optional(),

      demo_url: z.url("invalid demo URL").optional(),
    })
    .strict(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid project ID"),
  }),
  query: z.object({}).default({}),
});

//* Get Project By ID
export const getProjectByIdSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid project ID"),
  }),
  query: z.object({}).default({}),
});

//* Delete Project
export const deleteProjectSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid project ID"),
  }),
  query: z.object({}).default({}),
});

//* Update Project Cover Image
export const updateProjectCoverImageSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid project ID"),
  }),
  query: z.object({}).default({}),
});

//* Search Project
export const searchProjectSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    q: z.string().optional(),

    category: z.string().optional(),

    status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED"]).optional(),

    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
