import express from "express";
import { sendEmail } from "../controller/sendEmail.controller.js";

const router = express.Router();

router.post("/", sendEmail);

export default router;
