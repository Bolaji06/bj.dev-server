import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 *
 * @param {import("express").Request} req
 * @param {import ("express").Response} res
 */
export async function register(req, res) {
  /**@type {import('@prisma/client').User} */
  const { email, password } = req.body;

  const salt = 10;
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await prisma.user.findUnique({
      where: { email: email },
    });
    if (user) {
      return res
        .status(200)
        .json({ success: false, message: "user already exists" });
    }

    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });
    return res
      .status(201)
      .json({ success: false, message: "new user created" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function login(req, res) {
  /**@type {import('@prisma/client').User} */
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "no user with this email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(404)
        .json({ success: false, message: "password is invalid" });
    }
    const cookiePayload = { id: user.id, name: user.name, email: user.email };

    const jwtPayload = jwt.sign(cookiePayload, process.env.JWT_TOKEN, {
      expiresIn: "2 days",
    });

    res.cookie("bj.dev-auth", jwtPayload);

    return res
      .status(200)
      .json({ success: true, message: "login successful", jwtPayload });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
