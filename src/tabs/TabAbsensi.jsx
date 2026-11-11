import { useState, useEffect, useMemo } from "react";
import { Clock, Calculator } from "lucide-react";
import { STORES, TONE } from "../constants.js";
import { parseLog } from "../lib/attendance.js";
import { Field, inp, Btn } from "../components/ui.jsx";

export function TabAbsensi({ db, setDb, store }) {
  const { cal, telatPas } = db.settings;
  const [empId, setEmpId] = useState("");
  const [text, setText] = useState("");
  const [info, setInfo] = useState("");
  useEffect(() => { setEmpId(""); setInfo(""); }, [store]);
  const emp = db.emps.find((e) => e.id === empId);
  const log = useMemo(() => parseLog(text, telatPas), [text, telatPas]);
  const masuk = Math.min(log.length, cal);
  const kosong = Math.max(cal - masuk, 0);
  const liburGaji = 0;
  const hariDigaji = Math.min(cal, masuk + liburGaji);
  const telatList = log.filter((l) => l.late);
  const apply = () => {
    if (!emp) return setInfo("Pilih karyawan terlebih dahulu.");
    setDb((d) => ({ ...d, emps: d.emps.map((e) => (e.id === empId ? { ...e, absenDiisi: true, hariMasuk: masuk, hariDigaji, telat: telatList.length, telatNote: telatList.map((t) => t.label).join(", ") } : e)) }));
    setInfo(`Tersimpan: ${emp.name} → ${hariDigaji} hari digaji, telat ${telatList.length}x. Cek di Tab Payroll.`);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800"><Clock size={16} />Input Log Mesin Absensi</h3>
        <Field label={`Karyawan • ${STORES.find((s) => s.key === store).label}`}>
          <select className={inp} value={empId} onChange={(e) => setEmpId(e.target.value)}>
            <option value="">— Pilih karyawan —</option>
            {db.emps.filter((e) => e.store === store).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </Field>
        <Field label="Jam masuk harian (HH:MM, pisahkan koma/spasi/baris)">
          <textarea rows={6} className={inp} placeholder="06:55, 10:54, 07:02, 12:05" value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 text-base text-slate-700">
          <input type="checkbox" checked={telatPas} onChange={(e) => setDb((d) => ({ ...d, settings: { ...d.settings, telatPas: e.target.checked } }))} />
          Jam 07:00 pas dihitung telat (matikan jika masih aman)
        </label>
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">Sebelum 10:00 = Shift Pagi (telat mulai 07:00). Mulai 10:00 = Shift Siang (telat mulai 12:00).</div>
        <Btn tone="indigo" className="w-full" onClick={apply}><Calculator size={15} />Terapkan Hasil ke Data Gaji Karyawan</Btn>
        {info && <div className="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-800">{info}</div>}
      </div>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <h3 className="font-semibold text-slate-800">Hasil Perhitungan</h3>
        <div className="grid grid-cols-2 gap-2">
          {[["Hari Masuk", masuk, "text-emerald-700"], ["Telat", telatList.length + "x", "text-rose-600"], ["Hari Kosong", kosong, "text-slate-600"], ["Total Hari Digaji", `${hariDigaji}/${cal}`, "text-indigo-700"]].map(([l, v, cl], ci) => {
            const T = TONE[["emerald", "rose", "slate", "indigo"][ci]] || {};
            const soft = ["bg-emerald-50 border-emerald-200", "bg-rose-50 border-rose-200", "bg-slate-100 border-slate-200", "bg-indigo-50 border-indigo-200"][ci];
            return <div key={l} className={`rounded-xl border p-3 ${soft}`}><div className="text-sm font-semibold text-slate-700">{l}</div><div className={`text-2xl font-bold ${cl}`}>{v}</div></div>;
          })}
        </div>
        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200">
          {log.length === 0 && <div className="p-6 text-center text-base text-slate-600">Tempel jam masuk di kolom kiri untuk melihat deteksi shift.</div>}
          {log.map((l, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-100 px-3 py-1.5 text-base">
              <span>Hari {i + 1} • <b>{l.label}</b></span>
              <span className="flex gap-1.5">
                <span className="rounded-full bg-slate-100 px-2 text-sm text-slate-600">Shift {l.shift}</span>
                <span className={`rounded-full px-2 text-sm font-semibold ${l.late ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{l.late ? "TELAT" : "Tepat waktu"}</span>
              </span>
            </div>
          ))}
        </div>
        {log.length > cal && <div className="text-sm text-amber-700">Log melebihi {cal} hari; hanya {cal} hari dihitung.</div>}
      </div>
    </div>
  );
}
