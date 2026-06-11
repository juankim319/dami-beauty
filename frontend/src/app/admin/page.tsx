"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { apiFetch } from "@/lib/api";
import { formatTRY } from "@/lib/format";
import type { AdminDashboard, Order, Product } from "@/types";
import { isPendingOrder, isTodayOrder, formatAdminDate, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/admin-order-utils";
import { PRODUCT_STATUS_LABEL, PRODUCT_STATUS_STYLE, getProductSaleStatus } from "@/lib/admin-product-status";

type DetailPanel = "today" | "pending" | "low_stock" | null;

/* ─── refined palette (burgundy · champagne · slate) ─── */
const ACCENT = {
  champagne: "#c9b08a",
  wine: "#9e4a5a",
  rose: "#b8929a",
  slate: "#64748b",
  muted: "#94a3b8",
  emerald: "#7d9e8f",
  amber: "#b8956a",
};

const STATUS_CHART: Record<string, string> = {
  pending: "#6b7280",
  paid: "#c9b08a",
  processing: "#8b7355",
  shipped: "#9e4a5a",
  delivered: "#7d9e8f",
  cancelled: "#5c4a4a",
};

const CHART_TICK = { fill: "#475569", fontSize: 10, fontWeight: 400 };
const GRID_STROKE = "rgba(148,163,184,0.06)";

function StatCard({
  label, value, sub, accent, active, onClick,
}: {
  label: string; value: string | number; sub?: string;
  accent?: string; active?: boolean; onClick?: () => void;
}) {
  const clickable = Boolean(onClick);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${
        active
          ? "border-[#c9b08a]/30 bg-gradient-to-br from-[#1e1a18]/80 to-[#141820] shadow-[inset_0_1px_0_rgba(201,176,138,0.08)]"
          : "border-white/[0.06] bg-[#141820]/90"
      } ${clickable ? "cursor-pointer hover:border-white/10 hover:bg-[#181c24]" : "cursor-default"}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{label}</p>
        {clickable && (
          <span className="text-[9px] uppercase tracking-wider text-slate-600">
            {active ? "Kapat" : "İncele"}
          </span>
        )}
      </div>
      <p className="mt-4 text-[2.25rem] font-light tabular-nums leading-none tracking-tight" style={{ color: accent ?? ACCENT.champagne }}>
        {value}
      </p>
      {sub && <p className="mt-2.5 text-[11px] leading-relaxed text-slate-600">{sub}</p>}
    </button>
  );
}

const cardCls = "rounded-2xl border border-white/[0.06] bg-[#141820]/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]";

function ChartTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <p className="text-[12px] font-medium tracking-wide text-slate-200">{title}</p>
      {sub && <p className="mt-1 text-[10px] text-slate-600">{sub}</p>}
    </div>
  );
}

function ChartTooltip({ active, payload, label, valueFormatter }: {
  active?: boolean;
  payload?: Array<{ value: number; name?: string; color?: string }>;
  label?: string;
  valueFormatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0f1318]/95 px-3 py-2 shadow-xl backdrop-blur-sm">
      {label && <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-500">{label}</p>}
      <p className="text-[13px] font-medium tabular-nums text-[#e8dcc8]">
        {valueFormatter ? valueFormatter(val) : val}
      </p>
    </div>
  );
}

