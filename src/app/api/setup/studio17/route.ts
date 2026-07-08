import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

type RecordData = Record<string, any>;

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: organization, error: organizationError } = await supabase
    .from("organizations")
    .upsert({ name: "Studio 17", slug: "studio-17" }, { onConflict: "slug" })
    .select("id")
    .single();

  if (organizationError || !organization) {
    return redirectWithError(request, organizationError?.message ?? "No se ha podido crear Studio 17.");
  }

  const organizationId = organization.id as string;

  const { error: membershipError } = await supabase.from("organization_members").upsert({
    organization_id: organizationId,
    user_id: session.userId,
    role: "owner"
  });

  if (membershipError) {
    return redirectWithError(request, membershipError.message);
  }

  const omar = await ensureRecord(supabase, "clients", organizationId, "name", "Omar Villamil", {
    organization_id: organizationId,
    name: "Omar Villamil",
    type: "client",
    status: "active",
    estimated_value: 35000,
    next_action: "Preparar ultima entrega de Axis y esperar proyecto del arquitecto.",
    sentiment: "Proyecto activo con decision pendiente sobre direccion de obra."
  });

  const garridos = await ensureRecord(supabase, "clients", organizationId, "name", "Garridos SL", {
    organization_id: organizationId,
    name: "Garridos SL",
    type: "client",
    status: "active",
    estimated_value: 70000,
    next_action: "Controlar avance de obra iniciada y ordenar decisiones pendientes.",
    sentiment: "Colaboracion sin honorarios, requiere control para no absorber demasiado tiempo."
  });

  const axis = await ensureRecord(supabase, "projects", organizationId, "name", "Axis", {
    organization_id: organizationId,
    client_id: omar.id,
    name: "Axis",
    description: "Local en bruto a centro de fisioterapia y pilates.",
    phase: "design",
    health: 72,
    budget: 35000,
    spent: 0,
    fee: 3815,
    fee_paid_percent: 70,
    fee_type: "honorarios"
  });

  const garridosProject = await ensureRecord(supabase, "projects", organizationId, "name", "Garridos SL - Dos viviendas", {
    organization_id: organizationId,
    client_id: garridos.id,
    name: "Garridos SL - Dos viviendas",
    description: "Vivienda en ruinas de dos plantas convertida en dos viviendas nuevas. Obra iniciada hace dos semanas.",
    phase: "worksite",
    health: 64,
    budget: 70000,
    spent: 0,
    fee: 0,
    fee_paid_percent: 0,
    fee_type: "colaboracion"
  });

  await ensureRecord(supabase, "tasks", organizationId, "title", "Ultra importante: cerrar ultima entrega de Axis", {
    organization_id: organizationId,
    project_id: axis.id,
    client_id: omar.id,
    title: "Ultra importante: cerrar ultima entrega de Axis",
    area: "proyectos",
    importance: 10,
    done: false
  });

  await ensureRecord(supabase, "tasks", organizationId, "title", "Pedir estado del proyecto del arquitecto para Axis", {
    organization_id: organizationId,
    project_id: axis.id,
    client_id: omar.id,
    title: "Pedir estado del proyecto del arquitecto para Axis",
    area: "seguimiento",
    importance: 9,
    done: false
  });

  await ensureRecord(supabase, "decisions", organizationId, "title", "Omar decide si contrata direccion de obra", {
    organization_id: organizationId,
    project_id: axis.id,
    title: "Omar decide si contrata direccion de obra",
    owner: "Omar Villamil",
    status: "open",
    impact: "Puede convertir Axis en obra dirigida por Studio 17."
  });

  await ensureRecord(supabase, "money_movements", organizationId, "title", "Honorarios Axis - 70% pagado", {
    organization_id: organizationId,
    project_id: axis.id,
    client_id: omar.id,
    type: "income",
    title: "Honorarios Axis - 70% pagado",
    category: "honorarios",
    amount: 2670.5,
    status: "paid"
  });

  await ensureRecord(supabase, "money_movements", organizationId, "title", "Honorarios Axis - 30% pendiente", {
    organization_id: organizationId,
    project_id: axis.id,
    client_id: omar.id,
    type: "income",
    title: "Honorarios Axis - 30% pendiente",
    category: "honorarios",
    amount: 1144.5,
    status: "pending"
  });

  await ensureRecord(supabase, "goals", organizationId, "title", "Este mes: conseguir 1 obra", {
    organization_id: organizationId,
    period: "month",
    title: "Este mes: conseguir 1 obra",
    current_value: 0,
    target_value: 1,
    kind: "ventas",
    actions: ["Cerrar decision de direccion de obra de Axis", "Revisar leads calientes", "Publicar contenido de obra/antes-despues"]
  });

  await ensureRecord(supabase, "goals", organizationId, "title", "Trimestre: 5 proyectos completos, 2 decoraciones y 1 medidor", {
    organization_id: organizationId,
    period: "quarter",
    title: "Trimestre: 5 proyectos completos, 2 decoraciones y 1 medidor",
    current_value: 0,
    target_value: 8,
    kind: "produccion",
    actions: ["Definir pipeline trimestral", "Separar proyectos completos de decoraciones", "Crear seguimiento semanal de conversion"]
  });

  await ensureRecord(supabase, "notes", organizationId, "body", "Studio 17 inicializado en ATLAS Cloud.", {
    organization_id: organizationId,
    project_id: garridosProject.id,
    client_id: garridos.id,
    body: "Studio 17 inicializado en ATLAS Cloud."
  });

  await ensureRecord(supabase, "documents", organizationId, "title", "Contrato Axis", {
    organization_id: organizationId,
    project_id: axis.id,
    title: "Contrato Axis",
    type: "contract",
    status: "pending",
    file_name: "pendiente-subir-contrato-axis.pdf"
  });

  await ensureRecord(supabase, "documents", organizationId, "title", "Fotos iniciales Axis", {
    organization_id: organizationId,
    project_id: axis.id,
    title: "Fotos iniciales Axis",
    type: "photo",
    status: "pending",
    file_name: "pendiente-subir-fotos-axis.zip"
  });

  await ensureRecord(supabase, "documents", organizationId, "title", "Documentacion obra Garridos", {
    organization_id: organizationId,
    project_id: garridosProject.id,
    title: "Documentacion obra Garridos",
    type: "plan",
    status: "pending",
    file_name: "pendiente-subir-documentacion-garridos.pdf"
  });

  await ensureRecord(supabase, "templates", organizationId, "title", "Plantilla contrato de interiorismo", {
    organization_id: organizationId,
    title: "Plantilla contrato de interiorismo",
    type: "contract",
    notes: "Base para contratos de proyectos completos. Pendiente subir archivo definitivo.",
    file_name: "pendiente-subir-contrato-interiorismo.docx"
  });

  await ensureRecord(supabase, "templates", organizationId, "title", "Plantilla presupuesto Studio 17", {
    organization_id: organizationId,
    title: "Plantilla presupuesto Studio 17",
    type: "budget",
    notes: "Formato de propuesta y honorarios. Pendiente subir archivo definitivo.",
    file_name: "pendiente-subir-presupuesto.xlsx"
  });

  await ensureRecord(supabase, "templates", organizationId, "title", "Checklist visita de obra", {
    organization_id: organizationId,
    title: "Checklist visita de obra",
    type: "other",
    notes: "Lista rapida para visitas, fotos, mediciones y decisiones.",
    file_name: "pendiente-subir-checklist-obra.pdf"
  });

  await ensureRecord(supabase, "suppliers", organizationId, "name", "Proveedor ceramica por definir", {
    organization_id: organizationId,
    name: "Proveedor ceramica por definir",
    category: "Materiales",
    reliability: 70,
    notes: "Completar con contacto real, tarifas y condiciones."
  });

  await ensureRecord(supabase, "suppliers", organizationId, "name", "Carpinteria por definir", {
    organization_id: organizationId,
    name: "Carpinteria por definir",
    category: "Ejecucion",
    reliability: 70,
    notes: "Completar cuando haya proveedor habitual validado."
  });

  await ensureRecord(supabase, "meetings", organizationId, "title", "Revision interna Axis", {
    organization_id: organizationId,
    project_id: axis.id,
    client_id: omar.id,
    title: "Revision interna Axis",
    meeting_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    prep: ["Revisar entrega final", "Listar pendientes del arquitecto", "Preparar propuesta de direccion de obra"]
  });

  await ensureRecord(supabase, "automations", organizationId, "name", "Aviso reunion manana", {
    organization_id: organizationId,
    name: "Aviso reunion manana",
    rule_type: "meeting_tomorrow",
    config: { message: "Preparar reunion de manana y revisar pendientes del proyecto." },
    enabled: true
  });

  await ensureRecord(supabase, "automations", organizationId, "name", "Seguimiento cliente sin contacto", {
    organization_id: organizationId,
    name: "Seguimiento cliente sin contacto",
    rule_type: "client_no_contact_7_days",
    config: { days: 7 },
    enabled: true
  });

  return NextResponse.redirect(new URL("/system?setup=done", request.url), { status: 303 });
}

async function ensureRecord(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  table: string,
  organizationId: string,
  matchField: string,
  matchValue: string,
  payload: RecordData
) {
  const { data: existing, error: existingError } = await supabase
    .from(table)
    .select("*")
    .eq("organization_id", organizationId)
    .eq(matchField, matchValue)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    return existing as RecordData;
  }

  const { data, error } = await supabase.from(table).insert(payload).select("*").single();

  if (error || !data) {
    throw error ?? new Error(`No se ha podido crear ${table}.`);
  }

  return data as RecordData;
}

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/system", request.url);
  url.searchParams.set("setup", "error");
  url.searchParams.set("message", message);
  return NextResponse.redirect(url, { status: 303 });
}
