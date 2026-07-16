-- NainoForge — auth/profile bootstrap
-- Peuple public.nf_users depuis auth.users lors de signup / login.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not exists (select 1 from public.nf_users where id = new.id) then
    insert into public.nf_users (id, email, display_name, onboarding_completed, default_privacy_mode, settings_json)
    values (
      new.id,
      coalesce(new.email, ''),
      coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email,''), '@', 1)),
      false,
      'personal',
      '{}'::jsonb
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_inserted on auth.users;
create trigger on_auth_user_inserted
  after insert on auth.users
  for each row execute function public.handle_new_user();
