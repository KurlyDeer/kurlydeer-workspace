\set ON_ERROR_STOP on
-- Signed-in users cannot grant themselves admin permissions through user_metadata.
set role authenticated;
set request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","app_metadata":{},"user_metadata":{"role":"admin"}}';
do $$ begin
  begin
    insert into public.hub_content(id,kind,payload) values ('denied','project','{"id":"denied","title":"Denied"}');
    raise exception 'Non-admin write unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects(bucket_id,name) values ('hub-assets','11111111-1111-4111-8111-111111111111/x.png');
    raise exception 'Non-admin upload unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
end $$;
set request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","app_metadata":{"role":"admin"}}';
insert into public.hub_content(id,kind,published,payload) values ('policy-draft','project',false,'{"id":"policy-draft","title":"Private draft"}');
insert into storage.objects(bucket_id,name) values ('hub-assets','11111111-1111-4111-8111-111111111111/x.png');
do $$ begin
  if not exists(select 1 from public.hub_content where id='policy-draft') then raise exception 'Admin cannot read draft'; end if;
  begin
    insert into storage.objects(bucket_id,name) values ('hub-assets','22222222-2222-4222-8222-222222222222/x.png');
    raise exception 'Wrong upload folder unexpectedly accepted';
  exception when insufficient_privilege then null; end;
end $$;
set role anon;
set request.jwt.claims = '{}';
do $$ begin
  if exists(select 1 from public.hub_content where id='policy-draft') then raise exception 'Draft exposed to anonymous users'; end if;
  if not exists(select 1 from public.hub_content where published) then raise exception 'Published seed content missing'; end if;
end $$;
set role authenticated;
set request.jwt.claims = '{"sub":"11111111-1111-4111-8111-111111111111","app_metadata":{"role":"admin"}}';
do $$ declare previous timestamptz; current_stamp timestamptz; affected integer;
begin
  select updated_at into previous from public.hub_content where id='policy-draft';
  update public.hub_content set published=true where id='policy-draft';
  select updated_at into current_stamp from public.hub_content where id='policy-draft';
  if current_stamp <= previous then raise exception 'Timestamp trigger did not advance'; end if;
  update public.hub_content set published=false where id='policy-draft' and updated_at=previous;
  get diagnostics affected = row_count;
  if affected <> 0 then raise exception 'Stale update unexpectedly succeeded'; end if;
end $$;
delete from public.hub_content where id='policy-draft';
reset role;
