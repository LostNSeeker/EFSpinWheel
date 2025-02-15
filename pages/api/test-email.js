// pages/api/test-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log("Test email endpoint hit"); // For debugging

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "ankitkumarsoni656.iitkgp@gmail.com",
      subject: "Test Email",
      text: "This is a test email from your Next.js application!"
    });

    console.log("Email sent:", info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message });
  }
}