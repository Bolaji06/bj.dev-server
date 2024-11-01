// Copyright (c) bj.dev
// Licensed under the MIT License.

import nodemailer from "nodemailer";

/**
 * @description fFunction that send contact for email
 * @param {String} email - Sender email address
 * @param {String} name - Sender name
 * @param {String} message  - Email message body
 */
export async function sendContactEmail(email, name, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
    const mailOptions = {
      from: email,
      to: process.env.HOST_EMAIL,
      subject: "Contact email from bj.dev " + name,
      text: message,
    };

    const sendMessage = await transporter.sendMail(mailOptions);
    return sendMessage.messageId;
  } catch (error) {
    console.log(error);
  }
}
