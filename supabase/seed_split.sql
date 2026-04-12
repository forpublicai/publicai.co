-- ============================================================
-- Run this in the Supabase SQL Editor to:
--   1. Apply the new migration (new tables)
--   2. Seed data for question_suggestions and survey_responses
-- ============================================================

-- ── 1. Migration: Add interview_type + new tables ──

alter table snad.interviews add column if not exists interview_type text not null default 'deliberation';

create table if not exists snad.survey_responses (
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

create table if not exists snad.question_suggestions (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null,
  question_text text not null,
  source text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists snad.question_votes (
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

-- Policies (use if not exists pattern via do block)
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public read survey_responses' and tablename = 'survey_responses') then
    create policy "Public read survey_responses" on snad.survey_responses for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public read question_suggestions' and tablename = 'question_suggestions') then
    create policy "Public read question_suggestions" on snad.question_suggestions for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public read question_votes' and tablename = 'question_votes') then
    create policy "Public read question_votes" on snad.question_votes for select using (true);
  end if;
end $$;

grant select on snad.survey_responses to anon, authenticated;
grant select on snad.question_suggestions to anon, authenticated;
grant select on snad.question_votes to anon, authenticated;

-- Allow service role to insert (needed for API routes)
grant insert, update, delete on snad.question_suggestions to service_role;
grant insert, update, delete on snad.question_votes to service_role;
grant insert, update, delete on snad.survey_responses to service_role;

-- Also ensure service_role can insert into existing tables
grant insert, update, delete on snad.interviews to service_role;
grant insert, update, delete on snad.opinions to service_role;
grant insert, update, delete on snad.statements to service_role;
grant insert, update, delete on snad.rankings to service_role;
grant insert, update, delete on snad.deliberations to service_role;

-- ── 2. Seed: Question suggestions ──

insert into snad.question_suggestions (session_id, question_text, source) values
  ('seed-001', 'Should Swiss AI systems be required to explain their decisions in plain language?', 'llm'),
  ('seed-002', 'How should Switzerland balance AI innovation with protecting workers whose jobs may be automated?', 'llm'),
  ('seed-003', 'Should there be a public registry of all AI systems used by Swiss government agencies?', 'user'),
  ('seed-004', 'What role should direct democracy play in governing AI — should citizens vote on major AI policy decisions?', 'user'),
  ('seed-005', 'How can Switzerland ensure its AI systems respect all four national languages equally?', 'llm');

-- Seed some votes on suggestions
insert into snad.question_votes (suggestion_id, session_id, vote)
select qs.id, 'voter-' || g.n, 1
from snad.question_suggestions qs
cross join generate_series(1, 3) as g(n)
where qs.question_text like 'Should Swiss AI systems be required%';

insert into snad.question_votes (suggestion_id, session_id, vote)
select qs.id, 'voter-' || g.n, 1
from snad.question_suggestions qs
cross join generate_series(4, 8) as g(n)
where qs.question_text like 'What role should direct democracy%';

insert into snad.question_votes (suggestion_id, session_id, vote)
select qs.id, 'voter-' || g.n, 1
from snad.question_suggestions qs
cross join generate_series(1, 2) as g(n)
where qs.question_text like 'How can Switzerland ensure%';

-- ── 3. Seed: Survey responses (no real interview_id needed — create placeholder interviews) ──

-- Insert placeholder survey interviews
insert into snad.interviews (id, deliberation_id, session_id, interview_type, messages, language, canton, completed_at)
select
  uuid_generate_v4(),
  d.id,
  'survey-seed-' || g.n,
  'survey',
  '[]'::jsonb,
  case when g.n % 3 = 0 then 'fr' when g.n % 3 = 1 then 'de' else 'en' end,
  (array['ZH','BE','VD','GE','TI','LU','SG','AG','BS','FR'])[((g.n - 1) % 10) + 1],
  now()
from snad.deliberations d
cross join generate_series(1, 12) as g(n)
where d.status = 'active'
limit 12;

-- Insert survey responses for those interviews
insert into snad.survey_responses (interview_id, session_id, themes, overall_sentiment, canton)
select
  i.id,
  i.session_id,
  case (row_number() over (order by i.created_at)) % 4
    when 0 then '[
      {"theme": "AI in public services", "position": "Supportive with conditions — wants transparency", "sentiment": "positive"},
      {"theme": "Privacy and data protection", "position": "Strong priority — Swiss values demand it", "sentiment": "positive"},
      {"theme": "AI governance", "position": "Needs democratic oversight", "sentiment": "mixed"}
    ]'::jsonb
    when 1 then '[
      {"theme": "AI in education", "position": "Cautiously supportive — teachers must stay central", "sentiment": "mixed"},
      {"theme": "Economic impact", "position": "Concerned about job displacement in banking", "sentiment": "negative"},
      {"theme": "Multilingual AI", "position": "Critical that all four languages are supported equally", "sentiment": "positive"},
      {"theme": "AI transparency", "position": "Wants full explainability for government decisions", "sentiment": "positive"}
    ]'::jsonb
    when 2 then '[
      {"theme": "Healthcare AI", "position": "Open to AI triage but wants doctor oversight", "sentiment": "mixed"},
      {"theme": "Data sovereignty", "position": "Swiss data must stay in Switzerland", "sentiment": "positive"},
      {"theme": "AI in public services", "position": "Worried about bias in automated decisions", "sentiment": "negative"}
    ]'::jsonb
    else '[
      {"theme": "AI governance", "position": "Federal council should regulate, not cantons", "sentiment": "mixed"},
      {"theme": "Innovation vs regulation", "position": "Too much regulation will push talent away", "sentiment": "negative"},
      {"theme": "AI transparency", "position": "Companies should publish AI impact assessments", "sentiment": "positive"},
      {"theme": "Privacy and data protection", "position": "Existing Swiss data protection laws are sufficient", "sentiment": "mixed"},
      {"theme": "Direct democracy and AI", "position": "Citizens should vote on major AI policy", "sentiment": "positive"}
    ]'::jsonb
  end,
  jsonb_build_object(
    'hope', 0.3 + (random() * 0.5),
    'concern', 0.2 + (random() * 0.5)
  ),
  i.canton
from snad.interviews i
where i.interview_type = 'survey';
