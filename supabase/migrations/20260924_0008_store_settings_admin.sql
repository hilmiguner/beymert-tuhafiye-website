-- Expand singleton store/site settings for CMS management.
alter table public.store_settings
  add column if not exists site_name text,
  add column if not exists short_name text,
  add column if not exists location_label text,
  add column if not exists default_whatsapp_message text;

insert into public.store_settings (
  id,
  site_name,
  short_name,
  location_label,
  address,
  phone,
  whatsapp,
  opening_hours,
  social_links,
  map_query,
  default_whatsapp_message
)
values (
  1,
  'Beymert Parti Malzemeleri Tuhafiye Tasarım',
  'Beymert',
  'Gemlik · Bursa',
  'Hamidiye · Gemlik · Bursa',
  '0543 337 70 04',
  '+905433377004',
  jsonb_build_object(
    'weekdayLabel', 'Pazartesi – Cumartesi',
    'weekdayHours', '10:00 – 19:30',
    'sundayLabel', 'Pazar',
    'sundayHours', 'Gelmeden önce iletişime geç'
  ),
  jsonb_build_object(
    'facebook', 'https://www.facebook.com/beymertasarim/',
    'instagram', ''
  ),
  'Beymert Parti Malzemeleri Tuhafiye Tasarım Gemlik Bursa',
  'Merhaba, Beymert web sitesi üzerinden ürünleriniz hakkında bilgi almak istiyorum.'
)
on conflict (id) do nothing;
