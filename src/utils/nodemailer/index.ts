import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export const EMAIL_TEMPLATE: Record<string, string> = {
  CODE_VERIFICATION: "codeVerification",
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAIL_EMAIL_USER,
    pass: process.env.NODEMAIL_EMAIL_PASS,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  templateName: string,
  templateData: Record<string, string>
) {
  try {
    const templatePath = path.join(
      __dirname,
      "templates",
      `${templateName}.html`
    );
    let htmlContent = fs.readFileSync(templatePath, "utf-8");

    Object.entries(templateData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      htmlContent = htmlContent.replace(regex, value);
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    throw error;
  }
}

export async function sendCodeVerification(
  to: string,
  name: string,
  code: string
) {
  const templateData = {
    name,
    verification_code: code,
  };

  await sendEmail(
    to,
    "Receitas da Gabi | Código de Verificação",
    EMAIL_TEMPLATE.CODE_VERIFICATION,
    templateData
  );
}
