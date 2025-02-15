// pages/api/send-email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, name, expiryDate } = req.body;

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Email content
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: to,
      subject: 'Your Paradise Discount Voucher!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Congratulations ${name}!</h2>
          <p>Thank you for participating in our spin wheel game!</p>
          <p>Here's your reward:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #28a745; margin: 0;">10% DISCOUNT</h3>
            <p style="margin: 10px 0 0 0;">Valid at all Paradise outlets</p>
          </div>
          <p>This voucher is valid until ${expiryDate}</p>
          <p><strong>Terms & Conditions:</strong></p>
          <ul>
            <li>Valid on all menu items</li>
            <li>Cannot be combined with other offers</li>
            <li>Valid for dine-in only</li>
            <li>Show this email at the time of billing</li>
          </ul>
          <p>We look forward to serving you!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
}