import express from "express"
import { fetchAllProjects, addProject, updateProject, getProject, deleteProject } from "../controller/project.controller.js";


const router = express.Router();

router.get('/', fetchAllProjects);
router.get("/:title", getProject);
router.post('/', addProject);
router.patch("/:title", updateProject);
router.delete("/:title", deleteProject);

export default router;