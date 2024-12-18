
import express from "express";
import { addBug, deleteBug, getAllBugs, getBug, updateBug } from "../controller/bug-buster.controller.js";
import { authorization } from "../utils/authorization.js";

const router = express.Router();

router.get("/", getAllBugs);
router.get("/:id", getBug);
router.post("/", authorization, addBug);
router.patch("/:id", authorization, updateBug);
router.delete("/:id", authorization, deleteBug);

export default router;