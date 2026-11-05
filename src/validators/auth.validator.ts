import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    full_name: z
      .string("fullname must be string")
      .min(3, "fullname must be at least 3 character long")
      .max(50, "fullname must not exceed 50 characters "),
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "email is required"
          : "invalid email format",
    }),
    password: z
      .string("password must br string")
      .min(6, "password must be at least 6 character long"),
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

export const updateProfileSchema = z.object({
  full_name: z.string().min(3).optional(),
  phone: z.string().optional(),
  bio: z.string().max(300).optional(),
  skills: z.array(z.string()).optional(),
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  portfolio: z.string().url().optional(),
});