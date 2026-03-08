import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "bf7a88f3f220e1",
      pass: "4ea6822e39e9a6"
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