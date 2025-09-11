import { getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const verifyJwt = (
  token: string,
  keyNameIdentifier: "accessTokenPublicKey" | "refreshTokenPublicKey"
): { valid: boolean; expired: unknown; decoded: JwtPayload | undefined } => {
  try {
    let secretKey: string | null = null;

    switch (keyNameIdentifier) {
      case "accessTokenPublicKey":
        secretKey = process.env.NEXT_PUBLIC_ACCESS_PUBLIC_KEY;
        break;
      case "refreshTokenPublicKey":
        secretKey = process.env.NEXT_PUBLIC_REFRESH_PUBLIC_KEY;
        break;
      default:
        throw new Error("unknown keyNameIdentifier supported");
    }
    const publicKey = Buffer.from(secretKey, "base64").toString("ascii");

    const decoded = jwt.verify(token, publicKey) as JwtPayload;

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: (error.message = "jwt expired"),
      decoded: undefined,
    };
  }
};

const middleware = async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const accessToken = req.cookies.get("accessToken")?.value;

  const { pathname } = req.nextUrl;

  if (!refreshToken) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname === "/register/profile") {
      return NextResponse.redirect(new URL("/register", req.url));
    }
  } else {
    const { decoded, valid } = verifyJwt(refreshToken, "refreshTokenPublicKey");

    if (!valid || !decoded) {
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (pathname === "/register/profile") {
        return NextResponse.redirect(new URL("/register", req.url));
      }
    } else {
      
      const { decoded, valid } = verifyJwt(
        accessToken as string,
        "refreshTokenPublicKey"
      );

      console.log(valid)

      const publicPaths = ["/", "/reset", "/register"];
      if (publicPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ["/dashboard/:path*", "/", "/reset/:path*", "/register/:path*"],
  runtime: "nodejs",
};
