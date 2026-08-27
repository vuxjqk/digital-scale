import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";

import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-[0_0_80px_-24px_rgba(14,165,233,0.8)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-400/80">
          Scale System
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Đăng nhập</h1>
        <p className="mt-2 text-sm text-slate-400">
          Đăng nhập để sử dụng hệ thống cân.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
