import nodemailer from "nodemailer";
import {
  getRegistrationSubject,
  getRegistrationTemplate,
  type UserType,
  newEventSubject,
  newEventTemplate,
  pointsAddedTemplate,
  recycleRequestReceivedTemplate,
  redeemCouponTemplate,
  forgetPasswordTemplate,
  unregisteredRecycleTemplate,
} from "./mailTemplates";

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function ensureSmtpConfigured() {
  if (
    !process.env.SMTP_SERVICE ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.warn("SMTP env vars missing; skipping email send.");
    return false;
  }
  return true;
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  userType: UserType = "customer",
) {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to,
    subject: getRegistrationSubject(userType),
    html: getRegistrationTemplate(userType, { name }),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendNewEventEmail(
  to: string,
  userName: string | undefined,
  event: {
    title: string;
    date?: string;
    location?: string;
    description?: string;
  },
) {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to,
    subject: newEventSubject({ title: event.title }),
    html: newEventTemplate({ name: userName }, event),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send new event email:", error);
  }
}

export const sendRedeemingMail = async (
  email: string,
  name: string,
  code: string,
  validTo: Date,
  rate: number,
) => {
  await transporter
    .sendMail({
      to: email,
      subject: "Your EcoSphere Reward Code 🎁",
      html: redeemCouponTemplate(code, validTo, rate, name),
    })
    .catch((error) => console.error("Failed to send new event email:", error));
};

export async function sendForgetPasswordMail(
  email: string,
  name: string,
  code: string,
  validTo: string,
) {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to: email,
    subject: "Reset your EcoSphere password",
    html: forgetPasswordTemplate(code, validTo, name),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send forget password email:", error);
  }
}

export const sendPointsAddedEmail = async (
  email: string,
  name: string,
  points: number,
) => {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to: email,
    subject: "Eco Points Added to Your Account 🌱✨",
    html: pointsAddedTemplate({ name }, points),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send points added email:", error);
  }
};

export const sendUnregisteredRecycleEmail = async (
  email: string,
  name?: string,
) => {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to: email,
    subject:
      "Thanks for Recycling with EcoSphere ♻️ – Don’t Miss Your Eco Points!",
    html: unregisteredRecycleTemplate({ name }),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send unregistered recycle email:", error);
  }
};

export const sendRecycleRequestReceivedEmail = async (
  email: string,
  name?: string,
) => {
  if (!ensureSmtpConfigured()) return;

  const mailOptions = {
    from: `"EcoSphere" <no-reply@ecosphere.com>`,
    to: email,
    subject: "We’ve Received Your Recycling Request ♻️",
    html: recycleRequestReceivedTemplate({ name }),
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send recycle request received email:", error);
  }
};
