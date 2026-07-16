-- NainoForge — initial schema
-- Run via: supabase db reset   (or apply through the Supabase dashboard / MCP when available)

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- Users (product profile)
create table public.nf_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  onboarding_completed boolean default false,
  default_privacy_mode text default 'personal',
  settings_json jsonb default '{}'::jsonb
);

-- Sources
create table public.nf_sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  source_type text not null,
  privacy_level text not null default 'personal',
  url text,
  title text not null,
  language text,
  raw_text text,
  checksum text,
  word_count integer,
  status text default 'captured',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_syncable boolean default true
);

create index if not exists nf_sources_user_created_idx on public.nf_sources (user_id, created_at desc);
create index if not exists nf_sources_user_checksum_idx on public.nf_sources (user_id, checksum);
create index if not exists nf_sources_user_privacy_idx on public.nf_sources (user_id, privacy_level);

-- Source chunks
create table public.nf_source_chunks (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.nf_sources(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  embedding_ref text,
  created_at timestamptz default now()
);

create index if not exists nf_source_chunks_source_idx on public.nf_source_chunks (source_id, chunk_index);

-- Concepts
create table public.nf_concepts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  canonical_name text not null,
  slug text not null,
  description text,
  first_source_id uuid references public.nf_sources(id),
  mastery_status text default 'unvisited',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists nf_concepts_user_slug_idx on public.nf_concepts (user_id, slug);
create index if not exists nf_concepts_user_mastery_idx on public.nf_concepts (user_id, mastery_status);

-- Source -> concept links
create table public.nf_source_concepts (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.nf_sources(id) on delete cascade,
  concept_id uuid not null references public.nf_concepts(id) on delete cascade,
  confidence_score real default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists nf_source_concepts_source_idx on public.nf_source_concepts (source_id);
create index if not exists nf_source_concepts_concept_idx on public.nf_source_concepts (concept_id);
create unique index if not exists nf_source_concepts_unique_idx on public.nf_source_concepts (source_id, concept_id);

-- IMPRINT notes
create table public.nf_imprint_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  source_id uuid not null references public.nf_sources(id) on delete cascade,
  concept_id uuid references public.nf_concepts(id) on delete set null,
  note_markdown text not null,
  status text default 'draft',
  imprint_cran integer,
  iquality_score real,
  bloom_level text,
  concept_coverage_pct real,
  reformulation_score real,
  length_adequacy_score real,
  has_example boolean default false,
  has_analogy boolean default false,
  contradiction_flagged boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  submitted_at timestamptz
);

create index if not exists nf_imprint_notes_user_created_idx on public.nf_imprint_notes (user_id, created_at desc);
create index if not exists nf_imprint_notes_concept_idx on public.nf_imprint_notes (concept_id, submitted_at desc);
create index if not exists nf_imprint_notes_source_idx on public.nf_imprint_notes (source_id, status);

-- Flashcards
create table public.nf_flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  concept_id uuid not null references public.nf_concepts(id) on delete cascade,
  source_id uuid references public.nf_sources(id) on delete set null,
  imprint_note_id uuid references public.nf_imprint_notes(id) on delete set null,
  card_type text not null,
  front_content text not null,
  back_content text not null,
  distractors_json jsonb,
  status text default 'active',
  is_leech boolean default false,
  lapse_count integer default 0,
  initial_cran integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists nf_flashcards_user_concept_idx on public.nf_flashcards (user_id, concept_id);
create index if not exists nf_flashcards_user_status_idx on public.nf_flashcards (user_id, status);

-- FSRS state per card
create table public.nf_card_fsrs_state (
  card_id uuid primary key references public.nf_flashcards(id) on delete cascade,
  stability real not null default 0.5,
  difficulty real not null default 0.3,
  retrievability real,
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  reps integer default 0,
  lapses integer default 0,
  state_json jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Immutable review events
create table public.nf_apex_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  card_id uuid not null references public.nf_flashcards(id) on delete cascade,
  rating text not null,
  elapsed_seconds integer,
  fsrs_state_before jsonb not null,
  fsrs_state_after jsonb not null,
  reviewed_at timestamptz default now(),
  device_id text,
  session_id uuid
);

create index if not exists nf_apex_reviews_user_card_idx on public.nf_apex_reviews (user_id, card_id, reviewed_at desc);
create index if not exists nf_apex_reviews_session_idx on public.nf_apex_reviews (session_id);

-- Review sessions
create table public.nf_review_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  session_type text not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  cards_seen integer default 0,
  cards_completed integer default 0,
  mode_source text default 'manual'
);

