"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import type { InstagramPost } from "@/types";

const INPUT = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-[#00e5ff]/50";
const LABEL = "block text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1";

export default function AdminInstagramPage() {
  const { token } = useAdminAuth();
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [form, setForm] = useState({ image_url: "", post_url: "https://www.instagram.com/damibeautyy/" });

  const load = () => { apiFetch<InstagramPost[]>("/instagram").then(setPosts).catch(console.error); };
  useEffect(load, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/instagram", { method: "POST", token, body: JSON.stringify({ ...form, sort_order: posts.length, active: true }) });
    setForm({ image_url: "", post_url: "https://www.instagram.com/damibeautyy/" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await apiFetch(`/instagram/${id}`, { method: "DELETE", token });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/5 bg-[#1a2332] p-5">
        <p className="mb-1 text-sm font-semibold text-white">Instagram Görseli Ekle</p>
        <p className="mb-4 text-[12px] text-slate-500">Ana sayfada görünmesini istediğiniz görselleri ekleyin.</p>
        <form onSubmit={handleCreate} className="space-y-3">
          <div><label className={LABEL}>Görsel URL *</label><input className={INPUT} placeholder="https://..." required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} /></div>
          <div><label className={LABEL}>Gönderi URL *</label><input className={INPUT} placeholder="https://www.instagram.com/p/..." required value={form.post_url} onChange={(e) => setForm({ ...form, post_url: e.target.value })} /></div>
          <button type="submit" className="rounded-lg bg-[#00e5ff]/10 px-4 py-2 text-sm font-semibold text-[#00e5ff] ring-1 ring-[#00e5ff]/25 hover:bg-[#00e5ff]/20 transition-colors">
            Ekle
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {posts.map((post) => (
          <div key={post.id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/5">
            <Image src={post.image_url} alt="" fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="200px" />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40" />
            <button
              type="button"
              onClick={() => handleDelete(post.id)}
              className="absolute right-2 top-2 hidden rounded-lg bg-red-500/90 px-2 py-1 text-[11px] font-medium text-white hover:bg-red-500 group-hover:block"
            >
              Sil
            </button>
            <a href={post.post_url} target="_blank" rel="noopener noreferrer"
              className="absolute bottom-2 left-2 hidden rounded bg-black/60 px-2 py-0.5 text-[10px] text-white group-hover:block">
              Göster ↗
            </a>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-16 text-center text-sm text-slate-500">Henüz görsel eklenmedi.</div>
        )}
      </div>
    </div>
  );
}
