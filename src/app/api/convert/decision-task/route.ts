import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const form = Object.fromEntries(await request.formData());
  const title = String(form.title ?? "Resolver decision pendiente");
  const projectId = optional(String(form.project_id ?? ""));
  const decisionId = String(form.decision_id ?? "");
  const redirect = String(form.redirect ?? "/");

  const supabase = createSupabaseAdminClient();
  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (!organization) {
    return NextResponse.redirect(new URL(redirect, request.url), { status: 303 });
  }

  await supabase.from("tasks").insert({
    organization_id: organization.id,
    project_id: projectId,
    title: `Cerrar decision: ${title}`,
    area: "operaciones",
    importance: 9,
    done: false
  });

  if (decisionId) {
    await supabase.from("decisions").update({ status: "converted" }).eq("id", decisionId);
  }

  return NextResponse.redirect(new URL(`${redirect}?created=1`, request.url), { status: 303 });
}

function optional(value: string) {
  return value ? value : null;
}
