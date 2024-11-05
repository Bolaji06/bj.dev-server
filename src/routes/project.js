import express from "express"
import { fetchAllProjects, addProject, updateProject, getProject, deleteProject } from "../controller/project.controller.js";
import { authorization } from "../utils/authorization.js"


const router = express.Router();

router.get('/', fetchAllProjects);
router.get("/:title", getProject);
router.post('/', authorization, addProject);
router.patch("/:title", updateProject);
router.delete("/:title", deleteProject);

export default router;