-- Student AI sessions
create table public.nf_student_ai_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  source_id uuid references public.nf_sources(id) on delete set null,
  concept_id uuid references public.nf_concepts(id) on delete set null,
  card_id uuid references public.nf_flashcards(id) on delete set null,
  confidence_declared integer,
  explanation_text text,
  concept_coverage_pct real,
  coherence_score real,
  depth_score real,
  misconception_detected boolean default false,
  final_state text,
  score_evaluated integer,
  dunning_kruger_alert boolean default false,
  provider_mode text default 'cloud',
  session_at timestamptz default now()
);

create index if not exists nf_student_ai_sessions_user_concept_idx on public.nf_student_ai_sessions (user_id, concept_id, session_at desc);

-- Concept relations for COSMOS
create table public.nf_concept_relations (
  id uuid primary key default gen_random_uuid(),
  source_concept_id uuid not null references public.nf_concepts(id) on delete cascade,
  target_concept_id uuid not null references public.nf_concepts(id) on delete cascade,
  relation_type text not null,
  weight real default 1,
  auto_generated boolean default false,
  evidence_source_id uuid references public.nf_sources(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists nf_concept_relations_source_idx on public.nf_concept_relations (source_concept_id);
create index if not exists nf_concept_relations_target_idx on public.nf_concept_relations (target_concept_id);
create unique index if not exists nf_concept_relations_unique_idx on public.nf_concept_relations (source_concept_id, target_concept_id, relation_type);

-- COSMOS metrics projection
create table public.nf_cosmos_metrics (
  concept_id uuid primary key references public.nf_concepts(id) on delete cascade,
  retention_score real,
  depth_score real,
  teaching_score real,
  metacognition_score real,
  coherence_score real,
  smi_global real,
  density_score real,
  gap_status text default 'unvisited',
  updated_at timestamptz default now()
);

-- Sync queue
create table public.nf_sync_queue (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id uuid not null,
  operation text not null,
  payload_json jsonb not null,
  sync_status text default 'pending',
  retry_count integer default 0,
  last_error text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists nf_sync_queue_status_idx on public.nf_sync_queue (sync_status, created_at);

-- Bundle exports history
create table public.nf_bundle_exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  bundle_version text not null,
  schema_version text not null,
  checksum text,
  encrypted boolean default false,
  storage_mode text default 'local',
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.nf_users enable row level security;
alter table public.nf_sources enable row level security;
alter table public.nf_source_chunks enable row level security;
alter table public.nf_concepts enable row level security;
alter table public.nf_source_concepts enable row level security;
alter table public.nf_imprint_notes enable row level security;
alter table public.nf_flashcards enable row level security;
alter table public.nf_card_fsrs_state enable row level security;
alter table public.nf_apex_reviews enable row level security;
alter table public.nf_review_sessions enable row level security;
alter table public.nf_student_ai_sessions enable row level security;
alter table public.nf_concept_relations enable row level security;
alter table public.nf_cosmos_metrics enable row level security;
alter table public.nf_sync_queue enable row level security;
alter table public.nf_bundle_exports enable row level security;

-- Basic RLS policies: user-scoped access
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'nf_sources','nf_source_chunks','nf_concepts','nf_source_concepts',
      'nf_imprint_notes','nf_flashcards','nf_card_fsrs_state','nf_apex_reviews',
      'nf_review_sessions','nf_student_ai_sessions','nf_concept_relations',
      'nf_cosmos_metrics','nf_sync_queue','nf_bundle_exports'
    ])
  loop
    execute format($sql$
      create policy user_isolation_policy on public.%I
        for all
        using (user_id = auth.uid())
        with check (user_id = auth.uid())
    $sql$, tbl);
  end loop;
end $$;

-- Default migrations table
create table if not exists public.schema_migrations (
  version text primary key,
  applied_at timestamptz default now()
);
