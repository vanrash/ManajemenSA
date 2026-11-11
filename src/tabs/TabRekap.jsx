import { STORES, TONE, STORE_TONE } from "../constants.js";
import { rp } from "../utils/format.js";
import { calc } from "../lib/payroll.js";
import { Field, NumIn } from "../components/ui.jsx";

export function TabRekap({ db, setDb }) {
  const rows = STORES.map((s) => {
    const beban = db.emps.filter((e) => e.store === s.key).reduce((a, e) => a + calc(e, db).net, 0);
    const d = db.stores[s.key];
    return { s, omzet: d.omzet, beban, lain: d.lain, laba: d.omzet - beban - d.lain };
  });
  const T = rows.reduce((a, r) => ({ omzet: a.omzet + r.omzet, beban: a.beban + r.beban, lain: a.lain + r.lain, laba: a.laba + r.laba }), { omzet: 0, beban: 0, lain: 0, laba: 0 });
  const max = Math.max(1, ...rows.flatMap((r) => [r.omzet, r.beban, r.lain]));
  const pajak = Math.round((T.omzet * db.pajakRate) / 100);
  const Bar = ({ v, cl }) => <div className="flex items-center gap-2"><div className={`h-3 rounded ${cl}`} style={{ width: `${Math.max((v / max) * 100, v ? 2 : 0)}%` }} /><span className="text-sm text-slate-600">{rp(v)}</span></div>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Total Omzet", T.omzet, "text-slate-800"], ["Total Beban Gaji", T.beban, "text-rose-600"], ["Pengeluaran Lainnya", T.lain, "text-amber-600"], ["Estimasi Laba Bersih", T.laba - pajak, T.laba - pajak >= 0 ? "text-emerald-600" : "text-rose-600"]].map(([l, v, cl], ci) => {
          const T = TONE[["indigo", "rose", "amber", "emerald"][ci]];
          return <div key={l} className={`rounded-2xl border p-4 shadow-sm ${T.soft}`}><div className={`text-sm font-semibold ${T.text}`}>{l}</div><div className={`mt-1 text-2xl font-bold ${cl}`}>{rp(v)}</div></div>;
        })}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <h3 className="mb-3 font-semibold text-slate-800">Omzet vs Beban Gaji vs Pengeluaran Lainnya</h3>
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.s.key}><div className="mb-1 flex items-center gap-2 text-base font-semibold text-slate-700"><span className={`h-3 w-3 rounded-full ${TONE[STORE_TONE[r.s.key]].bar}`} />{r.s.label}</div>
              <div className="space-y-1"><Bar v={r.omzet} cl="bg-indigo-500" /><Bar v={r.beban} cl="bg-rose-500" /><Bar v={r.lain} cl="bg-amber-500" /></div></div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-sm text-slate-600"><span><i className="mr-1 inline-block h-2 w-2 rounded bg-indigo-500" />Omzet</span><span><i className="mr-1 inline-block h-2 w-2 rounded bg-rose-500" />Beban Gaji</span><span><i className="mr-1 inline-block h-2 w-2 rounded bg-amber-500" />Lainnya</span></div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[600px] text-base">
          <thead className="bg-slate-50 text-left text-sm text-slate-600"><tr>{["Cabang", "Omzet", "Beban Gaji", "Lainnya", "Laba Sebelum Pajak"].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r.s.key} className="border-t border-slate-100"><td className="px-4 py-3 font-medium">{r.s.label}</td><td className="px-4 py-3">{rp(r.omzet)}</td><td className="px-4 py-3 text-rose-600">{rp(r.beban)}</td><td className="px-4 py-3">{rp(r.lain)}</td><td className={`px-4 py-3 font-semibold ${r.laba < 0 ? "text-rose-600" : "text-emerald-600"}`}>{rp(r.laba)}</td></tr>)}
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold"><td className="px-4 py-3">TOTAL CV</td><td className="px-4 py-3">{rp(T.omzet)}</td><td className="px-4 py-3">{rp(T.beban)}</td><td className="px-4 py-3">{rp(T.lain)}</td><td className="px-4 py-3">{rp(T.laba)}</td></tr>
          </tbody>
        </table>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <h3 className="mb-2 font-semibold text-slate-800">Ringkasan Pajak CV (Estimasi)</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Tarif pajak atas omzet (%)"><NumIn value={db.pajakRate} step="0.1" onChange={(v) => setDb((d) => ({ ...d, pajakRate: v }))} /></Field>
          <div className="rounded-lg bg-slate-50 p-3"><div className="text-sm text-slate-600">Estimasi Pajak</div><div className="text-xl font-bold text-rose-600">{rp(pajak)}</div></div>
          <div className="rounded-lg bg-slate-50 p-3"><div className="text-sm text-slate-600">Laba Bersih Setelah Pajak</div><div className="text-xl font-bold text-emerald-600">{rp(T.laba - pajak)}</div></div>
        </div>
        <p className="mt-2 text-sm text-slate-600">Tarif bawaan 0,5% dari omzet (skema PPh final UMKM). Ini hanya estimasi; sesuaikan tarif dan konfirmasi ke konsultan pajak sebelum pelaporan.</p>
      </div>
    </div>
  );
}
