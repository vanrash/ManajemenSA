import { TONE } from "../constants.js";
import { useState } from "react";
import { X } from "lucide-react";
import { num } from "../utils/format.js";

export const Field = ({ label, children }) => (
  <label className="block text-base font-semibold text-slate-700">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);

export const inp = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100";

export const NumIn = ({ value, onChange, step, min, max, ...p }) => {
  const dec = !!step && String(step).includes(".");
  const [txt, setTxt] = useState(null);
  const handle = (e) => {
    let t = e.target.value.replace(dec ? /[^\d.,]/g : /\D/g, "").replace(",", ".");
    if (dec) { const a = t.split("."); t = a[0] + (a.length > 1 ? "." + a.slice(1).join("") : ""); }
    t = t.replace(/^0+(?=\d)/, "");
    let n = num(t === "" || t === "." ? 0 : t);
    if (max !== undefined && n > max) { n = max; t = String(max); }
    setTxt(t);
    onChange(n);
  };
  return <input type="text" inputMode={dec ? "decimal" : "numeric"} className={inp} value={txt !== null ? txt : String(value)} onFocus={(e) => e.target.select()} onBlur={() => setTxt(null)} onChange={handle} {...p} />;
};

export const MoneyIn = ({ value, onChange, ...p }) => (
  <div className="relative">
    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-slate-600">Rp</span>
    <input type="text" inputMode="numeric" onFocus={(e) => e.target.select()} className={inp + " pl-9"} placeholder="0" value={value ? Number(value).toLocaleString("id-ID") : ""} onChange={(e) => onChange(num(e.target.value.replace(/\D/g, "")))} {...p} />
  </div>
);

export const Btn = ({ children, onClick, tone = "slate", className = "", ...p }) => {
  const tones = {
    slate: "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
    indigo: "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600",
    emerald: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600",
    rose: "bg-white text-rose-600 border-rose-200 hover:bg-rose-50",
    sky: "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100",
    amber: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100",
  };
  return (
    <button onClick={onClick} className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-base font-semibold transition-colors ${tones[tone]} ${className}`} {...p}>
      {children}
    </button>
  );
};

export const Modal = ({ title, onClose, children, wide }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4">
    <div className={`my-6 w-full rounded-2xl bg-white shadow-xl ${wide ? "max-w-2xl" : "max-w-md"}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <button onClick={onClose} className="rounded p-1 text-slate-600 hover:bg-slate-100"><X size={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

export const ConfirmModal = ({ text, yes = "Ya, hapus", onYes, onNo }) => (
  <Modal title="Konfirmasi" onClose={onNo}>
    <p className="text-base text-slate-700">{text}</p>
    <div className="mt-5 flex justify-end gap-2"><Btn onClick={onNo}>Batal</Btn><Btn tone="rose" onClick={onYes}>{yes}</Btn></div>
  </Modal>
);

export const MiniMoney = ({ value, onChange, ...p }) => (
  <input type="text" inputMode="numeric" onFocus={(e) => e.target.select()} placeholder="0"
    className="w-28 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-right text-sm text-slate-800 focus:border-indigo-400 focus:outline-none"
    value={value ? Number(value).toLocaleString("id-ID") : ""} onChange={(e) => onChange(num(e.target.value.replace(/\D/g, "")))} {...p} />
);

export const StatCard = ({ tone, label, value, sub }) => (
  <div className={`rounded-2xl border p-4 shadow-sm ${TONE[tone].soft}`}>
    <div className={`text-sm font-semibold ${TONE[tone].text}`}>{label}</div>
    <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
    {sub && <div className="text-sm text-slate-600">{sub}</div>}
  </div>
);
