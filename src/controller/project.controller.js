import prisma from "../lib/prisma.js";

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
 * @returns - { success: boolean, message: status }
 */
export async function getProject(req, res) {
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
 * @returns - { success: boolean, message: status }
 */
export async function addProject(req, res) {
  const { title, description, githubUrl, url, stacks, thumbnail, about } =
    req.body;

  try {
    await prisma.project.create({
      data: {
        title,
        description,
        githubUrl,
        url,
        stacks,
        thumbnail,
        about,
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

  console.log(projectTitle);

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
    await prisma.project.update({
      where: {
        title: project.title,
      },
      data: {
        ...body,
      },
    });
    return res
      .status(201)
      .json({ success: true, message: "updated successfully" });
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
 * @returns
 */
export async function deleteProject(req, res) {
  const projectTitle = req.params.title;

  try {
    const project = await prisma.project.findUnique({
      where: {
        title: projectTitle,
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: "not found" });
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
