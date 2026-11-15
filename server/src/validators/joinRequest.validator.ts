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
