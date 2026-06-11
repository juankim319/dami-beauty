"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";

const NAV_ITEMS = [
  {
    href: "/admin",
    exact: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    label: "Kontrol Paneli",
  },
  {
    href: "/admin/orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: "Sipariş Yönetimi",
  },
  {
    href: "/admin/products",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    label: "Ürün Yönetimi",
  },
  {
    href: "/admin/campaigns",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    label: "Kampanyalar",
  },
  {
    href: "/admin/instagram",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    label: "Instagram",
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || !isAdmin)) {
      router.replace("/admin/login");
    }
  }, [loading, isLoginPage, user, isAdmin, router]);

  if (loading && !isLoginPage) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0d1117]">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 animate-spin text-[#00e5ff]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-slate-400">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0d1117]">
        <p className="text-slate-400 text-sm">Yönlendiriliyor...</p>
      </div>
    );
  }

  const currentLabel = NAV_ITEMS.find((n) =>
    n.exact ? pathname === n.href : pathname.startsWith(n.href)
  )?.label ?? "Kontrol Paneli";

  return (
    <div className="flex min-h-dvh bg-[#0d1117] text-slate-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-full w-56 flex-col bg-[#131920] transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-white/5 px-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#00e5ff] to-[#7c3aed]">
            <span className="text-[10px] font-bold text-white">D</span>
          </div>
          <div>
            <p className="text-[12px] font-bold tracking-wide text-white">Dami Beauty</p>
            <p className="text-[9px] text-slate-500">Yönetim Paneli</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-[#00e5ff]/10 text-[#00e5ff]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span className={active ? "text-[#00e5ff]" : "text-slate-500"}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/5 px-4 py-4">
          <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          <button
            type="button"
            onClick={() => logout()}
            className="mt-2 flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-white/5 bg-[#131920] px-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="mr-1 text-slate-400 hover:text-white md:hidden"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-[14px] font-semibold text-white">{currentLabel}</h1>
              <p className="text-[11px] text-slate-500">Genel durum (önizleme dahil)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Canlı
            </span>
            <span className="hidden text-[11px] text-slate-500 sm:block">Türkçe</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-7">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
