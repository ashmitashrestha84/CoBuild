import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import joinRequestRoutes from "./joinRequest.routes";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/join-request", joinRequestRoutes);
export default router;
