import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const REAL_GOALS = [
  ["month", "Facturacion mensual controlada", 0, 1, "facturacion", ["Revisar cobros pendientes cada lunes", "Cerrar presupuestos abiertos antes de abrir frentes nuevos"]],
  ["month", "Captacion mensual: 1 obra nueva", 0, 1, "obras", ["Mover seguimiento de leads", "Publicar contenido de obra real"]],
  ["quarter", "Trimestre: 5 proyectos completos", 0, 5, "proyectos", ["Revisar pipeline cada semana", "Detectar proyectos parados"]],
  ["quarter", "Trimestre: 2 decoraciones", 0, 2, "decoraciones", ["Crear propuesta clara de decoracion", "Recuperar leads templados"]],
  ["quarter", "Trimestre: 1 medidor", 0, 1, "medidores", ["Publicar antes/despues", "Pedir recomendaciones a clientes"]],
  ["year", "Contenido y marketing consistente", 0, 48, "marketing", ["Grabar obra cada semana", "Convertir fotos de proceso en publicaciones"]],
  ["year", "Leads cualificados", 0, 24, "leads", ["Registrar origen de cada lead", "Revisar conversion mensual"]],
  ["year", "Conversion comercial sana", 0, 30, "conversiones", ["Medir presupuestos enviados", "Reforzar seguimiento a 48 horas"]]
] as const;

export async function POST(request: NextRequest) {
  const sessionSecret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, sessionSecret);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url), { status: 303 });
  }

  const supabase = createSupabaseAdminClient();
  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (!organization) {
    return NextResponse.redirect(new URL("/system?goals=error", request.url), { status: 303 });
  }

  await supabase.from("goals").delete().eq("organization_id", organization.id);
  await supabase.from("goals").insert(
    REAL_GOALS.map(([period, title, currentValue, targetValue, kind, actions]) => ({
      organization_id: organization.id,
      period,
      title,
      current_value: currentValue,
      target_value: targetValue,
      kind,
      actions
    }))
  );

  return NextResponse.redirect(new URL("/growth?real_goals=1", request.url), { status: 303 });
}
