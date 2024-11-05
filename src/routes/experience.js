
import express from "express";
import { addExperience, deleteExperience, getExperience, updateExperience } from "../controller/experience.controller.js";
import { authorization } from "../utils/authorization.js"

const router = express.Router();

router.post('/', authorization, addExperience);
router.get('/', getExperience);
router.patch('/:title', authorization, updateExperience);
router.delete('/:title', authorization, deleteExperience);

export default router;