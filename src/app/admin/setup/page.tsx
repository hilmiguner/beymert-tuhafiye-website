import Link from "next/link";
import { redirect } from "next/navigation";

import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminSetupPage() {
  if (isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#f8f3f5] px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-white p-7 shadow-soft sm:p-10">
        <p className="bt-eyebrow text-primary">CMS Foundation</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Supabase bağlantısı bekleniyor
        </h1>
        <p className="mt-4 leading-7 text-muted">
          Admin panel kodu hazır, ancak giriş sistemini etkinleştirmek için Supabase
          proje bilgileri environment variable olarak tanımlanmalı.
        </p>

        <div className="mt-8 space-y-3 rounded-card bg-surface-muted p-5">
          <code className="block text-sm font-bold">
            NEXT_PUBLIC_SUPABASE_URL
          </code>
          <code className="block text-sm font-bold">
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          </code>
        </div>

        <p className="mt-6 text-sm leading-6 text-muted">
          Bu değerler secret service-role anahtarı değildir. Service-role anahtarı
          browser ortamına veya public environment variable&apos;lara eklenmeyecek.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
        >
          Siteye dön
        </Link>
      </div>
    </main>
  );
}
