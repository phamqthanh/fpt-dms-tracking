import ms from "ms";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? "" : " ago"}`;
};

// utils/jwt.ts

// Base64URL -> Base64
function base64UrlToBase64(base64Url: string) {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  // pad with '='
  const pad = base64.length % 4;
  if (pad === 2) base64 += "==";
  else if (pad === 3) base64 += "=";
  else if (pad !== 0) throw new Error("Invalid base64 string");
  return base64;
}

// decode base64 to UTF-8 string (works in React Native)
function base64Decode(base64: string) {
  // atob may not exist in RN; use global Buffer if available, else fallback
  if (typeof atob === "function") {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  }

  // React Native usually has global Buffer
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf8");
  }

  // last-resort: try using TextDecoder from global
  if (typeof TextDecoder !== "undefined" && typeof Uint8Array !== "undefined") {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    const dec = new TextDecoder("utf-8");
    return dec.decode(bytes);
  }

  throw new Error("No base64 decode available");
}

export function parseJwt(token: string) {
  if (!token || typeof token !== "string") throw new Error("Token must be a string");
  const parts = token.split(".");
  if (parts.length < 2) throw new Error("Invalid JWT token");

  const [rawHeader, rawPayload] = parts;

  try {
    const headerJson = base64Decode(base64UrlToBase64(rawHeader));
    const payloadJson = base64Decode(base64UrlToBase64(rawPayload));
    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);

    return { header, payload };
  } catch (err) {
    throw new Error("Failed to parse JWT: " + (err as Error).message);
  }
}

export function getClaim(token: string, claimName: string) {
  const { payload } = parseJwt(token);
  return payload ? payload[claimName] : undefined;
}

export function isExpired(token: string, offsetSeconds = 0) {
  const exp = getClaim(token, "exp");
  if (typeof exp === "undefined") return false; // no exp claim -> consider non-expiring (or change logic)
  const now = Math.floor(Date.now() / 1000);
  return now + offsetSeconds >= Number(exp);
}
