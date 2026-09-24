"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function normalizeWhatsapp(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 10 || digits.length > 15) return null;

  return "+" + digits;
}

function safeUrl(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export async function updateStoreSettingsAction(formData: FormData) {
  const admin = await requireCmsAdmin();

  const siteName = String(formData.get("siteName") ?? "").trim();
  const shortName = String(formData.get("shortName") ?? "").trim();
  const locationLabel = String(formData.get("locationLabel") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = normalizeWhatsapp(formData.get("whatsapp"));
  const facebook = safeUrl(formData.get("facebookUrl"));
  const instagram = safeUrl(formData.get("instagramUrl"));

  if (
    !siteName ||
    !shortName ||
    !locationLabel ||
    !phone ||
    !whatsapp ||
    facebook === null ||
    instagram === null
  ) {
    redirect("/admin/magaza?error=invalid");
  }

  const openingHours = {
    weekdayLabel: String(formData.get("weekdayLabel") ?? "").trim(),
    weekdayHours: String(formData.get("weekdayHours") ?? "").trim(),
    sundayLabel: String(formData.get("sundayLabel") ?? "").trim(),
    sundayHours: String(formData.get("sundayHours") ?? "").trim(),
  };

  const socialLinks = {
    facebook,
    instagram,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("store_settings").upsert({
    id: 1,
    site_name: siteName,
    short_name: shortName,
    location_label: locationLabel,
    address: optionalText(formData.get("address")),
    phone,
    whatsapp,
    opening_hours: openingHours,
    social_links: socialLinks,
    map_query: optionalText(formData.get("mapQuery")),
    default_whatsapp_message: optionalText(
      formData.get("defaultWhatsappMessage"),
    ),
    updated_by: admin.userId,
  });

  if (error) {
    redirect("/admin/magaza?error=save");
  }

  revalidatePath("/admin/magaza");
  redirect("/admin/magaza?success=saved");
}
