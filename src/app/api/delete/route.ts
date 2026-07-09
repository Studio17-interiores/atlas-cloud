import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "atlas-documents";

const TABLES: Record<string, string> = {
  client: "clients",
  task: "tasks",
  money: "money_movements",
  meeting: "meetings",
  document: "documents",
  template: "templates",
  supplier: "suppliers",
  decision: "decisions",
  note: "notes",
  automation: "automations"
};

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const form = Object.fromEntries(await request.formData());
  const entity = String(form.entity ?? "");
  const id = String(form.id ?? "");
  const redirect = String(form.redirect ?? "/");
  const table = TABLES[entity];

  if (!table || !id) {
    return NextResponse.redirect(new URL(redirect, request.url), { status: 303 });
  }

  const supabase = createSupabaseAdminClient();
  const storagePath = String(form.storage_path ?? "");

  if ((entity === "document" || entity === "template") && storagePath) {
    await supabase.storage.from(BUCKET).remove([storagePath]);
  }

  await supabase.from(table).delete().eq("id", id);

  return NextResponse.redirect(new URL(`${redirect}?deleted=1`, request.url), { status: 303 });
}
