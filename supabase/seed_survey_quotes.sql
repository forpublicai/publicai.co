-- Seed survey_responses with sample quotes for QuoteWall display
-- Run manually: psql $DATABASE_URL -f supabase/seed_survey_quotes.sql
-- Or via Supabase dashboard SQL editor

-- First, get a reference interview_id and session_id (create a dummy if needed)
DO $$
DECLARE
  v_interview_id uuid;
  v_session_id text := 'seed-session-001';
  v_deliberation_id uuid;
BEGIN
  -- Get the first deliberation
  SELECT id INTO v_deliberation_id FROM snad.deliberations LIMIT 1;

  -- Create a seed interview
  INSERT INTO snad.interviews (deliberation_id, session_id, interview_type, messages, language, completed_at)
  VALUES (v_deliberation_id, v_session_id, 'survey', '[]'::jsonb, 'en', now())
  RETURNING id INTO v_interview_id;

  -- Insert sample survey responses
  INSERT INTO snad.survey_responses (interview_id, session_id, opinion_text, canton, occupation, themes, cluster_label) VALUES
  (v_interview_id, v_session_id,
   'Switzerland should lead Europe in building transparent, privacy-first AI systems. We have the democratic tradition and technical talent to do it right.',
   'ZH', 'Technology / IT',
   '[{"theme":"AI governance","position":"Strong democratic oversight needed","sentiment":"positive"}]'::jsonb,
   'Democratic AI governance'),

  (v_interview_id, v_session_id,
   'I worry that AI in hospitals could make mistakes that doctors would catch. It should assist, never decide alone.',
   'BE', 'Healthcare',
   '[{"theme":"AI in healthcare","position":"Supportive role only","sentiment":"mixed"}]'::jsonb,
   'AI safety in healthcare'),

  (v_interview_id, v_session_id,
   'As a teacher, I see huge potential for AI to personalise learning, but we must protect children''s data absolutely.',
   'VD', 'Education',
   '[{"theme":"AI in education","position":"Promising but data protection critical","sentiment":"positive"}]'::jsonb,
   'Education and data privacy'),

  (v_interview_id, v_session_id,
   'The banking sector already uses AI heavily. A public Swiss AI could level the playing field for smaller firms and citizens.',
   'GE', 'Finance / Banking',
   '[{"theme":"Economic fairness","position":"Public AI as equaliser","sentiment":"positive"}]'::jsonb,
   'Economic democratisation'),

  (v_interview_id, v_session_id,
   'I want AI that speaks all four national languages equally well. That''s what makes it truly Swiss.',
   'TI', NULL,
   '[{"theme":"Multilingual AI","position":"Must serve all language regions","sentiment":"positive"}]'::jsonb,
   'Multilingual inclusivity'),

  (v_interview_id, v_session_id,
   'My main concern is that AI decisions in government are not transparent. Citizens should be able to understand and challenge them.',
   'LU', 'Legal',
   '[{"theme":"Transparency","position":"Full explainability required","sentiment":"mixed"}]'::jsonb,
   'Transparency and accountability'),

  (v_interview_id, v_session_id,
   'AI could help with our ageing population — companion robots, health monitoring. But it must never replace human care.',
   'AG', 'Retired',
   '[{"theme":"AI for elderly care","position":"Supplement not replace human contact","sentiment":"mixed"}]'::jsonb,
   'AI safety in healthcare'),

  (v_interview_id, v_session_id,
   'We should build AI infrastructure like we built the rail network — as a public good, accessible to everyone.',
   'BS', 'Government / Public Sector',
   '[{"theme":"Public infrastructure","position":"AI as public utility","sentiment":"positive"}]'::jsonb,
   'Democratic AI governance'),

  (v_interview_id, v_session_id,
   'I''m a student and I use AI every day for studying. Switzerland should embrace it, not fear it. But keep it open source.',
   'SG', 'Student',
   '[{"theme":"Open source AI","position":"Strongly in favour","sentiment":"positive"}]'::jsonb,
   'Open source and transparency'),

  (v_interview_id, v_session_id,
   'Privacy is non-negotiable. Swiss data should stay in Switzerland, processed by Swiss infrastructure.',
   'ZG', 'Science / Research',
   '[{"theme":"Data sovereignty","position":"Strict data localisation","sentiment":"mixed"}]'::jsonb,
   'Data sovereignty'),

  (v_interview_id, v_session_id,
   'I think AI can make government services faster and fairer, but only if there''s strong independent oversight.',
   'FR', 'Government / Public Sector',
   '[{"theme":"AI in government","position":"Supportive with oversight","sentiment":"positive"}]'::jsonb,
   'Democratic AI governance'),

  (v_interview_id, v_session_id,
   'The media industry is being disrupted by AI. We need rules to protect journalism and prevent misinformation.',
   'ZH', 'Media / Communications',
   '[{"theme":"AI and media","position":"Regulation needed","sentiment":"negative"}]'::jsonb,
   'AI regulation');

END $$;
