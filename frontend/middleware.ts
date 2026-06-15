import { NextRequest, NextResponse } from "next/server";

const LOCALE_COOKIE = "NEXT_LOCALE";
const LOCALE_HEADER = "x-next-intl-locale";
const SUPPORTED = ["ro", "it"];
const DEFAULT = "ro";

function getPreferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && SUPPORTED.includes(cookie)) return cookie;

  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    for (const lang of acceptLang.split(",")) {
      const code = lang.split(";")[0]?.trim().slice(0, 2);
      if (code && SUPPORTED.includes(code)) return code;
    }
  }

  return DEFAULT;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return;
  }

  const locale = getPreferredLocale(request);

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
  response.headers.set(LOCALE_HEADER, locale);

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next|_next/static|_next/image|favicon.ico|uploads|.*\\..*).*)",
  ],
};
