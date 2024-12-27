import prisma from "../lib/prisma.js";
import { validate as isUuid } from "uuid";
import { bugBusterSchema } from "../utils/validation.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getAllBugs(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (page <= 0) {
    return res.status(400).json({ success: false, message: "Bad request" });
  }
  if (limit <= 0 || limit >= 30) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid limit value" });
  }
  try {
    const bugList = await prisma.bugBuster.findMany({
      skip: offset,
      take: parseInt(limit, 10),
      orderBy: { createdAt: "desc" },
    });
    const total = await prisma.bugBuster.count();

    return res.status(200).json({
      success: true,
      bugList,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      },
    });
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
 *
 */
export async function getBug(req, res) {
  const bugId = req.params.id;

  if (!isUuid(bugId)) {
    return res.status(400).json({ success: false, message: "Invalid uuid" });
  }

  try {
    const bug = await prisma.bugBuster.findUnique({
      where: {
        id: bugId,
      },
    });
    if (!bug) {
      return res.status(404).json({ success: false, message: "No bug found" });
    }
    return res.status(200).json({ success: true, bug });
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
export async function addBug(req, res) {
  const userId = req.user.id;
  const { error } = bugBusterSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  const { title, backstory, tags, solution } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }
    const newBug = await prisma.bugBuster.create({
      data: {
        title,
        backstory,
        solution,
        tags: JSON.parse(tags),
      },
    });
    return res.status(201).json({ success: true, newBug });
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
export async function updateBug(req, res) {
  const userId = req.user.id;
  const data = req.body;
  const paramId = req.params.id;

  if (!isUuid(paramId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid param id" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }

    const updatedBug = await prisma.bugBuster.update({
      where: {
        id: paramId,
      },
      data: {
        ...data,
        tags: JSON.parse(data.tags),
      },
    });
    return res.status(200).json({ success: true, updatedBug });
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
export async function deleteBug(req, res) {
  const userId = req.user.id;
  const paramId = req.params.id;

  if (!isUuid(paramId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid param id" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Admin user not found" });
    }
    await prisma.bugBuster.delete({
      where: {
        id: paramId,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Bug buster deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
