import { json } from "express";
import prisma from "../lib/prisma.js";

export async function getUsers(req, res){
    const user = req.user

    console.log(user);

    try{
        const users = await prisma.user.findMany({})
        return res.json({ success: true, users })

    }catch(error){
        return res.status(500).json({ success: false, message: 'internal server error' });
    }
}