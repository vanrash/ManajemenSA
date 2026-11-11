import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { MONTHS, pKey, pLabel, daysIn, buildPeriod } from "../lib/periods.js";
import { Field, inp, Btn, ConfirmModal } from "./ui.jsx";

export function PeriodBar({ root, setRoot, onMissing }) {
  const [cy, cm] = root.current.split("-").map(Number);
  const [y, setY] = useState(cy);
  const [m, setM] = useState(cm);
  const [ask, setAsk] = useState(false);
  useEffect(() => { setY(cy); setM(cm); }, [root.current]);
  const keys = Object.keys(root.periods).sort();
  const key = pKey(y, m);
  const exists = !!root.periods[key];
  useEffect(() => { onMissing(!exists); }, [exists]);
  const yrs = keys.map((k) => +k.split("-")[0]);
  const minY = Math.min(...yrs), maxY = Math.max(...yrs);
  const years = Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i);
  const go = (ny, nm) => { setY(ny); setM(nm); const k = pKey(ny, nm); if (root.periods[k]) setRoot((r) => ({ ...r, current: k })); };
  const create = (k) => setRoot((r) => {
    if (r.periods[k]) return { ...r, current: k };
    const ks = Object.keys(r.periods).sort();
    const before = ks.filter((x) => x < k);
    const src = r.periods[before.length ? before[before.length - 1] : ks[0]];
    return { ...r, current: k, periods: { ...r.periods, [k]: buildPeriod(src, k) } };
  });
  const move = (k) => setRoot((r) => {
    const old = r.periods[r.current];
    const [ny, nm] = k.split("-").map(Number);
    const cal = daysIn(ny, nm);
    const moved = { ...old, settings: { ...old.settings, periode: pLabel(k), cal }, emps: old.emps.map((e) => ({ ...e, hariDigaji: Math.min(e.hariDigaji, cal) })) };
    const periods = { ...r.periods };
    delete periods[r.current];
    periods[k] = moved;
    return { current: k, periods };
  });
  const del = () => {
    if (keys.length < 2) return;
    setAsk(false);
    setRoot((r) => { const periods = { ...r.periods }; delete periods[r.current]; const rest = Object.keys(periods).sort(); return { current: rest[rest.length - 1], periods }; });
  };
  const isOld = root.current < keys[keys.length - 1];
  return (
    <div className="mb-4 space-y-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Bulan"><select className={inp} value={m} onChange={(e) => go(y, +e.target.value)}>{MONTHS.map((n, i) => <option key={n} value={i + 1}>{n}{root.periods[pKey(y, i + 1)] ? " ✓" : ""}</option>)}</select></Field>
        <Field label="Tahun"><select className={inp} value={y} onChange={(e) => go(+e.target.value, m)}>{years.map((v) => <option key={v} value={v}>{v}</option>)}</select></Field>
        <Btn tone="indigo" onClick={() => create(pKey(maxY + 1, 1))}><Plus size={15} />Buat Tahun Berikutnya ({maxY + 1})</Btn>
        <Btn tone="rose" onClick={() => setAsk(true)} disabled={keys.length < 2} className="disabled:cursor-not-allowed disabled:opacity-40" title={keys.length < 2 ? "Aktif setelah ada minimal 2 periode" : ""}><Trash2 size={15} />Hapus Periode Ini</Btn>
      </div>
      {!exists && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-base text-amber-900">
          <span>Periode {pLabel(key)} belum dibuat, jadi datanya belum ditampilkan. Buat periodenya (data karyawan disalin dari periode terdekat sebelumnya; absensi, bonus, dan omzet dikosongkan), atau pindahkan data {pLabel(root.current)} ke bulan ini.</span>
          <Btn tone="emerald" onClick={() => create(key)}><Plus size={15} />Buat Periode {pLabel(key)}</Btn>
          <Btn onClick={() => move(key)}>Pindahkan data {pLabel(root.current)} ke {pLabel(key)}</Btn>
        </div>
      )}
      <div className="text-sm text-slate-600">Tanda ✓ pada bulan = periode sudah dibuat di tahun yang dipilih.</div>
      {keys.length < 2 && <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Tombol Hapus Periode nonaktif karena baru ada 1 periode (supaya data tidak habis). Kalau periode ini salah bulan, pilih bulan yang benar di dropdown lalu klik "Pindahkan data ...". Kalau mau menghapus, buat periode lain dulu.</div>}
      {ask && <ConfirmModal text={`Hapus seluruh data periode ${pLabel(root.current)}? Tindakan ini tidak bisa dibatalkan.`} onYes={del} onNo={() => setAsk(false)} />}
      {isOld && <div className="text-sm text-slate-600">Anda sedang melihat periode lampau. Perubahan yang Anda buat hanya tersimpan di {pLabel(root.current)}.</div>}
    </div>
  );
}
