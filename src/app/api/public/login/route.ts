import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const isJson = request.headers.get("content-type")?.includes("application/json") ?? false;
  const credentials = isJson
    ? await request.json()
    : Object.fromEntries(await request.formData());
  const email = String(credentials.email ?? "");
  const password = String(credentials.password ?? "");
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return handleLoginError(request, isJson, "Falta configurar Supabase en Vercel.", 500);
  }

  let response = isJson
    ? NextResponse.json({ ok: true })
    : NextResponse.redirect(new URL("/", request.url), { status: 303 });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        response.cookies.set({ name, value: "", ...options });
      }
    }
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return handleLoginError(request, isJson, error.message, 401);
  }

  return response;
}

function handleLoginError(request: NextRequest, isJson: boolean, message: string, status: number) {
  if (isJson) {
    return NextResponse.json({ error: message }, { status });
  }

  const url = new URL("/login", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}
