import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isPublic =
    req.nextUrl.pathname.startsWith("/sign-in") ||
    req.nextUrl.pathname.startsWith("/api/auth");

  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (req.auth && req.nextUrl.pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
