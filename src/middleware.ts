import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  let token;
  try {
    token = await getToken({
      req: request,
      secret:
        process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "mmlaptop-dev-secret",
    });
  } catch (error) {
    // If token decryption fails, treat as no token
    token = null;
  }

  const pathname = request.nextUrl.pathname;
  const isAdminPageRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";

  if (!isAdminPageRoute && !isAdminApiRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (isAdminApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isLoginRoute) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (token && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
