import z from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    full_name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .optional(),

    phone: z.string().optional(),

    bio: z.string().max(300, "Bio must not exceed 300 characters").optional(),

    skills: z.array(z.string()).optional(),

    github: z.url("Invalid GitHub URL").optional(),

    linkedin: z.url("Invalid LinkedIn URL").optional(),

    portfolio: z.url("Invalid portfolio URL").optional(),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
