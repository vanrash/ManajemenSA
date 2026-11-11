import { StatCard } from "../components/ui.jsx";
import { TabRekap } from "../tabs/TabRekap.jsx";
import { rp } from "../utils/format.js";
import { labaRugi } from "../lib/finance.js";

export function LabaRugiModule({ root, db, setDb }) {
  const L = labaRugi(root, db);
  const Row = ({ l, v, cls = "text-slate-800" }) => <div className="flex justify-between gap-3 py-1.5 text-base"><span className="text-slate-600">{l}</span><span className={`font-semibold ${cls}`}>{rp(v)}</span></div>;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <StatCard tone="indigo" label="Total Pemasukan" value={rp(L.pemasukan)} sub="QRIS + Kas Masuk" />
        <StatCard tone="rose" label="Total Pengeluaran" value={rp(L.pengeluaran)} sub="Gaji + Kas Keluar + Belanja Gudang" />
        <StatCard tone="amber" label="Estimasi Pajak" value={rp(L.pajak)} sub={`${db.pajakRate}% dari pemasukan`} />
        <StatCard tone={L.labaBersih >= 0 ? "emerald" : "rose"} label="Laba Bersih CV. Sumber Agung" value={rp(L.labaBersih)} sub={db.settings.periode} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm">
          <div className="mb-2 rounded-xl bg-emerald-50 px-3 py-2 font-bold text-emerald-800">Pemasukan • {db.settings.periode}</div>
          <Row l="Pendataan QRIS" v={L.qris} cls="text-emerald-700" /><Row l="Kas Masuk (tunai non-QRIS)" v={L.kasMasuk} cls="text-emerald-700" /><Row l="Total Pemasukan" v={L.pemasukan} cls="text-indigo-700" />
        </div>
        <div className="rounded-2xl border border-rose-200 bg-white p-4 shadow-sm">
          <div className="mb-2 rounded-xl bg-rose-50 px-3 py-2 font-bold text-rose-800">Pengeluaran • {db.settings.periode}</div>
          <Row l="Gaji Karyawan (Payroll)" v={L.gaji} cls="text-rose-600" /><Row l="Kas Keluar Operasional" v={L.kasKeluar} cls="text-rose-600" /><Row l="Belanja Stok Gudang" v={L.belanja} cls="text-rose-600" /><Row l="Total Pengeluaran" v={L.pengeluaran} cls="text-indigo-700" />
        </div>
      </div>
      <h3 className="pt-2 text-xl font-bold text-slate-800">Rincian per Cabang: Omzet, Beban Gaji & Pajak</h3>
      <TabRekap db={db} setDb={setDb} />
    </div>
  );
}
