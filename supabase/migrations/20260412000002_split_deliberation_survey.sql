-- Add interview_type to interviews table
alter table snad.interviews add column interview_type text not null default 'deliberation';

-- Survey responses (extracted from survey-type interviews)
create table snad.survey_responses (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid not null references snad.interviews(id),
  session_id text not null,
  themes jsonb not null,
  overall_sentiment jsonb,
  canton text,
  embedding vector(1536),
  projected_x float,
  projected_y float,
  cluster_id int,
  cluster_label text,
  created_at timestamptz default now()
);

-- Question suggestions for meta-deliberation
create table snad.question_suggestions (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  question_text text not null,
  source text not null default 'user',  -- 'user' | 'llm'
  created_at timestamptz not null default now()
);

-- Votes on question suggestions (one per session per suggestion)
create table snad.question_votes (
  id uuid primary key default uuid_generate_v4(),
  suggestion_id uuid not null references snad.question_suggestions(id),
  session_id text not null,
  vote int not null default 1,
  created_at timestamptz default now(),
  unique(suggestion_id, session_id)
);

-- RLS
alter table snad.survey_responses enable row level security;
alter table snad.question_suggestions enable row level security;
alter table snad.question_votes enable row level security;

create policy "Public read survey_responses" on snad.survey_responses for select using (true);
create policy "Public read question_suggestions" on snad.question_suggestions for select using (true);
create policy "Public read question_votes" on snad.question_votes for select using (true);

-- Grant access
grant select on snad.survey_responses to anon, authenticated;
grant select on snad.question_suggestions to anon, authenticated;
grant select on snad.question_votes to anon, authenticated;
