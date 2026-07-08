import { NextResponse, type NextRequest } from "next/server";
import { normalizeSupabaseUrl } from "@/lib/supabase/config";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey ?? "";
  const isConfigRoute = request.nextUrl.pathname.startsWith("/config-missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    if (isConfigRoute) {
      return NextResponse.next({ request });
    }

    const url = request.nextUrl.clone();
    url.pathname = "/config-missing";
    return NextResponse.redirect(url);
  }

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isPublicApiRoute = request.nextUrl.pathname.startsWith("/api/public");
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session && !isAuthRoute && !isPublicApiRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/public).*)"]
};
