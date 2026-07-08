import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const credentials = Object.fromEntries(await request.formData());
  const email = String(credentials.email ?? "");
  const password = String(credentials.password ?? "");
  const { url, anonKey } = getSupabaseConfig();
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? anonKey;

  if (!url || !anonKey) {
    return handleLoginError(request, "Falta configurar Supabase en Vercel.");
  }

  const authResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    body: JSON.stringify({ email, password })
  });

  const authResult = await authResponse.json();

  if (!authResponse.ok) {
    return handleLoginError(request, authResult.error_description ?? authResult.msg ?? authResult.error ?? "Login incorrecto.");
  }

  const user = authResult.user;

  if (!user?.id || !user?.email) {
    return handleLoginError(request, "Supabase ha aceptado el login, pero no ha devuelto usuario.");
  }

  const token = await createSessionToken(
    {
      email: user.email,
      userId: user.id,
      expiresAt: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
    },
    sessionSecret
  );

  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  });

  return response;
}

function handleLoginError(request: NextRequest, message: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}
