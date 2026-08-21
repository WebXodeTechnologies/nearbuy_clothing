import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER, // streetunics@gmail.com
    pass: process.env.SMTP_PASS, // Your 16-character app password
  },
});

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Streetunics" <streetunics@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email via Nodemailer:", error);
    throw new Error(error.message || "Failed to send email");
  }
}
