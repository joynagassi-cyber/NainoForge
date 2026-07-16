-- NainoForge — vector/pgvector extension + embeddings table
-- Run after initial schema.

create extension if not exists vector;

create table public.nf_embeddings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.nf_users(id) on delete cascade,
  source_id uuid references public.nf_sources(id) on delete cascade,
  chunk_id uuid references public.nf_source_chunks(id) on delete cascade,
  concept_id uuid references public.nf_concepts(id) on delete set null,
  embedding vector(1536) not null,
  model text not null default 'openai/ada-002',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists nf_embeddings_user_source_idx on public.nf_embeddings (user_id, source_id);
create index if not exists nf_embeddings_user_concept_idx on public.nf_embeddings (user_id, concept_id);

-- cosine similarity search: note HNSW/ivfflat params may need tuning by volume
create index if not exists nf_embeddings_vector_idx on public.nf_embeddings
  using hnsw (embedding vector_cosine_ops)
  with (m = 16, ef_construction = 64);

alter table public.nf_embeddings enable row level security;

create policy user_isolation_policy on public.nf_embeddings
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
