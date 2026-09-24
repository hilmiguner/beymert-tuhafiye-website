-- Keep concept cover media consistent and unique.
create unique index if not exists concept_media_one_cover_idx
  on public.concept_media (concept_id)
  where is_cover = true;

create or replace function public.set_concept_cover(
  p_concept_id uuid,
  p_media_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.concept_media
    where concept_id = p_concept_id
      and media_id = p_media_id
  ) then
    raise exception 'Media is not attached to this concept';
  end if;

  update public.concept_media
  set is_cover = false
  where concept_id = p_concept_id
    and is_cover = true;

  update public.concept_media
  set is_cover = true
  where concept_id = p_concept_id
    and media_id = p_media_id;

  update public.concepts
  set cover_media_id = p_media_id
  where id = p_concept_id;
end;
$$;

revoke all on function public.set_concept_cover(uuid, uuid) from public;
grant execute on function public.set_concept_cover(uuid, uuid) to authenticated;
