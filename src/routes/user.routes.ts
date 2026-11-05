import express from "express"
import { authenticate } from "../middleware/auth.middleware";
import { getAllUser, getUserbyID } from "../controllers/user.controller";
import { All_Admin } from "../types/enumtypes";



const router=express.Router();

router.get("/:id",authenticate(),getUserbyID);
router.get("/",authenticate(All_Admin),getAllUser);

export default router;