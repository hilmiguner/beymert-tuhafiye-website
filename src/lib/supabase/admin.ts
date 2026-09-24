import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type CmsAdmin = {
  userId: string;
  email: string | null;
  role: "owner" | "editor";
  displayName: string | null;
};

export async function requireCmsAdmin(): Promise<CmsAdmin> {
  if (!isSupabaseConfigured()) {
    redirect("/admin/setup");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin, error } = await supabase
    .from("cms_admins")
    .select("role, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    role: admin.role as "owner" | "editor",
    displayName: admin.display_name,
  };
}
