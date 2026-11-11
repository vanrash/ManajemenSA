import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { STORES } from "../constants.js";
import { rp, num, uid } from "../utils/format.js";
import { Field, inp, MoneyIn, Btn } from "../components/ui.jsx";

export function TabKasbon({ db, setDb, store }) {
  const list = db.emps.filter((e) => e.store === store);
  const blank = { empId: list[0]?.id || "", jenis: "Kasbon", ket: "", nominal: 0, status: "Potong Gaji Bulan Ini" };
  const [f, setF] = useState(blank);
  useEffect(() => { setF((x) => ({ ...x, empId: list[0]?.id || "" })); }, [store]);
  const add = () => {
    if (!f.empId || !f.nominal) return;
    setDb((d) => ({ ...d, kasbon: [...d.kasbon, { ...f, id: uid() }] }));
    setF({ ...blank, empId: f.empId });
  };
  const upd = (id, k, v) => setDb((d) => ({ ...d, kasbon: d.kasbon.map((x) => (x.id === id ? { ...x, [k]: v } : x)) }));
  const shown = db.kasbon.filter((k) => list.some((e) => e.id === k.empId));
  const total = shown.filter((k) => k.status === "Potong Gaji Bulan Ini").reduce((a, k) => a + num(k.nominal), 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4 md:grid-cols-5">
        <Field label={`Karyawan • ${STORES.find((x) => x.key === store).label}`}><select className={inp} value={f.empId} onChange={(e) => setF({ ...f, empId: e.target.value })}>{list.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></Field>
        <Field label="Jenis"><select className={inp} value={f.jenis} onChange={(e) => setF({ ...f, jenis: e.target.value })}><option>Kasbon</option><option>Barang Hilang</option></select></Field>
        <Field label="Keterangan"><input className={inp} value={f.ket} onChange={(e) => setF({ ...f, ket: e.target.value })} /></Field>
        <Field label="Nominal (Rp)"><MoneyIn value={f.nominal} onChange={(v) => setF({ ...f, nominal: v })} /></Field>
        <Field label="Status"><select className={inp} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option>Potong Gaji Bulan Ini</option><option>Ditunda</option><option>Lunas</option></select></Field>
        <div className="md:col-span-5"><Btn tone="indigo" onClick={add}><Plus size={15} />Catat</Btn></div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex justify-between border-b border-slate-200 px-4 py-3"><h3 className="font-semibold text-slate-800">Catatan Kasbon & Potongan • {STORES.find((x) => x.key === store).label}</h3><span className="text-base font-semibold text-rose-600">Memotong gaji bulan ini: {rp(total)}</span></div>
        <table className="w-full min-w-[700px] text-base">
          <thead className="bg-slate-50 text-left text-sm text-slate-600"><tr>{["Karyawan", "Jenis", "Keterangan", "Nominal", "Status", ""].map((h) => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-600">Belum ada catatan. Isi formulir di atas untuk menambah kasbon atau klaim barang hilang.</td></tr>}
            {shown.map((k) => (
              <tr key={k.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{db.emps.find((e) => e.id === k.empId)?.name || "(dihapus)"}</td>
                <td className="px-4 py-3">{k.jenis}</td><td className="px-4 py-3">{k.ket || "-"}</td>
                <td className="px-4 py-3 font-medium text-rose-600">{rp(k.nominal)}</td>
                <td className="px-4 py-3"><select className={inp} value={k.status} onChange={(e) => upd(k.id, "status", e.target.value)}><option>Potong Gaji Bulan Ini</option><option>Ditunda</option><option>Lunas</option></select></td>
                <td className="px-4 py-3"><Btn tone="rose" onClick={() => setDb((d) => ({ ...d, kasbon: d.kasbon.filter((x) => x.id !== k.id) }))}><Trash2 size={14} /></Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
