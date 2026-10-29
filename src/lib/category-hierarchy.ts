import type { Category } from "@/types/category";

export type CategoryLevel = 1 | 2 | 3;

export type AdminCategoryRow = {
  id: string;
  name: string;
  parent_id: string | null;
  sort_order?: number;
};

export type AdminCategoryOption = {
  id: string;
  name: string;
  parentId: string | null;
  level: CategoryLevel;
  path: string;
};

function bySortOrderAndName(
  left: AdminCategoryRow,
  right: AdminCategoryRow,
) {
  const order = (left.sort_order ?? 0) - (right.sort_order ?? 0);
  return order !== 0
    ? order
    : left.name.localeCompare(right.name, "tr");
}

export function buildAdminCategoryOptions(
  rows: readonly AdminCategoryRow[],
): AdminCategoryOption[] {
  const childrenByParent = new Map<string | null, AdminCategoryRow[]>();

  for (const row of rows) {
    const siblings = childrenByParent.get(row.parent_id) ?? [];
    siblings.push(row);
    childrenByParent.set(row.parent_id, siblings);
  }

  for (const siblings of childrenByParent.values()) {
    siblings.sort(bySortOrderAndName);
  }

  const result: AdminCategoryOption[] = [];
  const visited = new Set<string>();

  const visit = (
    row: AdminCategoryRow,
    level: CategoryLevel,
    ancestors: readonly string[],
  ) => {
    if (visited.has(row.id)) return;
    visited.add(row.id);

    const pathParts = [...ancestors, row.name];
    result.push({
      id: row.id,
      name: row.name,
      parentId: row.parent_id,
      level,
      path: pathParts.join(" › "),
    });

    if (level === 3) return;

    for (const child of childrenByParent.get(row.id) ?? []) {
      visit(child, (level + 1) as CategoryLevel, pathParts);
    }
  };

  for (const root of childrenByParent.get(null) ?? []) {
    visit(root, 1, []);
  }

  for (const row of [...rows].sort(bySortOrderAndName)) {
    if (!visited.has(row.id)) {
      visit(row, 1, []);
    }
  }

  return result;
}

export function getAdminCategoryDescendantIds(
  rows: readonly AdminCategoryRow[],
  categoryId: string,
) {
  const childrenByParent = new Map<string, string[]>();

  for (const row of rows) {
    if (!row.parent_id) continue;
    const children = childrenByParent.get(row.parent_id) ?? [];
    children.push(row.id);
    childrenByParent.set(row.parent_id, children);
  }

  const descendants = new Set<string>();
  const queue = [...(childrenByParent.get(categoryId) ?? [])];

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (descendants.has(id)) continue;
    descendants.add(id);
    queue.push(...(childrenByParent.get(id) ?? []));
  }

  return descendants;
}

export function getTopLevelCategories(categories: readonly Category[]) {
  return categories.filter((category) => !category.parentSlug);
}

export function getCategoryChildren(
  categories: readonly Category[],
  parentSlug: string,
) {
  return categories.filter((category) => category.parentSlug === parentSlug);
}

export function getCategoryAncestors(
  categories: readonly Category[],
  categorySlug: string,
) {
  const bySlug = new Map(categories.map((category) => [category.slug, category]));
  const ancestors: Category[] = [];
  const seen = new Set<string>();
  let current = bySlug.get(categorySlug);

  while (current?.parentSlug && !seen.has(current.parentSlug)) {
    seen.add(current.parentSlug);
    const parent = bySlug.get(current.parentSlug);
    if (!parent) break;
    ancestors.unshift(parent);
    current = parent;
  }

  return ancestors;
}

export function getCategoryDescendantSlugs(
  categories: readonly Category[],
  categorySlug: string,
) {
  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    if (!category.parentSlug) continue;
    const children = childrenByParent.get(category.parentSlug) ?? [];
    children.push(category.slug);
    childrenByParent.set(category.parentSlug, children);
  }

  const slugs = new Set<string>([categorySlug]);
  const queue = [...(childrenByParent.get(categorySlug) ?? [])];

  while (queue.length > 0) {
    const slug = queue.shift()!;
    if (slugs.has(slug)) continue;
    slugs.add(slug);
    queue.push(...(childrenByParent.get(slug) ?? []));
  }

  return slugs;
}

export function sortPublicCategoriesByHierarchy(
  categories: readonly Category[],
) {
  const childrenByParent = new Map<string | null, Category[]>();

  for (const category of categories) {
    const key = category.parentSlug ?? null;
    const children = childrenByParent.get(key) ?? [];
    children.push(category);
    childrenByParent.set(key, children);
  }

  for (const children of childrenByParent.values()) {
    children.sort(
      (left, right) =>
        left.sortOrder - right.sortOrder ||
        left.name.localeCompare(right.name, "tr"),
    );
  }

  const result: Category[] = [];
  const visited = new Set<string>();

  const visit = (category: Category) => {
    if (visited.has(category.slug)) return;
    visited.add(category.slug);
    result.push(category);

    for (const child of childrenByParent.get(category.slug) ?? []) {
      visit(child);
    }
  };

  for (const root of childrenByParent.get(null) ?? []) {
    visit(root);
  }

  for (const category of categories) {
    if (!visited.has(category.slug)) visit(category);
  }

  return result;
}
