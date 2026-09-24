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

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseConceptForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = toSlug(rawSlug || name);
  const shortDescription = String(
    formData.get("shortDescription") ?? "",
  ).trim();
  const richDescription = parseRichTextFormValue(
    formData.get("descriptionRich"),
  );
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const relatedProductIds = Array.from(
    new Set(
      formData
        .getAll("relatedProductIds")
        .map((value) => String(value))
        .filter((value) => uuidPattern.test(value)),
    ),
  );

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
    values: {
      name,
      slug,
      short_description: shortDescription,
      description: richDescription.text,
      description_rich: richDescription.json,
      status,
      sort_order: sortOrder,
    },
    relatedProductIds,
  };
}

function errorCode(code?: string) {
  return code === "23505" ? "slug" : "save";
}

export async function createConceptAction(formData: FormData) {
  await requireCmsAdmin();
  const parsed = parseConceptForm(formData);

  if (!parsed) {
    redirect("/admin/konseptler/yeni?error=invalid");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concepts")
    .insert({
      ...parsed.values,
      published_at:
        parsed.values.status === "published" ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect("/admin/konseptler/yeni?error=" + errorCode(error?.code));
  }

  const { error: relationError } = await supabase.rpc("set_concept_products", {
    p_concept_id: data.id,
    p_product_ids: parsed.relatedProductIds,
  });

  if (relationError) {
    await supabase.from("concepts").delete().eq("id", data.id);
    redirect("/admin/konseptler/yeni?error=save");
  }

  revalidatePath("/admin/konseptler");
  redirect("/admin/konseptler/" + data.id + "?success=created");
}

export async function updateConceptAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  const parsed = parseConceptForm(formData);

  if (!id || !parsed) {
    redirect("/admin/konseptler/" + (id || "unknown") + "?error=invalid");
  }

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("concepts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  if (readError || !existing) {
    redirect("/admin/konseptler?error=not-found");
  }

  const publishedAt =
    parsed.values.status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("concepts")
    .update({ ...parsed.values, published_at: publishedAt })
    .eq("id", id);

  if (error) {
    redirect("/admin/konseptler/" + id + "?error=" + errorCode(error.code));
  }

  const { error: relationError } = await supabase.rpc("set_concept_products", {
    p_concept_id: id,
    p_product_ids: parsed.relatedProductIds,
  });

  if (relationError) {
    redirect("/admin/konseptler/" + id + "?error=save");
  }

  revalidatePath("/admin/konseptler");
  revalidatePath("/admin/konseptler/" + id);
  redirect("/admin/konseptler/" + id + "?success=updated");
}

export async function deleteConceptAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/konseptler?error=not-found");
  }

  const supabase = await createClient();
  const { data: mediaRelations } = await supabase
    .from("concept_media")
    .select("media_id, media_assets(storage_path)")
    .eq("concept_id", id);

  const { error } = await supabase.from("concepts").delete().eq("id", id);

  if (error) {
    redirect("/admin/konseptler/" + id + "?error=save");
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

  revalidatePath("/admin/konseptler");
  redirect("/admin/konseptler?success=deleted");
}
