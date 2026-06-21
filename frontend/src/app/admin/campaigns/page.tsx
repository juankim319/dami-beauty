"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import type { Campaign } from "@/types";
import { ADMIN_INPUT, ADMIN_LABEL, ADMIN_CARD, ADMIN_BTN_PRIMARY, ADMIN_BADGE } from "@/lib/admin-form-styles";

const INPUT = ADMIN_INPUT;
const LABEL = ADMIN_LABEL;

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
      <div className={ADMIN_CARD}>
        <p className="mb-4 text-sm font-semibold text-slate-800">Yeni Kampanya</p>
        <form onSubmit={handleCreate} className="space-y-3">
          <div><label className={LABEL}>Başlık *</label><input className={INPUT} placeholder="Kampanya başlığı" required value={form.title_tr} onChange={(e) => setForm({ ...form, title_tr: e.target.value })} /></div>
          <div><label className={LABEL}>Alt Başlık</label><input className={INPUT} placeholder="Alt başlık (opsiyonel)" value={form.subtitle_tr} onChange={(e) => setForm({ ...form, subtitle_tr: e.target.value })} /></div>
          <div><label className={LABEL}>Afiş Görseli URL</label><input className={INPUT} placeholder="https://..." value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} /></div>
          <button type="submit" className={ADMIN_BTN_PRIMARY}>
            Kampanya Ekle
          </button>
        </form>
      </div>

      {/* List */}
      <div className="space-y-2">
        {campaigns.length === 0 && <p className="py-8 text-center text-sm text-slate-500">Henüz kampanya yok.</p>}
        {campaigns.map((c) => (
          <div key={c.id} className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div>
              <p className="font-semibold text-slate-800">{c.title_tr}</p>
              {c.subtitle_tr && <p className="mt-0.5 text-[12px] text-slate-500">{c.subtitle_tr}</p>}
            </div>
            <span className={`${ADMIN_BADGE} ${
              c.active ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-600"
            }`}>
              {c.active ? "Aktif" : "Pasif"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
