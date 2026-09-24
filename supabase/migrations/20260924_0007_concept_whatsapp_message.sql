-- Allow custom WhatsApp copy per concept, matching product behavior.
alter table public.concepts
  add column if not exists whatsapp_message text;
