import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

const middleware = async (req: NextRequest) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;


  if (token) {
    const publicPaths = ["/", "/reset", "/register"];
    if (publicPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } else {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname === "/register/profile") {
      return NextResponse.redirect(new URL("/register", req.url));
    }
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/reset/:path*",
    "/register/:path*",
  ],
};
