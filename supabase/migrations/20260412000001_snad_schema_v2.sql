-- Create dedicated schema for SNAD
create schema if not exists snad;

-- Extensions (already in public, shared across schemas)
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

-- Daily deliberation questions
create table snad.deliberations (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  description text,
  status text not null default 'active',
  min_opinions_for_consensus int not null default 5,
  created_at timestamptz not null default now()
);

-- Interview sessions (anonymous via session cookie)
create table snad.interviews (
  id uuid primary key default uuid_generate_v4(),
  deliberation_id uuid not null references snad.deliberations(id),
  session_id text not null,
  messages jsonb not null default '[]',
  language text default 'en',
  canton text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Extracted opinions with embeddings
create table snad.opinions (
  id uuid primary key default uuid_generate_v4(),
  deliberation_id uuid not null references snad.deliberations(id),
  interview_id uuid not null references snad.interviews(id),
  session_id text not null,
  opinion_text text not null,
  embedding vector(1536),
  cluster_id int,
  cluster_label text,
  projected_x float,
  projected_y float,
  submitted_at timestamptz not null default now()
);

-- Consensus candidate statements
create table snad.statements (
  id uuid primary key default uuid_generate_v4(),
  deliberation_id uuid not null references snad.deliberations(id),
  statement_text text not null,
  embedding vector(1536),
  projected_x float,
  projected_y float,
  social_ranking int,
  is_winner boolean default false,
  is_seed boolean default false,
  generated_at timestamptz not null default now()
);

-- Rankings (real or LLM-predicted)
create table snad.rankings (
  id uuid primary key default uuid_generate_v4(),
  deliberation_id uuid not null references snad.deliberations(id),
  session_id text not null,
  interview_id uuid references snad.interviews(id),
  statement_rankings jsonb not null,
  is_predicted boolean default false,
  submitted_at timestamptz not null default now()
);

-- RLS
alter table snad.deliberations enable row level security;
alter table snad.statements enable row level security;
alter table snad.opinions enable row level security;
alter table snad.interviews enable row level security;
alter table snad.rankings enable row level security;

create policy "Public read deliberations" on snad.deliberations for select using (true);
create policy "Public read statements" on snad.statements for select using (true);
create policy "Public read opinions" on snad.opinions for select using (true);

-- Grant usage on the schema to anon and authenticated roles
grant usage on schema snad to anon, authenticated;
grant select on all tables in schema snad to anon, authenticated;

-- Enable realtime
alter publication supabase_realtime add table snad.opinions;
alter publication supabase_realtime add table snad.statements;

-- Seed an initial deliberation
insert into snad.deliberations (question, description, status, min_opinions_for_consensus)
values (
  'How should Switzerland govern its national AI infrastructure?',
  'Share your views on who should oversee a Swiss public AI, what safeguards matter most, and how citizens should participate in AI governance decisions.',
  'active',
  5
);
