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
  const entity = String(form.entity ?? "");
  const id = String(form.id ?? "");
  const redirect = String(form.redirect ?? "/");
  const supabase = createSupabaseAdminClient();

  if (!id) {
    return redirectWithMessage(request, redirect, "Falta el identificador.");
  }

  if (entity === "project") {
    await supabase
      .from("projects")
      .update({
        phase: String(form.phase ?? "concept"),
        health: number(form.health, 70),
        budget: number(form.budget),
        fee: number(form.fee),
        fee_paid_percent: number(form.fee_paid_percent)
      })
      .eq("id", id);
  }

  if (entity === "goal") {
    await supabase
      .from("goals")
      .update({
        period: String(form.period ?? "month"),
        title: String(form.title ?? ""),
        current_value: number(form.current_value),
        target_value: number(form.target_value, 1),
        actions: splitLines(String(form.actions ?? ""))
      })
      .eq("id", id);
  }

  if (entity === "task") {
    await supabase.from("tasks").update({ done: String(form.done ?? "") === "true" }).eq("id", id);
  }

  return NextResponse.redirect(new URL(`${redirect}?updated=1`, request.url), { status: 303 });
}

function number(value: FormDataEntryValue | undefined, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function redirectWithMessage(request: NextRequest, redirect: string, message: string) {
  const url = new URL(redirect, request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}
