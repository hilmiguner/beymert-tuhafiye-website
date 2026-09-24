"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { parseRichTextFormValue } from "@/lib/rich-text";
import { toSlug } from "@/lib/slug";
import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ContentStatus =
  Database["public"]["Enums"]["cms_content_status"];

const validStatuses = new Set<ContentStatus>([
  "draft",
  "published",
  "archived",
]);

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = toSlug(rawSlug || name);
  const categoryId = String(formData.get("categoryId") ?? "").trim() || null;
  const shortDescription = String(
    formData.get("shortDescription") ?? "",
  ).trim();
  const richDescription = parseRichTextFormValue(
    formData.get("descriptionRich"),
  );
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;
  const whatsappMessage =
    String(formData.get("whatsappMessage") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const colors = String(formData.get("colors") ?? "")
    .split(",")
    .map((color) => color.trim())
    .filter(Boolean);

  if (
    !name ||
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !richDescription ||
    !validStatuses.has(status) ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    return null;
  }

  return {
    name,
    slug,
    category_id: categoryId,
    short_description: shortDescription,
    description: richDescription.text,
    description_rich: richDescription.json,
    colors,
    dimensions,
    whatsapp_message: whatsappMessage,
    status,
    sort_order: sortOrder,
    featured: formData.get("featured") === "on",
    new_arrival: formData.get("newArrival") === "on",
  };
}

function errorCode(code?: string) {
  return code === "23505" ? "slug" : "save";
}

export async function createProductAction(formData: FormData) {
  await requireCmsAdmin();
  const values = parseProductForm(formData);

  if (!values) {
    redirect("/admin/urunler/yeni?error=invalid");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...values,
      published_at:
        values.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/admin/urunler/yeni?error=${errorCode(error?.code)}`);
  }

  revalidatePath("/admin/urunler");
  redirect(`/admin/urunler/${data.id}?success=created`);
}

export async function updateProductAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  const values = parseProductForm(formData);

  if (!id || !values) {
    redirect(`/admin/urunler/${id || "unknown"}?error=invalid`);
  }

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("products")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  if (readError || !existing) {
    redirect("/admin/urunler?error=not-found");
  }

  const publishedAt =
    values.status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("products")
    .update({ ...values, published_at: publishedAt })
    .eq("id", id);

  if (error) {
    redirect(`/admin/urunler/${id}?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/urunler");
  revalidatePath(`/admin/urunler/${id}`);
  redirect(`/admin/urunler/${id}?success=updated`);
}

export async function deleteProductAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/urunler?error=not-found");
  }

  const supabase = await createClient();

  const { data: mediaRelations } = await supabase
    .from("product_media")
    .select("media_id, media_assets(storage_path)")
    .eq("product_id", id);

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    redirect(`/admin/urunler/${id}?error=save`);
  }

  for (const relation of mediaRelations ?? []) {
    const mediaId = relation.media_id;
    const storagePath = relation.media_assets?.storage_path;

    const [
      { count: productUse },
      { count: conceptUse },
      { count: galleryUse },
      { count: categoryCoverUse },
      { count: conceptCoverUse },
    ] = await Promise.all([
      supabase
        .from("product_media")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("concept_media")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("gallery_items")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("cover_media_id", mediaId),
      supabase
        .from("concepts")
        .select("*", { count: "exact", head: true })
        .eq("cover_media_id", mediaId),
    ]);

    const isUnused =
      (productUse ?? 0) === 0 &&
      (conceptUse ?? 0) === 0 &&
      (galleryUse ?? 0) === 0 &&
      (categoryCoverUse ?? 0) === 0 &&
      (conceptCoverUse ?? 0) === 0;

    if (isUnused) {
      await supabase.from("media_assets").delete().eq("id", mediaId);
      if (storagePath) {
        await supabase.storage.from("cms-media").remove([storagePath]);
      }
    }
  }

  revalidatePath("/admin/urunler");
  redirect("/admin/urunler?success=deleted");
}
