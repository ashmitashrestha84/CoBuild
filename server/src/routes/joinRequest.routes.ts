import express from "express";
import { createJoinRequest } from "../controllers/joinRequest.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validator.middleware";
import { createJoinRequestSchema } from "../validators/joinRequest.validator";

const router = express.Router();
router.post(
  "/project/:projectId",
  authenticate,
  validate(createJoinRequestSchema),
  createJoinRequest,
);
export default router;
