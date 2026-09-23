import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireCmsAdmin } from "@/lib/supabase/admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireCmsAdmin();

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
