'use server';

import { Resend } from 'resend';

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export async function sendRecruitmentEmail(formData: FormData) {
  const resend = getResend();
  
  if (!resend) {
    return { success: false, error: "Email service not configured. Please add RESEND_API_KEY to .env" };
  }
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;
  const portfolio = formData.get('portfolio') as string;
  const message = formData.get('message') as string;

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Email service not configured. Please add RESEND_API_KEY to .env" };
  }

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Default sender before domain verification
      to: 'work.tilakpopatfilms@gmail.com',
      subject: `New Application: ${name} [${role}]`,
      html: `
        <h1>New Job Application: ${name}</h1>
        <hr />
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Portfolio:</strong> <a href="${portfolio}">${portfolio}</a></p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p>Sent from TPF Website Recruitment Portal</p>
      `,
    });

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: error.message || "An error occurred while sending email." };
  }
}
