import { cache } from "react";

import { siteConfig } from "@/config/site";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Json } from "@/types/database";

export type StoreSettings = {
  siteName: string;
  shortName: string;
  locationLabel: string;
  address: string;
  phoneDisplay: string;
  whatsapp: string;
  defaultWhatsappMessage: string;
  openingHours: {
    weekdayLabel: string;
    weekdayHours: string;
    sundayLabel: string;
    sundayHours: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
  };
  mapQuery: string;
};

export const fallbackStoreSettings: StoreSettings = {
  siteName: siteConfig.name,
  shortName: siteConfig.shortName,
  locationLabel: siteConfig.locationLabel,
  address: siteConfig.addressVerification.publicLabel,
  phoneDisplay: siteConfig.phoneDisplay,
  whatsapp: siteConfig.phoneE164,
  defaultWhatsappMessage:
    "Merhaba, Beymert web sitesi üzerinden ürünleriniz hakkında bilgi almak istiyorum.",
  openingHours: {
    weekdayLabel: siteConfig.publicHours.weekdayLabel,
    weekdayHours: siteConfig.publicHours.weekdayHours,
    sundayLabel: siteConfig.publicHours.sundayLabel,
    sundayHours: siteConfig.publicHours.sundayHours,
  },
  socialLinks: {
    facebook: siteConfig.facebookUrl,
    instagram: "",
  },
  mapQuery: `${siteConfig.name} Gemlik Bursa`,
};

function jsonObject(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json | undefined>)
    : {};
}

function jsonString(
  object: Record<string, Json | undefined>,
  key: string,
  fallback: string,
) {
  const value = object[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function textOrFallback(value: string | null, fallback: string) {
  return value?.trim() || fallback;
}

export const getStoreSettings = cache(async (): Promise<StoreSettings> => {
  try {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
      return fallbackStoreSettings;
    }

    const { data, error } = await supabase
      .from("store_settings")
      .select(
        "site_name, short_name, location_label, address, phone, whatsapp, opening_hours, social_links, map_query, default_whatsapp_message",
      )
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return fallbackStoreSettings;
    }

    const openingHours = jsonObject(data.opening_hours);
    const socialLinks = jsonObject(data.social_links);

    return {
      siteName: textOrFallback(data.site_name, fallbackStoreSettings.siteName),
      shortName: textOrFallback(data.short_name, fallbackStoreSettings.shortName),
      locationLabel: textOrFallback(
        data.location_label,
        fallbackStoreSettings.locationLabel,
      ),
      address: textOrFallback(data.address, fallbackStoreSettings.address),
      phoneDisplay: textOrFallback(
        data.phone,
        fallbackStoreSettings.phoneDisplay,
      ),
      whatsapp: textOrFallback(
        data.whatsapp,
        fallbackStoreSettings.whatsapp,
      ),
      defaultWhatsappMessage: textOrFallback(
        data.default_whatsapp_message,
        fallbackStoreSettings.defaultWhatsappMessage,
      ),
      openingHours: {
        weekdayLabel: jsonString(
          openingHours,
          "weekdayLabel",
          fallbackStoreSettings.openingHours.weekdayLabel,
        ),
        weekdayHours: jsonString(
          openingHours,
          "weekdayHours",
          fallbackStoreSettings.openingHours.weekdayHours,
        ),
        sundayLabel: jsonString(
          openingHours,
          "sundayLabel",
          fallbackStoreSettings.openingHours.sundayLabel,
        ),
        sundayHours: jsonString(
          openingHours,
          "sundayHours",
          fallbackStoreSettings.openingHours.sundayHours,
        ),
      },
      socialLinks: {
        facebook: jsonString(
          socialLinks,
          "facebook",
          fallbackStoreSettings.socialLinks.facebook,
        ),
        instagram:
          typeof socialLinks.instagram === "string"
            ? socialLinks.instagram.trim()
            : fallbackStoreSettings.socialLinks.instagram,
      },
      mapQuery: textOrFallback(
        data.map_query,
        fallbackStoreSettings.mapQuery,
      ),
    };
  } catch {
    return fallbackStoreSettings;
  }
});

export function phoneHref(settings: StoreSettings) {
  const phone = settings.phoneDisplay.replace(/[^\d+]/g, "");
  return `tel:${phone}`;
}

export function whatsappHref(settings: StoreSettings, message?: string) {
  const number = settings.whatsapp.replace(/\D/g, "");
  const text = message?.trim() || settings.defaultWhatsappMessage;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function directionsHref(settings: StoreSettings) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.mapQuery)}`;
}

export function mapEmbedHref(settings: StoreSettings) {
  return `https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`;
}
