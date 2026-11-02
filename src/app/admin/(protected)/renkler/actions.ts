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

function readColorForm(formData: FormData) {
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
  ) return null;

  return { name, group_key: groupKey, hex, slug };
}

function redirectColorError(code: string | undefined, action: "save" | "delete" = "save"): never {
  if (code === "23505") redirect("/admin/renkler?error=duplicate");
  if (code === "23503") redirect("/admin/renkler?error=in-use");
  redirect(`/admin/renkler?error=${action}`);
}

export async function createColorAction(formData: FormData) {
  await requireCmsAdmin();

  const values = readColorForm(formData);
  if (!values) redirect("/admin/renkler?error=invalid");

  const supabase = await createClient();
  const { data: lastColor } = await supabase
    .from("colors")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("colors").insert({
    ...values,
    sort_order: Math.max((lastColor?.sort_order ?? 999) + 1, 1000),
    is_active: true,
  });

  if (error) redirectColorError(error.code);

  revalidatePath("/admin/renkler");
  revalidatePath("/admin/urunler");
  redirect("/admin/renkler?success=created");
}

export async function updateColorAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const values = readColorForm(formData);
  if (!id || !values) redirect("/admin/renkler?error=invalid");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("colors")
    .update(values)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) redirectColorError(error.code);
  if (!data) redirect("/admin/renkler?error=save");

  revalidatePath("/admin/renkler");
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  redirect("/admin/renkler?success=updated");
}

export async function deleteColorAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) redirect("/admin/renkler?error=invalid");

  const supabase = await createClient();
  const [links, variants] = await Promise.all([
    supabase.from("product_colors").select("*", { count: "exact", head: true }).eq("color_id", id),
    supabase.from("product_color_variants").select("*", { count: "exact", head: true }).eq("color_id", id),
  ]);

  if (links.error || variants.error) redirect("/admin/renkler?error=delete");
  if ((links.count ?? 0) > 0 || (variants.count ?? 0) > 0) {
    redirect("/admin/renkler?error=in-use");
  }

  const { error } = await supabase.from("colors").delete().eq("id", id);
  if (error) redirectColorError(error.code, "delete");

  revalidatePath("/admin/renkler");
  revalidatePath("/admin/urunler");
  revalidatePath("/urunler");
  redirect("/admin/renkler?success=deleted");
}
