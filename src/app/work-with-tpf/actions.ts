'use server';

import { Resend } from 'resend';
import { headers } from 'next/headers';

const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

// ─── Rate Limiter (In-Memory Sliding Window) ──────────────────────────────────
const submissionLimitMap = new Map<string, { count: number; resetTime: number }>();
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const record = submissionLimitMap.get(clientIp);

  // Clean up expired entry
  if (!record || now > record.resetTime) {
    submissionLimitMap.set(clientIp, { count: 1, resetTime: now + WINDOW_DURATION_MS });
    return false;
  }

  if (record.count >= MAX_SUBMISSIONS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

// ─── Input Sanitization & Validation Helpers ─────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

function isValidHttpUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const ALLOWED_ROLES = new Set([
  'Editor',
  'Designer',
  'Motion Designer',
  '2D Artist',
  '3D Artist',
  'Asst. Director',
  'Actor/Actress',
  'Other',
]);

// ─── Send Recruitment Email Action ───────────────────────────────────────────

export async function sendRecruitmentEmail(formData: FormData) {
  // 1. Anti-Bot Honeypot Defense:
  // If the hidden 'website' field is populated, a spambot filled it.
  const honeypot = (formData.get('website') as string) || '';
  if (honeypot.trim().length > 0) {
    // Silently return success to waste the bot's time without sending any email
    return { success: true };
  }

  // 2. Rate Limiting by Client IP
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown-ip';

    if (isRateLimited(clientIp)) {
      return {
        success: false,
        error: 'Too many submissions. Please wait 15 minutes before submitting again.',
      };
    }
  } catch (err) {
    // Continue if headers reading fails in unexpected environments
  }

  // 3. Verify Email Service Configuration
  const resend = getResend();
  if (!resend) {
    return {
      success: false,
      error: 'Email service configuration is pending on server. Please try again shortly.',
    };
  }

  // 4. Extract and Validate Form Inputs
  const rawName = ((formData.get('name') as string) || '').trim();
  const rawEmail = ((formData.get('email') as string) || '').trim();
  const rawPhone = ((formData.get('phone') as string) || '').trim();
  const rawRole = ((formData.get('role') as string) || '').trim();
  const rawPortfolio = ((formData.get('portfolio') as string) || '').trim();
  const rawMessage = ((formData.get('message') as string) || '').trim();

  // Field validation
  if (!rawName || rawName.length > 100) {
    return { success: false, error: 'Please enter a valid name (maximum 100 characters).' };
  }

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!rawPhone || rawPhone.length > 30 || !/^[+0-9\s-()]+$/.test(rawPhone)) {
    return { success: false, error: 'Please provide a valid phone number.' };
  }

  if (!rawRole || !ALLOWED_ROLES.has(rawRole)) {
    return { success: false, error: 'Please select a valid role from the list.' };
  }

  if (!rawPortfolio || !isValidHttpUrl(rawPortfolio) || rawPortfolio.length > 500) {
    return {
      success: false,
      error: 'Please enter a valid portfolio web link starting with http:// or https://.',
    };
  }

  if (rawMessage.length > 5000) {
    return { success: false, error: 'Message cannot exceed 5000 characters.' };
  }

  // 5. Sanitize HTML Content to neutralize XSS & HTML Injection
  const safeName = escapeHtml(rawName);
  const safeEmail = escapeHtml(rawEmail);
  const safePhone = escapeHtml(rawPhone);
  const safeRole = escapeHtml(rawRole);
  const safePortfolio = escapeHtml(rawPortfolio);
  const safeMessage = escapeHtml(rawMessage);

  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'work.tilakpopatfilms@gmail.com',
      replyTo: rawEmail,
      subject: `New Application: ${safeName} [${safeRole}]`,
      text: `New Job Application: ${rawName}\n\nName: ${rawName}\nEmail: ${rawEmail}\nPhone: ${rawPhone}\nRole: ${rawRole}\nPortfolio: ${rawPortfolio}\nMessage:\n${rawMessage}\n\nSent from TPF Website Recruitment Portal`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #111; margin-top: 0;">New Job Application: ${safeName}</h2>
          <hr style="border: none; border-top: 1px solid #eaeaea;" />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Role:</strong> ${safeRole}</p>
          <p><strong>Portfolio:</strong> <a href="${safePortfolio}" target="_blank" rel="noopener noreferrer">${safePortfolio}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 12px; border-radius: 4px; white-space: pre-wrap; word-break: break-word;">${safeMessage}</div>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin-top: 20px;" />
          <p style="font-size: 12px; color: #888;">Sent from TPF Website Recruitment Portal</p>
        </div>
      `,
    });

    if (data.error) {
      return { success: false, error: data.error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, error: "An unexpected error occurred while transmitting application." };
  }
}
