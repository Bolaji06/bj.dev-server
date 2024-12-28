import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({});
    return res.json({ success: true, users });
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
export async function getUser(req, res) {
  const paramId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(paramId),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    return res
      .status(200)
      .json({ success: true, user: { ...user, password: null } });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateUser(req, res) {
  const id = req.params.id;
  const body = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...body,
      },
    });
    return res.status(200).json({ success: true, message: "user updated" });
  } catch (error) {
    console.log(error);
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
export default async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(404)
        .status({ success: false, message: "user not found" });
    }
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return res.status(200).json({ success: true, message: "user deleted" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
