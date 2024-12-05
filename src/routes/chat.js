import express from "express";
import { getChat, RAGChat } from "../controller/chat.controller.js";

const router = express.Router();

router.get("/", RAGChat);
router.post("/", getChat);

export default router;
