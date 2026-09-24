import { updateStoreSettingsAction } from "@/app/admin/(protected)/magaza/actions";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

function jsonObject(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json | undefined>)
    : {};
}

function jsonString(
  object: Record<string, Json | undefined>,
  key: string,
) {
  const value = object[key];
  return typeof value === "string" ? value : "";
}

export default async function StoreSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const openingHours = jsonObject(settings?.opening_hours ?? {});
  const socialLinks = jsonObject(settings?.social_links ?? {});

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Site Ayarları</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Mağaza bilgileri
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          İletişim, adres, çalışma saatleri ve sosyal bağlantıları tek noktadan
          yönetin. Bu değerler CMS veritabanına kaydedilir ve public site
          tarafından doğrudan kullanılır.
        </p>

        {success === "saved" ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            Mağaza ayarları kaydedildi.
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="mt-5 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
          >
            {error === "invalid"
              ? "Zorunlu alanları, WhatsApp numarasını ve sosyal bağlantıları kontrol edin."
              : "Mağaza ayarları kaydedilemedi. Lütfen tekrar deneyin."}
          </div>
        ) : null}
      </div>

      <form action={updateStoreSettingsAction} className="space-y-6">
        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-extrabold">Marka ve konum</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-extrabold">
                İşletme adı
              </span>
              <input
                name="siteName"
                required
                defaultValue={settings?.site_name ?? ""}
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Kısa marka adı
              </span>
              <input
                name="shortName"
                required
                defaultValue={settings?.short_name ?? ""}
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Kısa konum etiketi
              </span>
              <input
                name="locationLabel"
                required
                defaultValue={settings?.location_label ?? ""}
                placeholder="Gemlik · Bursa"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-extrabold">
                Açık adres / public adres metni
              </span>
              <textarea
                name="address"
                rows={3}
                defaultValue={settings?.address ?? ""}
                placeholder="İşletme sahibi doğrulandıktan sonra tam adresi yazın."
                className="w-full rounded-control border border-border bg-white px-4 py-3 leading-6 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-extrabold">
                Harita arama metni
              </span>
              <input
                name="mapQuery"
                defaultValue={settings?.map_query ?? ""}
                placeholder="Beymert Parti Malzemeleri Tuhafiye Tasarım Gemlik Bursa"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
              <span className="mt-2 block text-xs leading-5 text-muted">
                Google Maps arama/yol tarifi bağlantısında kullanılacak metin.
              </span>
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-extrabold">İletişim ve WhatsApp</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Telefon
              </span>
              <input
                name="phone"
                required
                defaultValue={settings?.phone ?? ""}
                placeholder="0543 337 70 04"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                WhatsApp numarası
              </span>
              <input
                name="whatsapp"
                required
                defaultValue={settings?.whatsapp ?? ""}
                placeholder="+905433377004"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
              <span className="mt-2 block text-xs leading-5 text-muted">
                Türkiye için +90 ile başlayan uluslararası format önerilir.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-extrabold">
                Varsayılan WhatsApp mesajı
              </span>
              <textarea
                name="defaultWhatsappMessage"
                rows={3}
                defaultValue={settings?.default_whatsapp_message ?? ""}
                placeholder="Genel WhatsApp CTA'larında kullanılacak mesaj."
                className="w-full rounded-control border border-border bg-white px-4 py-3 leading-6 outline-none transition focus:border-primary"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-extrabold">Çalışma saatleri</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Hafta içi / ana gün etiketi
              </span>
              <input
                name="weekdayLabel"
                defaultValue={jsonString(openingHours, "weekdayLabel")}
                placeholder="Pazartesi – Cumartesi"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Saatler
              </span>
              <input
                name="weekdayHours"
                defaultValue={jsonString(openingHours, "weekdayHours")}
                placeholder="10:00 – 19:30"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                İkinci gün etiketi
              </span>
              <input
                name="sundayLabel"
                defaultValue={jsonString(openingHours, "sundayLabel")}
                placeholder="Pazar"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                İkinci gün saat/açıklama
              </span>
              <input
                name="sundayHours"
                defaultValue={jsonString(openingHours, "sundayHours")}
                placeholder="Gelmeden önce iletişime geç"
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-xl font-extrabold">Sosyal medya</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Facebook URL
              </span>
              <input
                name="facebookUrl"
                type="url"
                defaultValue={jsonString(socialLinks, "facebook")}
                placeholder="https://www.facebook.com/..."
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold">
                Instagram URL
              </span>
              <input
                name="instagramUrl"
                type="url"
                defaultValue={jsonString(socialLinks, "instagram")}
                placeholder="https://www.instagram.com/..."
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
              />
            </label>
          </div>
        </div>

        <div className="sticky bottom-4 flex justify-end rounded-card border border-border bg-white/95 p-4 shadow-lift backdrop-blur">
          <button
            type="submit"
            className="min-h-11 rounded-control bg-primary px-6 font-extrabold text-white shadow-soft transition hover:bg-primary-hover"
          >
            Mağaza Ayarlarını Kaydet
          </button>
        </div>
      </form>
    </section>
  );
}
