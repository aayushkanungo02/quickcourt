import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"QuickCourt" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log(`📧 Email sent to ${to}`);
};

export default sendEmail;
