-- Atomically replace related products for a concept.
create or replace function public.set_concept_products(
  p_concept_id uuid,
  p_product_ids uuid[]
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  delete from public.product_concepts
  where concept_id = p_concept_id;

  insert into public.product_concepts (concept_id, product_id)
  select p_concept_id, product_id
  from unnest(coalesce(p_product_ids, '{}'::uuid[])) as product_id;
end;
$$;

revoke all on function public.set_concept_products(uuid, uuid[]) from public;
grant execute on function public.set_concept_products(uuid, uuid[]) to authenticated;
