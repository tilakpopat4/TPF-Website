import crypto from 'crypto';

export const COOKIE_NAME = 'tpf_admin_session';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Resolve admin credentials from environment or fallback
export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || 'tpfadmin';
  const password = process.env.ADMIN_PASSWORD || 'tilak2952';
  return { username, password };
}

// Derive or get session signing secret
export function getSigningSecret(): string {
  if (process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  const { password } = getAdminCredentials();
  return crypto.createHash('sha256').update(password + '::tpf_session_salt::2025').digest('hex');
}

// Constant-time string comparison to prevent timing attacks
export function timingSafeCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

// Validate credentials using constant-time comparison
export function validateAdminCredentials(user: string, pass: string): boolean {
  const { username, password } = getAdminCredentials();
  const userMatch = timingSafeCompare(user.trim(), username.trim());
  const passMatch = timingSafeCompare(pass, password);
  return userMatch && passMatch;
}

export interface SessionPayload {
  u: string;
  exp: number;
  iat: number;
  nonce: string;
}

// Generate signed session token
export function createSessionToken(username: string): string {
  const now = Date.now();
  const payload: SessionPayload = {
    u: username,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS * 1000,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const secret = getSigningSecret();
  const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');

  return `${payloadStr}.${signature}`;
}

// Verify signed session token (pure crypto, safe for proxy/middleware and server actions)
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  const secret = getSigningSecret();
  const expectedSignature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');

  if (!timingSafeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload: SessionPayload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}
