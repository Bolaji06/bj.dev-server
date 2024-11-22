import prisma from "../lib/prisma.js";
import findUser from "../utils/findUser.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getExperiences(req, res) {
  try {
    const experience = await prisma.experience.findMany({});
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
 * @returns 
 */
export async function getExperience(req, res){
  const { title } = req.params

  if (!title){
    return res.status(402).json({ success: false, message: "title params is missing" });
  }
  try {
    const experience = await prisma.experience.findFirst({
      where: {
        title
      },
    });
    if(!experience){
      return res.status(404).json({ success: false, message: "experience not found" });
    }
    return res.status(200).json({ success: true, experience });

  }catch(error){
    return res.status(500).json({ success: false, message: 'internal server error' });
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
  const { title, company, role, description, startDate, endDate } = req.body;
  const id = req.user.id;

  try {
    await findUser(req, res, id);

    const experience = await prisma.experience.create({
      data: {
        title,
        company,
        role,
        startDate,
        endDate,
        description,
        userId: id,
      },
    });
    return res.status(200).json({ success: true, message: "Experience added" });
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
    const experience = await prisma.experience.findFirst({
      where: {
        title,
      },
    });
    if (!experience) {
      return res
        .status(494)
        .json({ success: false, message: "experience not found" });
    }
    await prisma.experience.update({
      where: {
        id: experience.id,
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
    const experience = await prisma.experience.findFirst({
      where: {
        title,
      },
    });
    await prisma.experience.delete({
      where: {
        id: experience.id,
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
