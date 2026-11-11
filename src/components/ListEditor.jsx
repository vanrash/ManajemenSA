import { Plus, Trash2 } from "lucide-react";
import { Btn, MiniMoney } from "./ui.jsx";
import { TONE } from "../constants.js";

const base = "rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none";

// Tabel isian serbaguna. Kolom: { label, key, type: "text|date|money|select", options, render(row) }.
export function ListEditor({ title, cols, rows, onChange, onAdd, onDel, addLabel = "Tambah Baris", empty = "Belum ada data. Klik tombol tambah.", rowStyle, foot, tone = "indigo" }) {
  const cell = (c, r) => {
    if (c.render) return c.render(r);
    const set = (v) => onChange(r.id, c.key, v);
    if (c.type === "money") return <MiniMoney value={r[c.key]} onChange={set} />;
    if (c.type === "select") return <select className={base} value={r[c.key]} onChange={(e) => set(e.target.value)}>{c.options.map((o) => <option key={o}>{o}</option>)}</select>;
    return <input type={c.type || "text"} className={base + " " + (c.w || "")} value={r[c.key] ?? ""} onChange={(e) => set(e.target.value)} />;
  };
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {onAdd && <Btn tone="indigo" onClick={onAdd}><Plus size={15} />{addLabel}</Btn>}
      </div>
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr>
            {cols.map((c) => <th key={c.label} className={`px-3 py-3 text-left font-semibold ${TONE[c.tone || tone].head}`}>{c.label}</th>)}
            {onDel && <th className={`px-3 py-3 ${TONE[tone].head}`} />}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={cols.length + 1} className="p-8 text-center text-slate-600">{empty}</td></tr>}
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-slate-100" style={rowStyle ? rowStyle(r) : undefined}>
              {cols.map((c) => <td key={c.label} className="px-3 py-2 align-middle">{cell(c, r)}</td>)}
              {onDel && <td className="px-3 py-2"><Btn tone="rose" onClick={() => onDel(r.id)}><Trash2 size={14} /></Btn></td>}
            </tr>
          ))}
        </tbody>
        {foot}
      </table>
    </div>
  );
}
