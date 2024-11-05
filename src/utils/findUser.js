import prisma from "../lib/prisma.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {Number} id
 */
export default async function findUser(req, res, id){
    
    const user = await prisma.user.findUnique({
        where: id
    });
    if(!user){
        return res.status(400).json({ success: false, message: "user not found" });
    }
}