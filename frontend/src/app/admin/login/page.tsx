"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminLoginPage() {
  const { login, user, isAdmin, loading, configError } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) router.replace("/admin");
  }, [loading, user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch {
      setError("Giriş başarısız. E-posta veya şifre hatalı.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0d1117]">
        <svg className="h-5 w-5 animate-spin text-[#00e5ff]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0d1117] p-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00e5ff]/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 translate-y-8 rounded-full bg-[#7c3aed]/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#7c3aed]">
            <span className="text-lg font-bold text-white">D</span>
          </div>
          <h1 className="text-xl font-bold text-white">Dami Beauty</h1>
          <p className="mt-1 text-[12px] text-slate-500">Yönetici Girişi</p>
        </div>

        {configError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-900/10 p-4 text-center text-sm text-red-400">
            {configError}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/5 bg-[#131920] p-7 shadow-2xl">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">E-posta</label>
              <input
                type="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-[#00e5ff]/50 focus:bg-white/8"
                placeholder="admin@damibeauty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-400">Şifre</label>
              <input
                type="password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors focus:border-[#00e5ff]/50"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="rounded-lg border border-red-500/20 bg-red-900/10 px-3 py-2 text-[12px] text-red-400">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-[#00e5ff]/80 to-[#7c3aed]/80 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : "Giriş Yap"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
