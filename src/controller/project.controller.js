import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import findUser from "../utils/findUser.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function fetchAllProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({});
    return res.status(200).json({ success: true, projects });
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
 * @returns - { success: boolean, message: status }
 */
export async function getProject(req, res){
  const projectTitle = req.params.title;

  try {
    const project = await prisma.project.findUnique({
      where: {
        title: projectTitle,
      },
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }
    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
}

/**
 * project typedef
 * @typedef {import("@prisma/client").Project} Project
 */

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns - { success: boolean, message: status }
 */
export async function addProject(req, res) {
  /**@type {Project} */
  const { about, description, githubUrl, thumbnail, title, url, stacks } =
    req.body;
  const id = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        url,
        thumbnail,
        about,
        stacks,
        userId: user.id,
      },
    });
    return res.status(201).json({ success: true, message: "project created" });
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
export async function updateProject(req, res) {
  const projectTitle = req.params.title;
  const body = req.body;
  const id = req.user.id;

  try {
   await findUser(req, res, id)

    const project = await prisma.project.findFirst({
      where: {
        title: projectTitle,
      },
    });
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }
    await prisma.project.update({
      where: {
        id: project.id,
      },
      data: {
        ...body,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "updated successfully" });
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
export async function deleteProject(req, res) {
  const projectTitle = req.params.title;
  const id = req.user.id;

  try {
    await findUser(req, res, id);

    const project = await prisma.project.findUnique({
      where: {
        title: projectTitle,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "project not found" });
    }

    await prisma.project.delete({
      where: {
        title: project.title,
      },
    });
    return res.status(200).json({ success: true, message: "project deleted" });
  } catch (error) {
    return res.status(500).json();
  }
}
