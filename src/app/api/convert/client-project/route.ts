import { revalidatePath } from "next/cache";
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
  const clientId = String(form.client_id ?? "");
  const clientName = String(form.client_name ?? "Nuevo proyecto");
  const estimatedValue = Number(form.estimated_value ?? 0);
  const redirect = String(form.redirect ?? "/clients");
  const supabase = createSupabaseAdminClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (!organization || !clientId) {
    return redirectWithMessage(request, redirect, "Falta cliente u organizacion.");
  }

  const { error: projectError } = await supabase.from("projects").insert({
    organization_id: organization.id,
    client_id: clientId,
    name: `Proyecto ${clientName}`,
    description: `Proyecto creado desde el cliente ${clientName}.`,
    phase: "concept",
    health: 70,
    budget: estimatedValue,
    fee: 0,
    fee_paid_percent: 0
  });

  if (projectError) {
    return redirectWithMessage(request, redirect, projectError.message);
  }

  await supabase.from("clients").update({ status: "won", next_action: "" }).eq("id", clientId);
  await supabase.from("history_events").insert({
    organization_id: organization.id,
    type: "convert",
    body: `Cliente convertido en proyecto: ${clientName}`
  }).then(() => null);

  revalidatePath("/", "layout");
  const url = new URL(redirect, request.url);
  url.searchParams.set("created", "1");
  return NextResponse.redirect(url, { status: 303 });
}

function redirectWithMessage(request: NextRequest, redirect: string, message: string) {
  const url = new URL(redirect, request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}
