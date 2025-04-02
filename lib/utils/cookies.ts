export const getCookies = (name: string) => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }

  return null;
};

interface CookieOptions {
  expires?: number; // seconds from now
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  if (typeof document === "undefined") return;

  const {
    expires = 7 * 24 * 60 * 60, // 7 days default
    path = "/",
    secure = true,
    sameSite = "Strict",
  } = options;

  const expirationDate = new Date(Date.now() + expires * 1000).toUTCString();

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  cookieString += `;expires=${expirationDate}`;
  cookieString += `;path=${path}`;

  if (secure) cookieString += ";secure";
  cookieString += `;samesite=${sameSite}`;

  document.cookie = cookieString;
};

export const removeCookie = (name: string, path: string = "/"): void => {
  if (typeof document === "undefined") return;

  // Set expiration to past date to remove cookie
  document.cookie = `${encodeURIComponent(
    name
  )}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
};
