-- NainoForge — pgvector helper functions
-- Run after enabling vector extension.

create or replace function public.upsert_embedding(
  p_user_id uuid,
  p_id uuid,
  p_embedding vector(1536),
  p_metadata jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.nf_embeddings (user_id, embedding, metadata, model)
  values (p_user_id, p_embedding, p_metadata, 'openai/ada-002')
  on conflict (id) do update
    set embedding = excluded.embedding,
        metadata = excluded.metadata,
        created_at = now();
end;
$$;

create or replace function public.search_embeddings(
  p_user_id uuid,
  p_query vector(1536),
  p_limit int default 5
)
returns table (
  id uuid,
  embedding vector(1536),
  metadata jsonb,
  score float8
)
language sql
security definer
as $$
  select
    id,
    embedding,
    metadata,
    1 - (embedding <=> p_query) as score
  from public.nf_embeddings
  where user_id = p_user_id
  order by embedding <=> p_query
  limit p_limit;
$$;
