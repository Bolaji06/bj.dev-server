import prisma from "../lib/prisma.js";
import findUser from "../utils/findUser.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getExperience(req, res) {
  try {
    const experience = await prisma.experience({});
    return res.status(200).json({ success: false, experience });
  } catch (error) {
    return res.status({ success: false, message: "internal server error" });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
export async function addExperience(req, res) {
  /**@type {import("@prisma/client").Experience} */
  const { company, role, description, startDate, endDate } = req.body;
  const id = req.user.id;

  try {
    await findUser(req, res, id);

    const experience = await prisma.experience.create({
      data: {
        company,
        role,
        startDate,
        endDate,
        description,
        userId: user.id,
      },
    });
    return res.status(200).json({ success: true, experience });
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
export async function updateExperience(req, res) {
  const body = req.body;
  const { title } = req.params;
  const id = req.user.id;

  if (!title) {
    return res
      .status(404)
      .json({ success: false, message: "title params not found" });
  }

  try {
    await findUser(req, res, id);
    await prisma.experience.update({
      where: {
        title,
      },
      data: {
        ...body,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "experience updated" });
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
export async function deleteExperience(req, res) {
  const id = req.user.id;
  const { title } = req.params;

  try {
    findUser(req, res, id);
    await prisma.experience.delete({
      where: {
        title,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "experience deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}
