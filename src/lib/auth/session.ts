type SessionPayload = {
  email: string;
  userId: string;
  expiresAt: number;
};

const SESSION_COOKIE = "atlas_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS };
export type { SessionPayload };

export async function createSessionToken(payload: SessionPayload, secret: string) {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = await sign(body, secret);
  return `${body}.${signature}`;
}

export async function verifySessionToken(token: string | undefined, secret: string) {
  if (!token || !secret) {
    return null;
  }

  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = await sign(body, secret);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as SessionPayload;

    if (!payload.email || !payload.userId || Date.now() > payload.expiresAt) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function base64UrlEncode(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlDecode(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  const bytes = new Uint8Array(signature);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
