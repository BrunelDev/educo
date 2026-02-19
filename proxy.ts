import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Simple cache with 5-minute expiration
const USER_CACHE = new Map<string, { user: unknown; timestamp: number }>();
const CACHE_EXPIRATION = 5 * 60 * 1000;

// Get API URL from environment or use fallback
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://51.15.246.64:8000/api/";
const WS_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://51.15.246.64:8000/ws/chat/";

// Extract domain for CSP
const getHostFromUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    // Fallback if URL parsing fails
    return url.split("/").slice(0, 3).join("/");
  }
};

const API_HOST = getHostFromUrl(API_URL);
const WS_HOST = getHostFromUrl(WS_URL);

// Security headers object for reuse
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": `
    default-src 'self';
    connect-src 'self' ${API_HOST} ${WS_HOST} *.supabase.co;
    img-src 'self' data: https: *.supabase.co;
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
  `
    .replace(/\s+/g, " ")
    .trim(),
};

export async function proxy(request: NextRequest) {
  // Get access token from request cookies (server-side)
  const accessToken = request.cookies.get("access_token")?.value;
  const response = NextResponse.next();

  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Redirect to login if no token
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Use cached user data if available and not expired
    const cacheKey = accessToken;
    const cachedData = USER_CACHE.get(cacheKey);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
      return response;
    }

    // Create a direct API call instead of using the getUser function
    // This avoids the client-side cookie issues
    await axios.get(`${API_URL}auth/utilisateurs/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If we get here without error, the token is valid
    USER_CACHE.set(cacheKey, { user: {}, timestamp: now });

    return response;
  } catch (error) {
console.error(error)
    ;

    // Create redirect response
    const loginRedirect = NextResponse.redirect(new URL("/login", request.url));

    // Clear all auth cookies
    ["access_token", "refresh_token", "userInfo"].forEach((cookie) => {
      loginRedirect.cookies.delete(cookie);
    });

    return loginRedirect;
  }
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    "/(workspace)/:path*",
    "/assistance/:path*",
    "/consultations/:path*",
    "/dashboard/:path*",
    "/equipe/:path*",
    "/fichiers/:path*",
    "/formations/:path*",
    "/gestion/:path*",
    "/messages/:path*",
    "/profile/:path*",
    "/reunions/:path*",
  ],
};