function buildTrendData(orders: Order[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
    days[key] = 0;
  }
  orders.forEach((o) => {
    if (!o.created_at) return;
    const d = new Date(o.created_at);
    const key = `${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
    if (key in days) days[key]++;
  });
  return Object.entries(days).map(([date, count]) => ({ date, count }));
}

function buildTopProducts(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) =>
    o.items.forEach((item) => {
      const name = item.name_tr.length > 18 ? item.name_tr.slice(0, 18) + "…" : item.name_tr;
      map[name] = (map[name] ?? 0) + item.quantity;
    })
  );
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));
}

function buildStatusMix(orders: Order[]) {
  const map: Record<string, number> = {};
  orders.forEach((o) => { map[o.status] = (map[o.status] ?? 0) + 1; });
  return Object.entries(map).map(([status, value]) => ({
    name: ORDER_STATUS_LABEL[status] ?? status,
    value,
    fill: STATUS_CHART[status] ?? ACCENT.slate,
  }));
}

function buildLowStock(dashboard: AdminDashboard) {
  return dashboard.low_stock_products.slice(0, 5).map((p) => ({
    name: p.product_name.length > 10 ? p.product_name.slice(0, 10) + "…" : p.product_name,
    stock: p.stock,
  }));
}

function buildTrendRevenue(orders: Order[]) {
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
    days[key] = 0;
  }
  orders
    .filter((o) => ["paid", "delivered", "shipped"].includes(o.status))
    .forEach((o) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = `${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getDate().toString().padStart(2, "0")}`;
      if (key in days) days[key] += o.total_try;
    });
  return Object.entries(days).map(([date, revenue]) => ({ date, revenue }));
}

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activePanel, setActivePanel] = useState<DetailPanel>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<AdminDashboard>("/admin/dashboard", { token }).then(setData).catch(console.error);
    apiFetch<Order[]>("/orders", { token }).then(setAllOrders).catch(console.error);
    apiFetch<Product[]>("/admin/products", { token }).then(setAllProducts).catch(console.error);
  }, [token]);

  const togglePanel = (panel: DetailPanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-5 w-5 animate-spin rounded-full border border-slate-700 border-t-[#c9b08a]" />
      </div>
    );
  }

  const trendData = buildTrendData(allOrders);
  const topProducts = buildTopProducts(allOrders);
  const statusMix = buildStatusMix(allOrders);
  const lowStockBar = buildLowStock(data);
  const revenueData = buildTrendRevenue(allOrders);
  const statusTotal = statusMix.reduce((s, x) => s + x.value, 0);

  const totalStock = allProducts.reduce((s, p) => s + (p.variants[0]?.stock ?? 0), 0);
  const todayOrders = allOrders.filter(isTodayOrder);
  const pendingOrders = allOrders.filter(isPendingOrder);
  const lowStockProducts = allProducts.filter((p) => {
    const s = getProductSaleStatus(p);
    return s === "low_stock" || s === "out_of_stock";
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Bugünün Siparişleri" value={data.orders_today} sub="Detaylar için tıklayın" accent={ACCENT.champagne} active={activePanel === "today"} onClick={() => togglePanel("today")} />
        <StatCard label="Bekleyen" value={data.pending_orders} sub="Ödendi · Hazırlanıyor" accent={ACCENT.wine} active={activePanel === "pending"} onClick={() => togglePanel("pending")} />
        <StatCard label="Az Stok" value={data.low_stock_products.length} sub="Detaylar için tıklayın" accent={ACCENT.amber} active={activePanel === "low_stock"} onClick={() => togglePanel("low_stock")} />
        <StatCard label="Toplam Stok" value={totalStock.toLocaleString("tr-TR")} sub="Tüm ürünler" accent={ACCENT.emerald} />
      </div>

      {activePanel && (
        <div className={cardCls}>
          {activePanel === "today" && (
            <>
              <PanelHeader title="Bugünün Siparişleri" count={todayOrders.length} href="/admin/orders?filter=today" />
              {todayOrders.length === 0 ? <EmptyPanel message="Bugün henüz sipariş yok." /> : (
                <div className="space-y-2">{todayOrders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
              )}
            </>
          )}
          {activePanel === "pending" && (
            <>
              <PanelHeader title="Bekleyen Siparişler" count={pendingOrders.length} href="/admin/orders?filter=pending" />
              {pendingOrders.length === 0 ? <EmptyPanel message="Bekleyen sipariş yok." /> : (
                <div className="space-y-2">{pendingOrders.map((o) => <OrderRow key={o.id} order={o} />)}</div>
              )}
            </>
          )}
          {activePanel === "low_stock" && (
            <>
              <PanelHeader title="Az Stok" count={lowStockProducts.length || data.low_stock_products.length} href="/admin/products?filter=low_stock" />
              {(lowStockProducts.length === 0 && data.low_stock_products.length === 0) ? (
                <EmptyPanel message="Az stoklu ürün yok." />
              ) : (
                <div className="space-y-2">
                  {(lowStockProducts.length > 0 ? lowStockProducts.map((p) => (
                    <LowStockRow key={p.id} name={p.name_tr} stock={p.variants[0]?.stock ?? 0} threshold={p.variants[0]?.low_stock_threshold ?? 5} status={getProductSaleStatus(p)} />
                  )) : data.low_stock_products.map((p) => (
                    <LowStockRow key={p.product_id} name={p.product_name} stock={p.stock} threshold={p.threshold} status="low_stock" />
                  )))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={cardCls}>
          <ChartTitle title="7 Günlük Sipariş" sub="Günlük sipariş adedi" />
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT.champagne} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={ACCENT.champagne} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="date" tick={CHART_TICK} tickLine={false} axisLine={false} dy={8} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
              <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} sipariş`} />} cursor={{ stroke: "rgba(201,176,138,0.15)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="count" stroke={ACCENT.champagne} strokeWidth={1.5} fill="url(#trendFill)" dot={false} activeDot={{ r: 3, fill: ACCENT.champagne, stroke: "#141820", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={cardCls}>
          <ChartTitle title="En Çok Satanlar" sub="Adete göre en popüler ürünler" />
          {topProducts.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-[11px] text-slate-600">Veri yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }} barCategoryGap="28%">
                <XAxis type="number" tick={CHART_TICK} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={72} tick={{ ...CHART_TICK, fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} adet`} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="qty" radius={[0, 3, 3, 0]} barSize={10}>
                  {topProducts.map((_, i) => (
                    <Cell key={i} fill={`rgba(201,176,138,${0.25 + (topProducts.length - i) * 0.12})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={cardCls}>
          <ChartTitle title="Sipariş Durumu" sub="Durum dağılımı" />
          {statusMix.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-[11px] text-slate-600">Veri yok</div>
          ) : (
            <>
              <div className="relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={statusMix}
                      cx="50%" cy="50%"
                      innerRadius={52}
                      outerRadius={68}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {statusMix.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} sipariş`} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-slate-600">Toplam</span>
                  <span className="text-xl font-light tabular-nums text-[#e8dcc8]">{statusTotal}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/[0.04] pt-3">
                {statusMix.map((s) => (
                  <span key={s.name} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fill }} />
                    {s.name}
                    <span className="tabular-nums text-slate-600">{s.value}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={cardCls}>
          <ChartTitle title="Kritik Stok Ürünleri" sub="Az stoklu ürünler" />
          {lowStockBar.length === 0 ? (
            <div className="flex h-[180px] items-center justify-center text-[11px] text-slate-600">Stok sorunu yok</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={lowStockBar} margin={{ top: 8, right: 8, left: -16, bottom: 24 }}>
                <CartesianGrid stroke={GRID_STROKE} vertical={false} />
                <XAxis dataKey="name" tick={{ ...CHART_TICK, fontSize: 9 }} tickLine={false} axisLine={false} interval={0} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v} adet`} />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="stock" fill={ACCENT.amber} fillOpacity={0.55} radius={[3, 3, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className={cardCls}>
          <ChartTitle title="7 Günlük Ciro" sub="Ödenen sipariş cirosu" />
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ACCENT.wine} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={ACCENT.wine} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_STROKE} vertical={false} />
              <XAxis dataKey="date" tick={CHART_TICK} tickLine={false} axisLine={false} dy={8} />
              <YAxis tick={{ ...CHART_TICK, fontSize: 9 }} tickLine={false} axisLine={false} width={36} tickFormatter={(v) => `₺${Math.round(Number(v) / 100)}`} />
              <Tooltip content={<ChartTooltip valueFormatter={(v) => `₺${(v / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}`} />} cursor={{ stroke: "rgba(158,74,90,0.15)", strokeWidth: 1 }} />
              <Area type="monotone" dataKey="revenue" stroke={ACCENT.wine} strokeWidth={1.5} fill="url(#revFill)" dot={false} activeDot={{ r: 3, fill: ACCENT.wine, stroke: "#141820", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={cardCls}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-medium tracking-wide text-slate-200">Son Siparişler</p>
              <p className="mt-1 text-[10px] text-slate-600">Son hareketler</p>
            </div>
            <Link href="/admin/orders" className="text-[10px] uppercase tracking-wider text-[#c9b08a]/80 transition-colors hover:text-[#c9b08a]">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-1.5">
            {data.recent_orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-slate-300">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="mt-0.5 max-w-[130px] truncate text-[10px] text-slate-600">{order.guest_email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] tabular-nums text-[#c9b08a]">{formatTRY(order.total_try)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const sc = ORDER_STATUS_STYLE[status];
  return (
    <span className={`text-[9px] uppercase tracking-wider ${sc?.text ?? "text-slate-500"}`}>
      {ORDER_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function PanelHeader({ title, count, href }: { title: string; count: number; href: string }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="text-[11px] text-slate-600">{count} sipariş</p>
      </div>
      <Link href={href} className="text-[10px] uppercase tracking-wider text-[#c9b08a]/80 hover:text-[#c9b08a]">Tümünü Gör →</Link>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return <div className="py-10 text-center text-[12px] text-slate-600">{message}</div>;
}

function OrderRow({ order }: { order: Order }) {
  const sc = ORDER_STATUS_STYLE[order.status] ?? { bg: "bg-slate-700/40", text: "text-slate-400" };
  return (
    <Link href={`/admin/orders?filter=${order.status}`} className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-white/[0.03]">
      <div>
        <p className="text-[12px] font-medium text-slate-200">#{order.id.slice(0, 8).toUpperCase()}</p>
        <p className="text-[10px] text-slate-600">{order.shipping_address.full_name} · {formatAdminDate(order.created_at)}</p>
      </div>
      <div className="text-right">
        <p className="text-[12px] tabular-nums text-[#c9b08a]">{formatTRY(order.total_try)}</p>
        <span className={`text-[9px] uppercase tracking-wider ${sc.text}`}>{ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
      </div>
    </Link>
  );
}

function LowStockRow({ name, stock, threshold, status }: { name: string; stock: number; threshold: number; status: keyof typeof PRODUCT_STATUS_LABEL }) {
  const sc = PRODUCT_STATUS_STYLE[status] ?? PRODUCT_STATUS_STYLE.low_stock;
  return (
    <div className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white/[0.02]">
      <div>
        <p className="text-[12px] font-medium text-slate-200">{name}</p>
        <p className="text-[10px] text-slate-600">Stok: {stock} · Eşik: ≤{threshold}</p>
      </div>
      <span className={`text-[9px] uppercase tracking-wider ${sc.text}`}>{PRODUCT_STATUS_LABEL[status]}</span>
    </div>
  );
}
