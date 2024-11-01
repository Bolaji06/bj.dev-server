// Copyright (c) bj.dev
// Licensed under the MIT License.

import { sendContactEmail } from "../utils/sendEmail.js";

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response}} res 
 * @returns - { success: boolean, message: string }
 */
export async function sendEmail(req, res){
    const { name, email, message } = req.body

    try{
        await sendContactEmail(email, name, message);
        return res.status(200).json({ success: true, message: "email sent" })

    }catch(err){
        return res.status(500).json({ success: false, message: 'server error' });
    }
}