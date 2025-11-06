import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { AstroCookies } from "astro";

const JWT_SECRET = import.meta.env.ADMIN_JWT_SECRET || "default-secret-key";
const ADMIN_USERNAME = import.meta.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = import.meta.env.ADMIN_PASSWORD_HASH || "";

export interface AuthToken {
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify username and password
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  // If no password hash is set, use default for development
  if (!ADMIN_PASSWORD_HASH) {
    console.warn("No ADMIN_PASSWORD_HASH set, using default password");
    return password === "admin123";
  }

  return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(username: string): string {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });
}

/**
 * Verify JWT token and return decoded data
 */
export function verifyToken(token: string): AuthToken | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthToken;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated from cookies
 */
export function isAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get("admin_token")?.value;
  if (!token) {
    return false;
  }

  const decoded = verifyToken(token);
  return decoded !== null;
}

/**
 * Get authenticated user from cookies
 */
export function getAuthenticatedUser(cookies: AstroCookies): string | null {
  const token = cookies.get("admin_token")?.value;
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded?.username || null;
}
