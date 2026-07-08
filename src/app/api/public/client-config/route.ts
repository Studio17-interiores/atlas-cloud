import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export function GET() {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return NextResponse.json({ error: "Falta configurar Supabase." }, { status: 500 });
  }

  return NextResponse.json({ url, anonKey });
}
