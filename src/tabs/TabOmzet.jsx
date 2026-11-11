import { STORES, TONE, STORE_TONE } from "../constants.js";
import { rp } from "../utils/format.js";
import { getRules } from "../lib/rules.js";
import { Field, MoneyIn } from "../components/ui.jsx";

export function TabOmzet({ db, setDb }) {
  const setSt = (k, f, v) => setDb((d) => ({ ...d, stores: { ...d.stores, [k]: { ...d.stores[k], [f]: v } } }));
  const checks = ["Omzet & Laba Stabil Menaik dari bulan sebelumnya", "Reputasi & Nilai Kepuasan Pelanggan Baik/Memuaskan", "Selisih Stok/Barang hilang maksimal Rp 2.000.000 dan menurun tiap bulan"];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {STORES.map((s) => {
        const d = db.stores[s.key];
        const all = d.c1 && d.c2 && d.c3;
        const kt = db.emps.filter((e) => e.store === s.key && e.jabatan === "Kepala Toko");
        return (
          <div key={s.key} className="space-y-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
            <div className={`-mx-4 -mt-4 mb-1 rounded-t-2xl px-4 py-3 text-base font-bold ${TONE[STORE_TONE[s.key]].head}`}>{s.label}</div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Omzet Bulan Ini"><MoneyIn value={d.omzet} onChange={(v) => setSt(s.key, "omzet", v)} /></Field>
              <Field label="Omzet Bulan Lalu"><MoneyIn value={d.omzetPrev} onChange={(v) => setSt(s.key, "omzetPrev", v)} /></Field>
              <Field label="Selisih Stok Opname"><MoneyIn value={d.selisih} onChange={(v) => setSt(s.key, "selisih", v)} /></Field>
              <Field label="Pengeluaran Lainnya"><MoneyIn value={d.lain} onChange={(v) => setSt(s.key, "lain", v)} /></Field>
            </div>
            <div className="text-sm text-slate-600">
              Omzet {d.omzet > d.omzetPrev ? "naik" : "belum naik"} dibanding bulan lalu • Selisih stok {d.selisih <= 2000000 ? "dalam batas" : "melebihi batas Rp 2.000.000"}
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="mb-2 text-base font-semibold text-amber-900">Syarat Bonus Kinerja Kepala Toko (+{rp(getRules(db.settings, s.key).rKinerja)})</div>
              {checks.map((t, i) => (
                <label key={i} className="flex items-start gap-2 py-1 text-base text-slate-700">
                  <input type="checkbox" className="mt-1" checked={d["c" + (i + 1)]} onChange={(e) => setSt(s.key, "c" + (i + 1), e.target.checked)} />{i + 1}) {t}
                </label>
              ))}
              <div className={`mt-2 rounded-md px-2 py-1 text-sm font-semibold ${all ? "bg-emerald-100 text-emerald-800" : "bg-white text-slate-600"}`}>
                {all ? (kt.length ? `Bonus ${rp(getRules(db.settings, s.key).rKinerja)} aktif untuk ${kt.map((k) => k.name).join(", ")}` : "Semua syarat terpenuhi, tetapi belum ada Kepala Toko di cabang ini") : "Belum semua syarat terpenuhi"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
