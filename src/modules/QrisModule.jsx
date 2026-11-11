import { useState } from "react";
import { CalendarDays, ArrowLeftRight, CalendarRange } from "lucide-react";
import { SubTabs } from "../components/SubTabs.jsx";
import { ListEditor } from "../components/ListEditor.jsx";
import { MiniMoney, StatCard } from "../components/ui.jsx";
import { rp, uid } from "../utils/format.js";
import { inMonth, qTotal, sumBy, ymd } from "../lib/finance.js";
import { MONTHS, pKey } from "../lib/periods.js";

const ITEMS = [
  { label: "Monitoring QRIS Shift Harian", icon: CalendarDays, tone: "sky" },
  { label: "Rekap Transfer ke Rekening Bos", icon: ArrowLeftRight, tone: "indigo" },
  { label: "Rekapitulasi QRIS Bulanan", icon: CalendarRange, tone: "emerald" },
];
const STORE_COLS = [["s1a", "s1b", "Store 1"], ["s2a", "s2b", "Store 2"], ["s3a", "s3b", "Store 3"]];

export function QrisModule({ root, setRoot }) {
  const [sub, setSub] = useState(0);
  const key = root.current;
  const year = key.slice(0, 4);
  const q = root.qris;
  const patch = (field, fn) => setRoot((r) => ({ ...r, qris: { ...r.qris, [field]: fn(r.qris[field]) } }));
  const edit = (field) => (id, k, v) => patch(field, (a) => a.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  const del = (field) => (id) => patch(field, (a) => a.filter((x) => x.id !== id));
  const editRow = edit("rows");
  const editTf = edit("transfers");

  const rows = q.rows.filter((r) => inMonth(r.date, key)).sort((a, b) => a.date.localeCompare(b.date));
  const tfs = q.transfers.filter((r) => inMonth(r.from, key)).sort((a, b) => a.from.localeCompare(b.from));
  const benar = rows.filter((r) => r.verif === "Benar");
  const tinjau = rows.filter((r) => r.verif !== "Benar" || r.ket === "blm kirm");

  const addDay = () => {
    let date = `${key}-01`;
    const last = rows[rows.length - 1];
    if (last) {
      const d = new Date(last.date + "T00:00:00");
      d.setDate(d.getDate() + 1);
      date = inMonth(ymd(d), key) ? ymd(d) : last.date;
    }
    patch("rows", (a) => [...a, { id: uid(), date, s1a: 0, s1b: 0, s2a: 0, s2b: 0, s3a: 0, s3b: 0, verif: "Belum", ket: "blm kirm" }]);
  };
  const addTf = () => patch("transfers", (a) => [...a, { id: uid(), from: `${key}-01`, to: `${key}-01`, total: 0, transfer: 0, ket: "" }]);
  const sumRange = (r) => sumBy(q.rows.filter((x) => x.date >= r.from && x.date <= r.to), qTotal);

  const harianCols = [
    { label: "Tanggal", key: "date", type: "date" },
    ...STORE_COLS.map(([a, b, n]) => ({
      label: `${n} (Shift 1 & Shift 2)`,
      render: (r) => <div className="flex gap-1.5"><MiniMoney value={r[a]} onChange={(v) => editRow(r.id, a, v)} /><MiniMoney value={r[b]} onChange={(v) => editRow(r.id, b, v)} /></div>,
    })),
    { label: "Verifikasi", key: "verif", type: "select", options: ["Benar", "Belum"] },
    { label: "Total Harian", render: (r) => <b className="whitespace-nowrap text-indigo-700">{rp(qTotal(r))}</b> },
    {
      label: "Keterangan",
      render: (r) => (
        <select value={r.ket} onChange={(e) => editRow(r.id, "ket", e.target.value)}
          className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${r.ket === "Sended" ? "border-sky-200 bg-sky-100 text-sky-800" : "border-rose-200 bg-rose-100 text-rose-800"}`}>
          <option>Sended</option><option>blm kirm</option>
        </select>
      ),
    },
  ];
  const tfCols = [
    { label: "Dari Tanggal", key: "from", type: "date" },
    { label: "Sampai Tanggal", key: "to", type: "date" },
    {
      label: "Total QRIS",
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <MiniMoney value={r.total} onChange={(v) => editTf(r.id, "total", v)} />
          <button title="Isi dari total tabel harian pada rentang tanggal ini" onClick={() => editTf(r.id, "total", sumRange(r))} className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm font-bold text-slate-600 hover:bg-slate-50">Σ</button>
        </div>
      ),
    },
    { label: "Nominal Transfer", key: "transfer", type: "money" },
    { label: "Selisih", render: (r) => { const s = r.total - r.transfer; return <b className={`whitespace-nowrap ${s ? "text-amber-700" : "text-emerald-700"}`}>{rp(s)}</b>; } },
    { label: "Keterangan Pemakaian", key: "ket", w: "w-64" },
  ];
  const monthRows = MONTHS.map((n, i) => {
    const mk = pKey(year, i + 1);
    const part = q.rows.filter((r) => inMonth(r.date, mk));
    const s = (a, b) => sumBy(part, (r) => (+r[a] || 0) + (+r[b] || 0));
    const v = { s1: s("s1a", "s1b"), s2: s("s2a", "s2b"), s3: s("s3a", "s3b") };
    return { id: mk, name: `${n} ${year}`, ...v, total: v.s1 + v.s2 + v.s3 };
  });
  const T = (f) => sumBy(monthRows, (r) => r[f]);
  const bulanCols = [
    { label: "Bulan", render: (r) => <b className="text-slate-800">{r.name}</b> },
    { label: "Store 1", render: (r) => rp(r.s1) },
    { label: "Store 2", render: (r) => rp(r.s2) },
    { label: "Store 3", render: (r) => rp(r.s3) },
    { label: "Total QRIS", render: (r) => <b className="text-indigo-700">{rp(r.total)}</b> },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <StatCard tone="indigo" label="TOTAL QRIS MASUK" value={rp(sumBy(rows, qTotal))} sub={`${rows.length} hari tercatat bulan ini`} />
        <StatCard tone="emerald" label="TRANSAKSI BENAR" value={rp(sumBy(benar, qTotal))} sub={`${benar.length} hari terverifikasi`} />
        <StatCard tone="amber" label="PERLU TINJAUAN (SALAH / BLM KIRIM)" value={rp(sumBy(tinjau, qTotal))} sub={`${tinjau.length} hari perlu dicek`} />
      </div>
      <SubTabs items={ITEMS} value={sub} onChange={setSub} />
      {sub === 0 && (
        <ListEditor title="Monitoring QRIS Shift Harian" tone="sky" cols={harianCols} rows={rows} onChange={editRow} onAdd={addDay} onDel={del("rows")} addLabel="Tambah Hari"
          empty="Belum ada data QRIS di bulan ini. Klik Tambah Hari."
          rowStyle={(r) => (r.ket === "blm kirm" ? { backgroundColor: "rgba(245,158,11,.16)" } : r.verif === "Benar" ? { backgroundColor: "rgba(16,185,129,.08)" } : undefined)} />
      )}
      {sub === 1 && <ListEditor title="Rekap Transfer ke Rekening Bos" tone="indigo" cols={tfCols} rows={tfs} onChange={editTf} onAdd={addTf} onDel={del("transfers")} addLabel="Tambah Transfer" empty="Belum ada transfer di bulan ini." />}
      {sub === 2 && (
        <ListEditor title={`Rekapitulasi QRIS Bulanan ${year}`} tone="emerald" cols={bulanCols} rows={monthRows}
          foot={<tfoot><tr className="border-t-2 border-slate-300 bg-slate-100 font-bold"><td className="px-3 py-3">TOTAL {year}</td><td className="px-3 py-3">{rp(T("s1"))}</td><td className="px-3 py-3">{rp(T("s2"))}</td><td className="px-3 py-3">{rp(T("s3"))}</td><td className="px-3 py-3 text-indigo-700">{rp(T("total"))}</td></tr></tfoot>} />
      )}
    </div>
  );
}
