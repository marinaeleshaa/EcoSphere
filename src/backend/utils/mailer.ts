import nodemailer from "nodemailer";
import {
	registrationSubject,
	registrationTemplate,
	newEventSubject,
	newEventTemplate,
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
	if (!process.env.SMTP_SERVICE || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
		console.warn("SMTP env vars missing; skipping email send.");
		return false;
	}
	return true;
}

export async function sendWelcomeEmail(to: string, name: string) {
	if (!ensureSmtpConfigured()) return;

	const mailOptions = {
		from: `"EcoSphere" <no-reply@ecosphere.com>`,
		to,
		subject: registrationSubject,
		html: registrationTemplate({ name }),
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
	}
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

