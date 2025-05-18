
import express from "express";
import myProfile, { getMyProfile } from "../controller/ai-profile.controller.js";


const router = express.Router();

router.post("/", myProfile);
router.get("/", getMyProfile);

export default router;