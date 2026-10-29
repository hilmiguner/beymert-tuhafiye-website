"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  buildAdminCategoryOptions,
  getAdminCategoryDescendantIds,
  type CategoryLevel,
} from "@/lib/category-hierarchy";
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
  const level = Number(formData.get("level") ?? 1) as CategoryLevel;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;

  if (
    !name ||
    !slug ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !validStatuses.has(status) ||
    ![1, 2, 3].includes(level) ||
    (level === 1 && parentId !== null) ||
    (level > 1 && !parentId) ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0
  ) {
    return null;
  }

  return {
    values: {
      name,
      slug,
      description,
      status,
      sort_order: sortOrder,
    },
    level,
    parentId,
  };
}

function errorCode(code?: string) {
  if (code === "23505") return "slug";
  if (code === "23503" || code === "23514") return "hierarchy";
  return "save";
}

function revalidateCategorySurfaces(slugs: readonly string[] = []) {
  revalidatePath("/");
  revalidatePath("/kategoriler");
  revalidatePath("/urunler");

  for (const slug of slugs.filter(Boolean)) {
    revalidatePath(`/kategoriler/${slug}`);
  }
}

export async function createCategoryAction(formData: FormData) {
  await requireCmsAdmin();
  const parsed = parseCategoryForm(formData);

  if (!parsed) {
    redirect("/admin/kategoriler/yeni?error=invalid");
  }

  const supabase = await createClient();
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, parent_id, sort_order");

  if (categoryError) {
    redirect("/admin/kategoriler/yeni?error=save");
  }

  if (parsed.level > 1) {
    const parent = buildAdminCategoryOptions(categories ?? []).find(
      (option) => option.id === parsed.parentId,
    );

    if (!parent || parent.level !== parsed.level - 1) {
      redirect("/admin/kategoriler/yeni?error=hierarchy");
    }
  }

  const { error } = await supabase.from("categories").insert({
    ...parsed.values,
    parent_id: parsed.level === 1 ? null : parsed.parentId,
    published_at:
      parsed.values.status === "published" ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/admin/kategoriler/yeni?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/kategoriler");
  revalidateCategorySurfaces([parsed.values.slug]);
  redirect("/admin/kategoriler?success=created");
}

export async function updateCategoryAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  const parsed = parseCategoryForm(formData);

  if (!id || !parsed) {
    redirect(`/admin/kategoriler/${id || "unknown"}?error=invalid`);
  }

  const supabase = await createClient();
  const [
    { data: existing, error: readError },
    { data: categories, error: categoryError },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("published_at, slug")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("categories")
      .select("id, name, parent_id, sort_order"),
  ]);

  if (readError || !existing) {
    redirect("/admin/kategoriler?error=not-found");
  }

  if (categoryError) {
    redirect(`/admin/kategoriler/${id}?error=save`);
  }

  const categoryRows = categories ?? [];
  const descendants = getAdminCategoryDescendantIds(categoryRows, id);

  if (parsed.level > 1) {
    const parent = buildAdminCategoryOptions(categoryRows).find(
      (option) => option.id === parsed.parentId,
    );

    if (
      !parent ||
      parent.level !== parsed.level - 1 ||
      parent.id === id ||
      descendants.has(parent.id)
    ) {
      redirect(`/admin/kategoriler/${id}?error=hierarchy`);
    }
  }

  const publishedAt =
    parsed.values.status === "published"
      ? existing.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("categories")
    .update({
      ...parsed.values,
      parent_id: parsed.level === 1 ? null : parsed.parentId,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/kategoriler/${id}?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/kategoriler");
  revalidatePath(`/admin/kategoriler/${id}`);
  revalidateCategorySurfaces([existing.slug, parsed.values.slug]);
  redirect("/admin/kategoriler?success=updated");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireCmsAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    redirect("/admin/kategoriler?error=not-found");
  }

  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    redirect(`/admin/kategoriler/${id}?error=${errorCode(error.code)}`);
  }

  revalidatePath("/admin/kategoriler");
  revalidateCategorySurfaces(category?.slug ? [category.slug] : []);
  redirect("/admin/kategoriler?success=deleted");
}
