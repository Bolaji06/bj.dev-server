import express from "express";
import {
  getUser,
  getUsers,
  updateUser,
} from "../controller/user.controller.js";
import { authorization } from "../utils/authorization.js";

const router = express.Router();

router.get("/", getUsers);
router.patch("/", authorization, updateUser);
router.get("/:id", getUser);

export default router;
