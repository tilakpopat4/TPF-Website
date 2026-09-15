import { cookies } from 'next/headers';
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  validateAdminCredentials,
  getAdminCredentials,
  type SessionPayload,
} from './auth-token';

// Re-export token utilities
export {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
  validateAdminCredentials,
  getAdminCredentials,
  type SessionPayload,
};

// Set session cookie in Server Actions or Route Handlers
export async function setAdminSessionCookie(username: string): Promise<void> {
  const token = createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

// Destroy session cookie (logout)
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// Read and verify active admin session in Server Components / Actions
export async function getAdminSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

// Enforce admin authentication guard in Server Actions
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized: Valid admin authentication session required.');
  }
  return session;
}
