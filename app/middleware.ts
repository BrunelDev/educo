import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // If accessing workspace pages and no token exists, redirect to login
  if (request.nextUrl.pathname.startsWith("/workspace")) {
    console.log("je suis deja remplacable")
    // Remove parentheses
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // Verify token with your Django backend
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "auth/utilisateurs/me/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Token is invalid, clear cookie and redirect to login
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      // Error checking auth, clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    "/workspace/:path*",
    "/workspace", // Add this to match the /workspace route itself
  ],
};
