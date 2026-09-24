"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

function parseCategoryForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = toSlug(rawSlug || name);
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft") as ContentStatus;
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (
    !name ||
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !validStatuses.has(status) ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    return null;
  }

  return {
    name,
    slug,
    description,
    status,
    sort_order: sortOrder,
  };
}

function errorCode(code?: string) {
  return code === "23505" ? "slug" : "save";
}

export async function createCategoryAction(formData: FormData) {
  await requireCmsAdmin();
  const values = parseCategoryForm(formData);

  if (!values) {
    redirect("/admin/kategoriler/yeni?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    ...values,
    published_at:
      values.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/admin/kategoriler/yeni?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler?success=created");
}

export async function updateCategoryAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  const values = parseCategoryForm(formData);

  if (!id || !values) {
    redirect(`/admin/kategoriler/${id || "unknown"}?error=invalid`);
  }

  const supabase = await createClient();
  const { data: existing, error: readError } = await supabase
    .from("categories")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();

  if (readError || !existing) {
    redirect("/admin/kategoriler?error=not-found");
  }

  const publishedAt =
    values.status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("categories")
    .update({
      ...values,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/kategoriler/${id}?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath(`/admin/kategoriler/${id}`);
  redirect("/admin/kategoriler?success=updated");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/kategoriler?error=not-found");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    redirect(`/admin/kategoriler/${id}?error=save`);
  }

  revalidatePath("/admin/kategoriler");
  redirect("/admin/kategoriler?success=deleted");
}
