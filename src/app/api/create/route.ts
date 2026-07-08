import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type Payload = Record<string, FormDataEntryValue>;

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const form = Object.fromEntries(await request.formData()) as Payload;
  const entity = text(form.entity);
  const supabase = createSupabaseAdminClient();
  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (organizationError || !organization) {
    return redirectToNew(request, "No encuentro Studio 17. Ve a Sistema y crea la base primero.");
  }

  const organizationId = organization.id as string;

  try {
    if (entity === "client") {
      await supabase.from("clients").insert({
        organization_id: organizationId,
        name: text(form.name),
        type: text(form.type, "client"),
        status: "active",
        estimated_value: number(form.estimated_value),
        next_action: text(form.next_action),
        sentiment: text(form.sentiment)
      });
    }

    if (entity === "project") {
      await supabase.from("projects").insert({
        organization_id: organizationId,
        client_id: optional(text(form.client_id)),
        name: text(form.name),
        description: text(form.description),
        phase: text(form.phase, "concept"),
        health: number(form.health, 70),
        budget: number(form.budget),
        fee: number(form.fee),
        fee_paid_percent: number(form.fee_paid_percent)
      });
    }

    if (entity === "task") {
      await supabase.from("tasks").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        title: text(form.title),
        area: text(form.area),
        importance: number(form.importance, 7),
        done: false
      });
    }

    if (entity === "decision") {
      await supabase.from("decisions").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        title: text(form.title),
        owner: text(form.owner),
        due_date: optional(text(form.due_date)),
        status: "open",
        impact: text(form.impact)
      });
    }

    if (entity === "money") {
      await supabase.from("money_movements").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        type: text(form.type, "expense"),
        title: text(form.title),
        category: text(form.category),
        amount: number(form.amount),
        status: text(form.status, "pending")
      });
    }

    if (entity === "goal") {
      await supabase.from("goals").insert({
        organization_id: organizationId,
        period: text(form.period, "month"),
        title: text(form.title),
        current_value: number(form.current_value),
        target_value: number(form.target_value, 1),
        kind: text(form.kind),
        actions: splitLines(text(form.actions))
      });
    }

    if (entity === "note") {
      await supabase.from("notes").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        body: text(form.body)
      });
    }

    if (entity === "document") {
      await supabase.from("documents").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        title: text(form.title),
        type: text(form.type, "other"),
        status: text(form.status, "pending"),
        file_name: text(form.file_name)
      });
    }

    if (entity === "template") {
      await supabase.from("templates").insert({
        organization_id: organizationId,
        title: text(form.title),
        type: text(form.type, "other"),
        notes: text(form.notes),
        file_name: text(form.file_name)
      });
    }

    if (entity === "meeting") {
      await supabase.from("meetings").insert({
        organization_id: organizationId,
        project_id: optional(text(form.project_id)),
        title: text(form.title),
        meeting_at: dateTime(text(form.meeting_at)),
        prep: splitLines(text(form.prep))
      });
    }

    if (entity === "supplier") {
      await supabase.from("suppliers").insert({
        organization_id: organizationId,
        name: text(form.name),
        category: text(form.category),
        reliability: number(form.reliability, 70),
        notes: text(form.notes)
      });
    }

    if (entity === "automation") {
      await supabase.from("automations").insert({
        organization_id: organizationId,
        name: text(form.name),
        rule_type: text(form.rule_type, "manual_reminder"),
        config: {
          message: text(form.message),
          days: number(form.days, 1)
        },
        enabled: true
      });
    }
  } catch (error) {
    return redirectToNew(request, error instanceof Error ? error.message : "No se ha podido guardar.");
  }

  const redirect = text(form.redirect, "/new");
  return NextResponse.redirect(new URL(`${redirect}?created=1`, request.url), { status: 303 });
}

function text(value: FormDataEntryValue | undefined, fallback = "") {
  return String(value ?? fallback).trim();
}

function optional(value: string) {
  return value ? value : null;
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

function dateTime(value: string) {
  return value ? new Date(value).toISOString() : new Date().toISOString();
}

function redirectToNew(request: NextRequest, message: string) {
  const url = new URL("/new", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}
