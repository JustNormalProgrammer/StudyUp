import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const mailOptions = {
        from: "noreply@studyup.com",
        to: email,
        subject: "Verify your email",
        text: `Click here to verify your email: http://localhost:5000/auth/verify-email/${verificationToken}`,
    };
    await transport.sendMail(mailOptions);
};