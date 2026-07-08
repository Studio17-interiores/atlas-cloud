import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type StudioProject = {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  health: number;
  budget: number;
  fee: number;
  fee_paid_percent: number;
  fee_type: string | null;
  client_id: string | null;
};

export type StudioTask = {
  id: string;
  title: string;
  importance: number;
  done: boolean;
  project_id: string | null;
};

export type StudioDecision = {
  id: string;
  title: string;
  status: string;
  project_id: string | null;
  impact: string | null;
};

export type StudioMoneyMovement = {
  id: string;
  title: string;
  amount: number;
  status: string;
  type: string;
  project_id: string | null;
};

export async function getStudio17Data() {
  const supabase = createSupabaseAdminClient();

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("slug", "studio-17")
    .maybeSingle();

  if (!organization) {
    return {
      organization: null,
      projects: [] as StudioProject[],
      tasks: [] as StudioTask[],
      decisions: [] as StudioDecision[],
      moneyMovements: [] as StudioMoneyMovement[]
    };
  }

  const organizationId = organization.id as string;

  const [projects, tasks, decisions, moneyMovements] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, description, phase, health, budget, fee, fee_paid_percent, fee_type, client_id")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("tasks")
      .select("id, title, importance, done, project_id")
      .eq("organization_id", organizationId)
      .order("importance", { ascending: false }),
    supabase
      .from("decisions")
      .select("id, title, status, project_id, impact")
      .eq("organization_id", organizationId)
      .eq("status", "open")
      .order("created_at", { ascending: true }),
    supabase
      .from("money_movements")
      .select("id, title, amount, status, type, project_id")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true })
  ]);

  return {
    organization,
    projects: (projects.data ?? []) as StudioProject[],
    tasks: (tasks.data ?? []) as StudioTask[],
    decisions: (decisions.data ?? []) as StudioDecision[],
    moneyMovements: (moneyMovements.data ?? []) as StudioMoneyMovement[]
  };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}
