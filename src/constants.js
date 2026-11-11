export const LS_KEY = "sumber-agung-payroll-v1";

export const STORES = [
  { key: "S1", label: "STORE 1 (BURING)", short: "STORE 1 - BURING" },
  { key: "S2", label: "STORE 2", short: "STORE 2" },
  { key: "S3", label: "STORE 3", short: "STORE 3" },
  { key: "GD", label: "GUDANG", short: "GUDANG" },
];

export const TONE = {
  indigo: { soft: "bg-indigo-50 border-indigo-200", head: "bg-indigo-50 text-indigo-800", text: "text-indigo-700", bar: "bg-indigo-500", chip: "border-indigo-300 bg-indigo-100 text-indigo-800", tab: "border-indigo-500 text-indigo-800 bg-indigo-50", ico: "text-indigo-500" },
  sky: { soft: "bg-sky-50 border-sky-200", head: "bg-sky-50 text-sky-800", text: "text-sky-700", bar: "bg-sky-500", chip: "border-sky-300 bg-sky-100 text-sky-800", tab: "border-sky-500 text-sky-800 bg-sky-50", ico: "text-sky-500" },
  emerald: { soft: "bg-emerald-50 border-emerald-200", head: "bg-emerald-50 text-emerald-800", text: "text-emerald-700", bar: "bg-emerald-500", chip: "border-emerald-300 bg-emerald-100 text-emerald-800", tab: "border-emerald-500 text-emerald-800 bg-emerald-50", ico: "text-emerald-500" },
  amber: { soft: "bg-amber-50 border-amber-200", head: "bg-amber-50 text-amber-800", text: "text-amber-700", bar: "bg-amber-500", chip: "border-amber-300 bg-amber-100 text-amber-800", tab: "border-amber-500 text-amber-800 bg-amber-50", ico: "text-amber-500" },
  rose: { soft: "bg-rose-50 border-rose-200", head: "bg-rose-50 text-rose-800", text: "text-rose-700", bar: "bg-rose-500", chip: "border-rose-300 bg-rose-100 text-rose-800", tab: "border-rose-500 text-rose-800 bg-rose-50", ico: "text-rose-500" },
  violet: { soft: "bg-violet-50 border-violet-200", head: "bg-violet-50 text-violet-800", text: "text-violet-700", bar: "bg-violet-500", chip: "border-violet-300 bg-violet-100 text-violet-800", tab: "border-violet-500 text-violet-800 bg-violet-50", ico: "text-violet-500" },
  slate: { head: "bg-slate-100 text-slate-700" },
};

export const STORE_TONE = { S1: "indigo", S2: "emerald", S3: "amber", GD: "violet" };

export const DEFAULT_RULES = { dTelat: 10000, dAlpa: 30000, dIzin: 15000, izinBebas: 1, dSakit: 15000, rFull: 150000, rNoLate: 50000, rKinerja: 300000, minHadir: 90, jamPerHari: 9 };

export const H2C_URL = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
