create extension if not exists "uuid-ossp";

create table public.organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.clients (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  type text not null check (type in ('lead', 'client', 'supplier_contact')),
  status text not null default 'active',
  estimated_value numeric(12,2) default 0,
  last_contact_at date,
  next_action text,
  sentiment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  description text,
  phase text not null default 'concept',
  health integer not null default 70 check (health >= 0 and health <= 100),
  deadline date,
  budget numeric(12,2) default 0,
  spent numeric(12,2) default 0,
  fee numeric(12,2) default 0,
  fee_paid_percent integer default 0 check (fee_paid_percent >= 0 and fee_paid_percent <= 100),
  fee_type text default 'honorarios',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  area text,
  due_date date,
  importance integer not null default 5 check (importance >= 1 and importance <= 10),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meetings (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  meeting_at timestamptz not null,
  prep jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.decisions (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  owner text,
  due_date date,
  status text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  impact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.money_movements (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  type text not null check (type in ('budget', 'invoice', 'expense', 'payment', 'income')),
  title text not null,
  category text,
  amount numeric(12,2) not null default 0,
  status text not null default 'pending',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  category text,
  reliability integer default 70 check (reliability >= 0 and reliability <= 100),
  notes text,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  type text not null default 'other',
  status text not null default 'pending',
  storage_path text,
  file_name text,
  file_size bigint,
  mime_type text,
  created_at timestamptz not null default now()
);

create table public.templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  type text not null default 'other',
  notes text,
  storage_path text,
  file_name text,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  period text not null check (period in ('month', 'quarter', 'year')),
  title text not null,
  current_value numeric(12,2) not null default 0,
  target_value numeric(12,2) not null default 1,
  kind text,
  actions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table public.notes (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.history_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.weekly_reviews (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  week_start date not null,
  closed text,
  pending text,
  lesson text,
  created_at timestamptz not null default now()
);

create table public.automations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  rule_type text not null,
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.is_org_member(org_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.meetings enable row level security;
alter table public.decisions enable row level security;
alter table public.money_movements enable row level security;
alter table public.suppliers enable row level security;
alter table public.documents enable row level security;
alter table public.templates enable row level security;
alter table public.goals enable row level security;
alter table public.notes enable row level security;
alter table public.history_events enable row level security;
alter table public.weekly_reviews enable row level security;
alter table public.automations enable row level security;

create policy "members can read organizations" on public.organizations
for select using (public.is_org_member(id));

create policy "members can read memberships" on public.organization_members
for select using (public.is_org_member(organization_id));

create policy "members can manage clients" on public.clients
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage projects" on public.projects
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage tasks" on public.tasks
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage meetings" on public.meetings
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage decisions" on public.decisions
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage money" on public.money_movements
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage suppliers" on public.suppliers
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage documents" on public.documents
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage templates" on public.templates
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage goals" on public.goals
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage notes" on public.notes
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage history" on public.history_events
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage weekly reviews" on public.weekly_reviews
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

create policy "members can manage automations" on public.automations
for all using (public.is_org_member(organization_id))
with check (public.is_org_member(organization_id));

