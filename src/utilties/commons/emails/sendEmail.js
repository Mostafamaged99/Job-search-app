import { createTransport } from "nodemailer";
import { emailHtml } from "./emailHtml.js";
import jwt from "jsonwebtoken";

export const sendEmail = async (email) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "moustfaabdo35@gmail.com",
      pass: "myrfbdmwzetsoyju",
    },
  });

  jwt.sign({ email }, "thisIsMySecterKey", async (err, token) => {
    const info = await transporter.sendMail({
      from: '"Mostafa Maged" <moustfaabdo35@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "verify your account", // Subject line
      text: "Job Search", // plain text body
      html: emailHtml(token), // html body
    });
  });

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};