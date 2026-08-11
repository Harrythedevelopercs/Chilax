const SECRET =
  process.env.SESSION_SECRET || "parcela-dev-secret-change-in-production-32ch";

export interface SessionUser {
  email: string;
  name: string;
  company?: string;
  createdAt: string;
}

/** Generate a random alphanumeric password */
export function generatePassword(length = 12): string {
  const chars =
    "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

function base64UrlEncode(str: string): string {
  try {
    if (typeof btoa === "function") {
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    }
  } catch {
    // fallback
  }
  return Buffer.from(str).toString("base64url");
}

function base64UrlDecode(str: string): string {
  try {
    if (typeof atob === "function") {
      let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      while (base64.length % 4) base64 += "=";
      return decodeURIComponent(escape(atob(base64)));
    }
  } catch {
    // fallback
  }
  return Buffer.from(str, "base64url").toString("utf-8");
}

function simpleHash(str: string): string {
  let hash = 5381;
  const key = SECRET + ":" + str;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) + hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

/** Sign a session payload → opaque token */
export function signSession(data: object): string {
  const payload = base64UrlEncode(JSON.stringify(data));
  const sig = simpleHash(payload);
  return `${payload}.${sig}`;
}

/** Verify and decode a session token, returns null if tampered */
export function verifySession<T>(token: string): T | null {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return null;
    const payload = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const expected = simpleHash(payload);
    if (sig !== expected) return null;
    return JSON.parse(base64UrlDecode(payload)) as T;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "parcela_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
