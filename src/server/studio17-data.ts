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

export type StudioGoal = {
  id: string;
  period: string;
  title: string;
  current_value: number;
  target_value: number;
  kind: string | null;
  actions: string[];
};

export type StudioClient = {
  id: string;
  name: string;
  type: string;
  status: string;
  estimated_value: number;
  next_action: string | null;
  sentiment: string | null;
};

export type StudioDocument = {
  id: string;
  title: string;
  type: string;
  status: string;
  project_id: string | null;
  file_name: string | null;
};

export type StudioTemplate = {
  id: string;
  title: string;
  type: string;
  notes: string | null;
  file_name: string | null;
};

export type StudioSupplier = {
  id: string;
  name: string;
  category: string | null;
  reliability: number | null;
  notes: string | null;
};

export type StudioMeeting = {
  id: string;
  title: string;
  meeting_at: string;
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
      moneyMovements: [] as StudioMoneyMovement[],
      goals: [] as StudioGoal[],
      clients: [] as StudioClient[],
      documents: [] as StudioDocument[],
      templates: [] as StudioTemplate[],
      suppliers: [] as StudioSupplier[],
      meetings: [] as StudioMeeting[]
    };
  }

  const organizationId = organization.id as string;

  const [projects, tasks, decisions, moneyMovements, goals, clients, documents, templates, suppliers, meetings] = await Promise.all([
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
      .order("created_at", { ascending: true }),
    supabase
      .from("goals")
      .select("id, period, title, current_value, target_value, kind, actions")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("clients")
      .select("id, name, type, status, estimated_value, next_action, sentiment")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("documents")
      .select("id, title, type, status, project_id, file_name")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("templates")
      .select("id, title, type, notes, file_name")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("suppliers")
      .select("id, name, category, reliability, notes")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true }),
    supabase
      .from("meetings")
      .select("id, title, meeting_at, project_id")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: true })
  ]);

  return {
    organization,
    projects: (projects.data ?? []) as StudioProject[],
    tasks: (tasks.data ?? []) as StudioTask[],
    decisions: (decisions.data ?? []) as StudioDecision[],
    moneyMovements: (moneyMovements.data ?? []) as StudioMoneyMovement[],
    goals: (goals.data ?? []) as StudioGoal[],
    clients: (clients.data ?? []) as StudioClient[],
    documents: (documents.data ?? []) as StudioDocument[],
    templates: (templates.data ?? []) as StudioTemplate[],
    suppliers: (suppliers.data ?? []) as StudioSupplier[],
    meetings: (meetings.data ?? []) as StudioMeeting[]
  };
}

export function formatEuro(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  }).format(value);
}
