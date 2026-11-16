import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    full_name: z
      .string("fullname must be string")
      .min(3, "fullname must be at least 3 character long")
      .max(50, "fullname must not exceed 50 characters"),

    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email format",
    }),

    password: z
      .string("password must be string")
      .min(6, "password must be at least 6 character long"),

    phone: z.coerce.number().optional(),

    bio: z.string().max(300).optional(),

    skills: z
      .union([
        z.array(z.string()),
        z.string().transform((value) => JSON.parse(value)),
      ])
      .optional(),

    github: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
  }),

  params: z.object({}).default({}),
  query: z.object({}).default({}),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email format",
    }),
    password: z
      .string("password must be string")
      .min(6, "password must be at least 6 character long"),
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
});
