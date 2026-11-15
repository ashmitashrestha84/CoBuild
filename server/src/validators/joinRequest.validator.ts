import { z } from "zod";

export const createJoinRequestSchema = z.object({
  body: z
    .object({
      project: z.string().regex(/^[0-9a-fA-f]{24}$/, "Invalid project ID"),
      message: z
        .string("message must be string")
        .trim()
        .min(1, "message is required")
        .max(500, "message cannot exceed 500 characters"),
    })
    .strict(),

  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const getProjectRequestsSchema = z.object({
  body: z.object({}).default({}),

  params: z.object({
    projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "invalid project ID"),
  }),

  query: z.object({
    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
