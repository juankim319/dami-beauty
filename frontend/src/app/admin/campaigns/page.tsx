"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types";

const INPUT = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-[#00e5ff]/50";
const LABEL = "block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1";

export default function AdminCampaignsPage() {
  const { token } = useAdminAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [form, setForm] = useState({ title_tr: "", subtitle_tr: "", banner_url: "" });

  const load = () => {
    if (!token) return;
    apiFetch<Campaign[]>("/campaigns", { token }).then(setCampaigns).catch(console.error);
  };
  useEffect(load, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/campaigns", { method: "POST", token, body: JSON.stringify({ ...form, product_ids: [], active: true }) });
    setForm({ title_tr: "", subtitle_tr: "", banner_url: "" });
    load();
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="rounded-xl border border-white/5 bg-[#1a2332] p-5">
        <p className="mb-4 text-sm font-semibold text-white">Yeni Kampanya</p>
        <form onSubmit={handleCreate} className="space-y-3">
          <div><label className={LABEL}>Başlık *</label><input className={INPUT} placeholder="Kampanya başlığı" required value={form.title_tr} onChange={(e) => setForm({ ...form, title_tr: e.target.value })} /></div>
          <div><label className={LABEL}>Alt Başlık</label><input className={INPUT} placeholder="Alt başlık (opsiyonel)" value={form.subtitle_tr} onChange={(e) => setForm({ ...form, subtitle_tr: e.target.value })} /></div>
          <div><label className={LABEL}>Afiş Görseli URL</label><input className={INPUT} placeholder="https://..." value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} /></div>
          <button type="submit" className="rounded-lg bg-[#00e5ff]/10 px-4 py-2 text-sm font-semibold text-[#00e5ff] ring-1 ring-[#00e5ff]/25 hover:bg-[#00e5ff]/20 transition-colors">
            Kampanya Ekle
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-2">
        {campaigns.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Henüz kampanya yok.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-[#1a2332] px-5 py-4">
            <div>
              <p className="font-semibold text-white">{c.title_tr}</p>
              {c.subtitle_tr && <p className="mt-0.5 text-[12px] text-slate-400">{c.subtitle_tr}</p>}
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
              c.active ? "bg-emerald-900/40 text-emerald-400" : "bg-slate-700/40 text-slate-400"
            }`}>
              {c.active ? "Aktif" : "Pasif"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
