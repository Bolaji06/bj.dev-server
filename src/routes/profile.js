
import express from "express";
import myProfile from "../controller/ai-profile.controller.js";

const router = express.Router();

router.post("/", myProfile);

export default router;