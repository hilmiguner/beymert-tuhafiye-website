"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function deleteGalleryItemAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/galeri?error=not-found");
  }

  const supabase = await createClient();
  const { data: item, error: readError } = await supabase
    .from("gallery_items")
    .select("media_id, media_assets(storage_path)")
    .eq("id", id)
    .maybeSingle();

  if (readError || !item) {
    redirect("/admin/galeri?error=not-found");
  }

  const { error } = await supabase
    .from("gallery_items")
    .delete()
    .eq("id", id);

  if (error) {
    redirect("/admin/galeri/" + id + "?error=save");
  }

  const mediaId = item.media_id;
  const storagePath = item.media_assets?.storage_path;

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
    const { error: mediaDeleteError } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", mediaId);

    if (!mediaDeleteError && storagePath) {
      await supabase.storage.from("cms-media").remove([storagePath]);
    }
  }

  revalidatePath("/admin/galeri");
  redirect("/admin/galeri?success=deleted");
}
