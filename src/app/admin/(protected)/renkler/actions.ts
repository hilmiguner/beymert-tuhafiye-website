"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { toSlug } from "@/lib/slug";
import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProductColorGroupKey } from "@/types/product";

const validGroups = new Set<ProductColorGroupKey>([
  "basic",
  "special",
  "metallic_chrome",
  "other",
]);

export async function createColorAction(formData: FormData) {
  await requireCmsAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const groupKey = String(formData.get("groupKey") ?? "other") as ProductColorGroupKey;
  const hexValue = String(formData.get("hex") ?? "").trim().toUpperCase();
  const hex = hexValue || null;
  const slug = toSlug(name);

  if (
    !name ||
    !slug ||
    !validGroups.has(groupKey) ||
    (hex && !/^#[0-9A-F]{6}$/.test(hex))
  ) {
    redirect("/admin/renkler?error=invalid");
  }

  const supabase = await createClient();
  const { data: lastColor } = await supabase
    .from("colors")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("colors").insert({
    name,
    slug,
    group_key: groupKey,
    hex,
    sort_order: Math.max((lastColor?.sort_order ?? 999) + 1, 1000),
    is_active: true,
  });

  if (error) {
    redirect(
      `/admin/renkler?error=${error.code === "23505" ? "duplicate" : "save"}`,
    );
  }

  revalidatePath("/admin/renkler");
  revalidatePath("/admin/urunler");
  redirect("/admin/renkler?success=created");
}
