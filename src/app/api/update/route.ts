import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
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
    const update: Record<string, unknown> = {
      phase: String(form.phase ?? "concept"),
      health: number(form.health, 70),
      budget: number(form.budget),
      fee: number(form.fee),
      fee_paid_percent: number(form.fee_paid_percent)
    };

    if ("name" in form) {
      update.name = String(form.name ?? "");
    }

    if ("description" in form) {
      update.description = String(form.description ?? "");
    }

    await supabase.from("projects").update(update).eq("id", id);
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
    const action = String(form.action ?? "");
    const update: Record<string, unknown> = action === "postpone" || !("title" in form)
      ? action === "postpone"
        ? { due_date: tomorrowIsoDate() }
        : { done: String(form.done ?? "") === "true" }
      : {
          title: String(form.title ?? ""),
          importance: number(form.importance, 7),
          area: String(form.area ?? ""),
          due_date: optional(String(form.due_date ?? "")),
          done: String(form.done ?? "") === "true"
        };

    await supabase.from("tasks").update(update).eq("id", id);
  }

  if (entity === "money") {
    await supabase
      .from("money_movements")
      .update({
        title: String(form.title ?? ""),
        amount: number(form.amount),
        status: String(form.status ?? "pending"),
        type: String(form.type ?? "expense"),
        category: String(form.category ?? "")
      })
      .eq("id", id);
  }

  if (entity === "client") {
    const action = String(form.action ?? "");
    const update = action === "followed_up"
      ? { next_action: "", status: String(form.status ?? "active") }
      : {
          name: String(form.name ?? ""),
          estimated_value: number(form.estimated_value),
          next_action: String(form.next_action ?? ""),
          sentiment: String(form.sentiment ?? ""),
          status: String(form.status ?? "active")
        };

    await supabase
      .from("clients")
      .update(update)
      .eq("id", id);
  }

  if (entity === "decision") {
    const update: Record<string, unknown> = "title" in form
      ? {
          title: String(form.title ?? ""),
          owner: String(form.owner ?? ""),
          status: String(form.status ?? "open"),
          impact: String(form.impact ?? "")
        }
      : { status: String(form.status ?? "closed") };

    await supabase.from("decisions").update(update).eq("id", id);
  }

  if (entity === "document") {
    await supabase
      .from("documents")
      .update({
        title: String(form.title ?? ""),
        type: String(form.type ?? "other"),
        status: String(form.status ?? "pending")
      })
      .eq("id", id);
  }

  if (entity === "template") {
    await supabase
      .from("templates")
      .update({
        title: String(form.title ?? ""),
        type: String(form.type ?? "template"),
        notes: String(form.notes ?? "")
      })
      .eq("id", id);
  }

  if (entity === "supplier") {
    await supabase
      .from("suppliers")
      .update({
        name: String(form.name ?? ""),
        category: String(form.category ?? ""),
        reliability: number(form.reliability, 70),
        notes: String(form.notes ?? "")
      })
      .eq("id", id);
  }

  if (entity === "meeting") {
    await supabase
      .from("meetings")
      .update({
        title: String(form.title ?? ""),
        meeting_at: dateTime(String(form.meeting_at ?? ""))
      })
      .eq("id", id);
  }

  if (entity === "note") {
    await supabase
      .from("notes")
      .update({
        body: String(form.body ?? "")
      })
      .eq("id", id);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (organization) {
    await logEvent(supabase, organization.id as string, "update", `Actualizado: ${entity}`, optional(String(form.project_id ?? "")));
  }

  revalidatePath("/", "layout");
  return redirectWithFlag(request, redirect, "updated", "1");
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

function optional(value: string) {
  return value ? value : null;
}

function dateTime(value: string) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

function tomorrowIsoDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

async function logEvent(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  organizationId: string,
  type: string,
  body: string,
  projectId: string | null
) {
  await supabase
    .from("history_events")
    .insert({
      organization_id: organizationId,
      type,
      body,
      project_id: projectId
    })
    .then(() => null);
}

function redirectWithMessage(request: NextRequest, redirect: string, message: string) {
  const url = new URL(redirect, request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

function redirectWithFlag(request: NextRequest, redirect: string, key: string, value: string) {
  const url = new URL(redirect, request.url);
  url.searchParams.set(key, value);
  return NextResponse.redirect(url, { status: 303 });
}
