import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUser } from "./lib/api/users";
import { AxiosError } from "axios";

export async function middleware(request: NextRequest) {
  // Example: Check if the user is authenticated
  const token = request.cookies.get("access_token");

  if (!token) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }
  try {
    //const user = await getUser();
    //request.cookies.set("userInfo", JSON.stringify(user));
    console.log("pass")
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("Error fetching user:", (error as AxiosError));
    throw error

    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
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
