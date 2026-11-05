import express from "express"
import { authenticate } from "../middleware/auth.middleware";
import { getbyID } from "../controllers/user.controller";


const router=express.Router();

router.get("/:id",authenticate(),getbyID);