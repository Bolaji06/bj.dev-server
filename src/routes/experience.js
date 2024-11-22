
import express from "express";
import { addExperience, deleteExperience, getExperience, getExperiences, updateExperience } from "../controller/experience.controller.js";
import { authorization } from "../utils/authorization.js"

const router = express.Router();

router.get('/', getExperiences);
router.get('/:title', getExperience);
router.post('/', authorization, addExperience);
router.patch('/:title', authorization, updateExperience);
router.delete('/:title', authorization, deleteExperience);

export default router;