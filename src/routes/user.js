import express from "express";
import { getUsers } from "../controller/user.controller.js";
import { authorization } from "../utils/authorization.js";

const router = express.Router();

router.get('/', authorization, getUsers)

export default router;