import Link from "next/link";

import { loginAction } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const errorMessages: Record<string, string> = {
  missing: "E-posta ve şifre alanlarını doldurun.",
  credentials: "E-posta veya şifre hatalı.",
  unauthorized: "Bu hesabın Beymert yönetim paneline erişim yetkisi yok.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="min-h-screen bg-[#f8f3f5] px-5 py-12 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <section className="w-full rounded-[2rem] border border-border bg-white p-7 shadow-soft sm:p-9">
          <Link
            href="/"
            className="text-sm font-extrabold text-primary hover:text-primary-hover"
          >
            ← Beymert sitesine dön
          </Link>

          <div className="mt-8">
            <p className="bt-eyebrow text-primary">Beymert CMS</p>
            <h1 className="bt-display mt-2 text-4xl font-semibold text-foreground">
              Yönetim Paneli
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              Ürün, konsept, galeri ve mağaza içeriklerini yönetmek için giriş yapın.
            </p>
          </div>

          {!configured ? (
            <div className="mt-6 rounded-control border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              Supabase henüz yapılandırılmadı.{" "}
              <Link href="/admin/setup" className="font-extrabold underline">
                Kurulum durumunu görüntüle
              </Link>
              .
            </div>
          ) : null}

          {error && errorMessages[error] ? (
            <div
              role="alert"
              className="mt-6 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
            >
              {errorMessages[error]}
            </div>
          ) : null}

          <form action={loginAction} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-foreground">
                E-posta
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={!configured}
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-foreground outline-none transition focus:border-primary disabled:bg-surface-muted"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-extrabold text-foreground">
                Şifre
              </span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!configured}
                className="min-h-12 w-full rounded-control border border-border bg-white px-4 text-foreground outline-none transition focus:border-primary disabled:bg-surface-muted"
              />
            </label>

            <button
              type="submit"
              disabled={!configured}
              className="min-h-12 w-full rounded-control bg-primary px-5 font-extrabold text-white shadow-soft transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              Giriş Yap
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
