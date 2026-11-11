import { useState } from "react";
import { Banknote, PackageSearch } from "lucide-react";
import { SubTabs } from "../components/SubTabs.jsx";
import { ListEditor } from "../components/ListEditor.jsx";
import { Field, StatCard, inp } from "../components/ui.jsx";
import { rp, uid, num } from "../utils/format.js";
import { inMonth, sumBy } from "../lib/finance.js";

const ITEMS = [
  { label: "Uang Masuk & Keluar Operasional", icon: Banknote, tone: "amber" },
  { label: "Belanja Stok & Opname Gudang", icon: PackageSearch, tone: "violet" },
];
const LOKASI = ["Gudang", "Store 1", "Store 2", "Store 3"];
const KATEGORI = ["Penjualan Tunai", "Listrik", "Kemasan", "Bensin / Logistik", "Makan", "Gaji Harian", "Lainnya"];

export function KasModule({ root, setRoot }) {
  const [sub, setSub] = useState(0);
  const [lok, setLok] = useState("Semua");
  const key = root.current;
  const patch = (field, fn) => setRoot((r) => ({ ...r, kas: { ...r.kas, [field]: fn(r.kas[field]) } }));
  const edit = (field) => (id, k, v) => patch(field, (a) => a.map((x) => (x.id === id ? { ...x, [k]: v } : x)));
  const del = (field) => (id) => patch(field, (a) => a.filter((x) => x.id !== id));
  const add = (field, row) => () => patch(field, (a) => [...a, { id: uid(), date: `${key}-01`, ...row }]);
  const month = (arr) => arr.filter((x) => inMonth(x.date, key)).sort((a, b) => a.date.localeCompare(b.date));

  const kasAll = root.kas.rows.filter((r) => (lok === "Semua" || r.lokasi === lok));
  const kas = month(kasAll);
  const masuk = sumBy(kas.filter((r) => r.jenis === "Masuk"), (r) => num(r.nominal));
  const keluar = sumBy(kas.filter((r) => r.jenis === "Keluar"), (r) => num(r.nominal));
  const saldo = sumBy(kasAll.filter((r) => r.date <= `${key}-31`), (r) => (r.jenis === "Masuk" ? 1 : -1) * num(r.nominal));
  const belanja = month(root.kas.belanja);
  const opname = month(root.kas.opname);

  const kasCols = [
    { label: "Tanggal", key: "date", type: "date" },
    { label: "Lokasi", key: "lokasi", type: "select", options: LOKASI },
    { label: "Jenis", key: "jenis", type: "select", options: ["Masuk", "Keluar"] },
    { label: "Kategori", key: "kategori", type: "select", options: KATEGORI },
    { label: "Keterangan", key: "ket", w: "w-56" },
    { label: "Nominal", key: "nominal", type: "money" },
  ];
  const belanjaCols = [
    { label: "Tanggal", key: "date", type: "date" },
    { label: "Supplier", key: "supplier", w: "w-44" },
    { label: "Barang / No. Nota", key: "ket", w: "w-56" },
    { label: "Nominal", key: "nominal", type: "money" },
    { label: "Status", key: "status", type: "select", options: ["Lunas", "Hutang"] },
  ];
  const opnameCols = [
    { label: "Tanggal", key: "date", type: "date" },
    { label: "Lokasi", key: "lokasi", type: "select", options: LOKASI },
    { label: "Barang", key: "barang", w: "w-44" },
    { label: "Jenis", key: "jenis", type: "select", options: ["Hilang", "Rusak", "Selisih"] },
    { label: "Nilai Selisih", key: "nominal", type: "money" },
    { label: "Keterangan", key: "ket", w: "w-56" },
  ];
  const tint = (r) => ({ backgroundColor: r.jenis === "Masuk" ? "rgba(16,185,129,.08)" : "rgba(244,63,94,.07)" });

  return (
    <div className="space-y-4">
      <SubTabs items={ITEMS} value={sub} onChange={setSub} />
      {sub === 0 && (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <StatCard tone="emerald" label="Kas Masuk Bulan Ini" value={rp(masuk)} />
            <StatCard tone="rose" label="Kas Keluar Bulan Ini" value={rp(keluar)} />
            <StatCard tone="indigo" label="Saldo Kas Aktif" value={rp(saldo)} sub="Akumulasi sampai akhir bulan ini" />
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><Field label="Filter Lokasi"><select className={inp} value={lok} onChange={(e) => setLok(e.target.value)}><option>Semua</option>{LOKASI.map((l) => <option key={l}>{l}</option>)}</select></Field></div>
          </div>
          <ListEditor title="Uang Masuk & Keluar Operasional" tone="amber" cols={kasCols} rows={kas} onChange={edit("rows")} onDel={del("rows")} rowStyle={tint}
            onAdd={add("rows", { lokasi: lok === "Semua" ? "Gudang" : lok, jenis: "Keluar", kategori: "Lainnya", ket: "", nominal: 0 })} addLabel="Tambah Catatan Kas" empty="Belum ada catatan kas di bulan ini." />
        </>
      )}
      {sub === 1 && (
        <>
          <ListEditor title="Belanja Stok ke Supplier" tone="violet" cols={belanjaCols} rows={belanja} onChange={edit("belanja")} onDel={del("belanja")}
            onAdd={add("belanja", { supplier: "", ket: "", nominal: 0, status: "Lunas" })} addLabel="Tambah Nota Belanja" empty="Belum ada nota belanja di bulan ini."
            foot={<tfoot><tr className="border-t-2 border-slate-300 bg-slate-100 font-bold"><td className="px-3 py-3" colSpan={3}>TOTAL BELANJA BULAN INI</td><td className="px-3 py-3" colSpan={3}>{rp(sumBy(belanja, (r) => num(r.nominal)))}</td></tr></tfoot>} />
          <ListEditor title="Opname: Selisih Stok Hilang / Rusak per Lokasi" tone="rose" cols={opnameCols} rows={opname} onChange={edit("opname")} onDel={del("opname")}
            onAdd={add("opname", { lokasi: "Gudang", barang: "", jenis: "Hilang", nominal: 0, ket: "" })} addLabel="Tambah Catatan Opname" empty="Belum ada catatan opname di bulan ini."
            foot={<tfoot><tr className="border-t-2 border-slate-300 bg-slate-100 font-bold"><td className="px-3 py-3" colSpan={7}>{LOKASI.map((l) => `${l}: ${rp(sumBy(opname.filter((r) => r.lokasi === l), (r) => num(r.nominal)))}`).join("   •   ")}</td></tr></tfoot>} />
        </>
      )}
    </div>
  );
}
