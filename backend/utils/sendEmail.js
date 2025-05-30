// /backend/utils/sendEmail.js
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
 service: "gmail", // Or another email provider
 auth: {
 user: process.env.EMAIL_USER,
 pass: process.env.EMAIL_PASS,
 },
});
export const sendEmail = async (to, subject, text) => {
 try {
 await transporter.sendMail({
 from: `"Job Portal" <${process.env.EMAIL_USER}>`,
 to,
 subject,
 text,
 });
 console.log("✅ Email sent to", to);
 } catch (err) {
 console.error("❌ Email sending failed:", err);
 }
};
