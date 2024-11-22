
import express from "express";
import { getChat } from "../controller/chat.controller.js";

const router = express.Router();

router.post("/", getChat)

export default router;