import express from "express"
import { authenticate } from "../middleware/auth.middleware";
import { getUserbyID } from "../controllers/user.controller";


const router=express.Router();

router.get("/:id",authenticate(),getUserbyID);

export default router;