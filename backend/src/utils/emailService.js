const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_FROM
  ) {
    throw new Error("SMTP credentials missing");
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"RentiGo" <${process.env.SMTP_FROM}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", subject);
  } catch (error) {
    console.log("EMAIL ERROR:", error.message);
  }
};

module.exports = sendEmail;
