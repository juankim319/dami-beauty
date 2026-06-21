/** Shared light-theme classes for admin pages */

export const ADMIN_BG = "bg-[#FDFAF9]";
export const ADMIN_SHELL = "bg-white";
export const ADMIN_BORDER = "border-black/[0.06]";

export const ADMIN_INPUT =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none shadow-[0_1px_2px_rgba(15,23,42,0.04)] focus:border-[#9e4a5a]/40 focus:ring-2 focus:ring-[#9e4a5a]/10";

export const ADMIN_SELECT = `${ADMIN_INPUT} cursor-pointer appearance-none`;

export const ADMIN_OPTION = "bg-white text-slate-800";

export const ADMIN_LABEL =
  "mb-1 block text-[10px] font-semibold uppercase tracking-widest text-slate-500";

export const ADMIN_CARD =
  "rounded-xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

export const ADMIN_CARD_COMPACT =
  "rounded-xl border border-black/[0.06] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

export const ADMIN_ACCENT = "#9e4a5a";

/* ─── Button system ─── */

const BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4a5a]/20 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]";

const BTN_SHADOW = "shadow-[0_1px_2px_rgba(15,23,42,0.06)]";

export const ADMIN_BTN_PRIMARY = `${BTN_BASE} ${BTN_SHADOW} border border-[#853646] bg-[#9e4a5a] px-4 py-2.5 text-[13px] text-white hover:bg-[#853646] hover:shadow-[0_4px_14px_rgba(158,74,90,0.24)]`;

export const ADMIN_BTN_SECONDARY = `${BTN_BASE} ${BTN_SHADOW} border border-slate-200 bg-white px-4 py-2.5 text-[13px] text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_2px_10px_rgba(15,23,42,0.08)]`;

export const ADMIN_BTN_GHOST = ADMIN_BTN_SECONDARY;

export const ADMIN_BTN_ACCENT = `${BTN_BASE} ${BTN_SHADOW} border border-[#d4c4a8] bg-[#faf7f2] px-3 py-2 text-[12px] text-[#6b5a48] hover:border-[#c9b08a] hover:bg-[#f3ece3] hover:shadow-[0_2px_10px_rgba(201,176,138,0.18)]`;

export const ADMIN_BTN_SUCCESS = `${BTN_BASE} ${BTN_SHADOW} border border-emerald-700/20 bg-emerald-600 px-3 py-2 text-[12px] text-white hover:bg-emerald-700 hover:shadow-[0_4px_12px_rgba(5,150,105,0.22)]`;

export const ADMIN_BTN_SUCCESS_OUTLINE = `${BTN_BASE} ${BTN_SHADOW} border border-emerald-200 bg-white px-3 py-2 text-[12px] text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-[0_2px_10px_rgba(5,150,105,0.1)]`;

export const ADMIN_BTN_DANGER = `${BTN_BASE} ${BTN_SHADOW} border border-red-200 bg-white px-3 py-2 text-[12px] text-red-700 hover:border-red-300 hover:bg-red-50 hover:shadow-[0_2px_10px_rgba(220,38,38,0.08)]`;

export const ADMIN_BTN_DANGER_SOLID = `${BTN_BASE} ${BTN_SHADOW} border border-red-700/25 bg-red-600 px-2.5 py-1.5 text-[11px] text-white hover:bg-red-700 hover:shadow-[0_4px_12px_rgba(220,38,38,0.25)]`;

export const ADMIN_BTN_ICON = `${BTN_BASE} ${BTN_SHADOW} border border-slate-200 bg-white p-2 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800`;

export const ADMIN_BTN_LINK = `${BTN_BASE} border-0 bg-transparent px-2.5 py-1.5 text-[11px] uppercase tracking-wider text-[#9e4a5a] shadow-none hover:bg-[#9e4a5a]/8 active:scale-100`;

export const ADMIN_BTN_SM = "px-3 py-2 text-[12px]";
export const ADMIN_BTN_XS = "px-2.5 py-1.5 text-[11px]";

export const ADMIN_TOOLBAR =
  "flex flex-wrap items-center gap-2 rounded-xl border border-black/[0.06] bg-white p-2 shadow-[0_1px_3px_rgba(0,0,0,0.04)]";

export const ADMIN_TOOLBAR_INSET =
  "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/90 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.04)]";

const FILTER_BASE =
  "inline-flex items-center rounded-full border font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9e4a5a]/20 focus-visible:ring-offset-1";

export const ADMIN_FILTER_ACTIVE = `${FILTER_BASE} border-[#853646] bg-[#9e4a5a] px-3.5 py-1.5 text-[12px] text-white shadow-[0_2px_8px_rgba(158,74,90,0.22)]`;

export const ADMIN_FILTER_IDLE = `${FILTER_BASE} border-slate-200 bg-white px-3.5 py-1.5 text-[12px] text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)]`;

export const ADMIN_PILL =
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)] active:scale-[0.98]";

export const ADMIN_BADGE =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold shadow-[0_1px_2px_rgba(15,23,42,0.04)]";
