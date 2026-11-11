import { useState } from "react";
import { Clock, RotateCcw, Plus, Pencil, Trash2, Receipt, AlertTriangle } from "lucide-react";
import { STORES, TONE, STORE_TONE, DEFAULT_RULES } from "../constants.js";
import { rp } from "../utils/format.js";
import { getRules } from "../lib/rules.js";
import { calc } from "../lib/payroll.js";
import { Field, inp, NumIn, MoneyIn, Btn, ConfirmModal } from "../components/ui.jsx";
import { SlipModal } from "../components/SlipModal.jsx";
import { EmpForm } from "../components/EmpForm.jsx";

export function TabPayroll({ db, setDb, store, setStore }) {
  const [slip, setSlip] = useState(null);
  const [form, setForm] = useState(null);
  const s = db.settings;
  const R = getRules(s, store);
  const [showRules, setShowRules] = useState(false);
  const setRule = (k, v) => setDb((d) => ({ ...d, settings: { ...d.settings, rulesByStore: { ...(d.settings.rulesByStore || {}), [store]: { ...getRules(d.settings, store), [k]: v } } } }));
  const setS = (k, v) => setDb((d) => ({ ...d, settings: { ...d.settings, [k]: v } }));
  const list = db.emps.filter((e) => e.store === store);
  const rows = list.map((e) => ({ e, c: calc(e, db) }));
  const total = rows.reduce((a, r) => a + r.c.net, 0);
  const bonusDisiplin = rows.reduce((a, r) => a + r.c.full + r.c.noLate, 0);
  const filled = rows.filter((r) => !r.c.pending);
  const pendingN = rows.length - filled.length;
  const avg = filled.length ? Math.round((filled.reduce((a, r) => a + r.c.pct, 0) / filled.length) * 10) / 10 : null;
  const markFull = (e) => setDb((d) => ({ ...d, emps: d.emps.map((x) => (x.id === e.id ? { ...x, absenDiisi: true } : x)) }));
  const save = (f) => {
    setDb((d) => ({ ...d, emps: d.emps.some((x) => x.id === f.id) ? d.emps.map((x) => (x.id === f.id ? f : x)) : [...d.emps, f] }));
    setForm(null);
  };
  const [askEmp, setAskEmp] = useState(null);
  const [askUndo, setAskUndo] = useState(null); // karyawan, atau "all"
  const blankCalc = (x, cal) => ({ ...x, absenDiisi: false, telat: 0, telatNote: "", alpa: 0, izin: 0, sakitSurat: 0, sakitTanpa: 0, bonusManual: 0, midMonth: false, tidakDigaji: 0, jam: 0, hariMasuk: undefined, hariDigaji: cal });
  const doUndo = () => {
    setDb((d) => ({ ...d, emps: d.emps.map((x) => ((askUndo === "all" ? x.store === store : x.id === askUndo.id) ? blankCalc(x, d.settings.cal) : x)) }));
    setAskUndo(null);
  };
  const del = (e) => setAskEmp(e);
  const doDel = (e) => { setDb((d) => ({ ...d, emps: d.emps.filter((x) => x.id !== e.id), kasbon: d.kasbon.filter((k) => k.empId !== e.id) })); setAskEmp(null); };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {STORES.map((x) => (
          <button key={x.key} onClick={() => setStore(x.key)} className={`rounded-full border px-4 py-1.5 text-base font-medium ${store === x.key ? TONE[STORE_TONE[x.key]].chip + " font-bold" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}><span className={`mr-2 inline-block h-3 w-3 rounded-full ${TONE[STORE_TONE[x.key]].bar}`} />{x.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:grid-cols-2">
        <Field label="Periode Bulan & Tahun (atur lewat bar periode di atas)"><div className={inp + " bg-slate-50 font-semibold"}>{s.periode}</div></Field>
        <Field label="Total Hari Kalender (otomatis sesuai bulan)"><div className={inp + " bg-slate-50 font-semibold"}>{s.cal} hari</div></Field>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-800"><span className={`h-3 w-3 rounded-full ${TONE[STORE_TONE[store]].bar}`} />Aturan Potongan & Reward • {STORES.find((x) => x.key === store).label}</div>
            <div className="text-sm text-slate-600">Telat {rp(R.dTelat)} • Alpa {rp(R.dAlpa)} • Izin {rp(R.dIzin)} (bebas {R.izinBebas} hari) • Sakit tanpa surat {rp(R.dSakit)}</div>
          </div>
          <Btn onClick={() => setShowRules((v) => !v)}>{showRules ? "Tutup Pengaturan" : "Ubah Aturan"}</Btn>
        </div>
        {showRules && (
          <div className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[["dTelat", "Denda Telat (per kali)", 1], ["dAlpa", "Denda Alpa (per hari)", 1], ["dIzin", "Denda Izin di atas toleransi (per hari)", 1], ["izinBebas", "Toleransi Izin Bebas Denda (hari/bulan)", 0], ["dSakit", "Denda Sakit Tanpa Surat (per hari)", 1], ["rFull", "Reward Absensi Full", 1], ["rNoLate", "Reward Tanpa Terlambat", 1], ["rKinerja", "Bonus Kinerja Kepala Toko", 1], ["minHadir", "Target Kehadiran Minimal (%)", 0], ["jamPerHari", "Jam Kerja per Hari (pembagi upah per jam)", 0]].map(([k, l, money]) => (
                <Field key={k} label={l}>{money ? <MoneyIn value={R[k]} onChange={(v) => setRule(k, v)} /> : <NumIn value={R[k]} onChange={(v) => setRule(k, v)} />}</Field>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="max-w-xl text-sm text-slate-600">Aturan ini hanya berlaku untuk {STORES.find((x) => x.key === store).label} di periode {s.periode}; cabang lain tidak ikut berubah. Aturan akan disalin ke periode baru. Periode lama tidak berubah, jadi slip bulan yang sudah dihitung tetap memakai aturan saat itu.</p>
              <Btn onClick={() => setDb((d) => ({ ...d, settings: { ...d.settings, rulesByStore: { ...(d.settings.rulesByStore || {}), [store]: { ...DEFAULT_RULES } } } }))}><RotateCcw size={14} />Kembalikan Aturan Standar Cabang Ini</Btn>
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Total Pengeluaran Gaji", rp(total), "text-indigo-700"], ["Jumlah Karyawan", rows.length, "text-slate-800"], ["Total Bonus Disiplin Cair", rp(bonusDisiplin), "text-emerald-600"], ["Rata-rata Kehadiran", avg === null ? "-" : avg + "%", avg !== null && avg < R.minHadir ? "text-amber-600" : "text-slate-800"]].map(([l, v, cl], ci) => {
          const T = TONE[["indigo", "sky", "emerald", "amber"][ci]];
          return <div key={l} className={`rounded-2xl border p-4 shadow-sm ${T.soft}`}><div className={`text-sm font-semibold ${T.text}`}>{l}</div><div className={`mt-1 text-2xl font-bold ${cl}`}>{v}</div></div>;
        })}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="flex items-center gap-2 font-semibold text-slate-800"><span className={`h-3 w-3 rounded-full ${TONE[STORE_TONE[store]].bar}`} />Daftar Payroll • {STORES.find((x) => x.key === store).label}</h3>
          <div className="flex flex-wrap gap-2">
            {filled.length > 0 && <Btn tone="rose" onClick={() => setAskUndo("all")}><RotateCcw size={15} />Kosongkan Hitungan Cabang</Btn>}
            <Btn tone="indigo" onClick={() => setForm("new")}><Plus size={15} />Tambah Karyawan</Btn>
          </div>
        </div>
        <table className="w-full min-w-[1000px] text-base">
          <thead className="bg-slate-50 text-left text-sm text-slate-600">
            <tr>{["Karyawan", "Gaji Resmi", "Kehadiran", "Potongan", "Bonus", "Gaji Bersih", "Aksi"].map((h, hi) => <th key={h} className={`px-4 py-3 font-semibold ${TONE[["slate", "indigo", "sky", "rose", "emerald", "violet", "slate"][hi]].head}`}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-600">Belum ada karyawan di cabang ini. Klik "Tambah Karyawan".</td></tr>}
            {rows.map(({ e, c }) => (
              <tr key={e.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3"><div className="font-semibold text-slate-800">{e.name}</div><div className="text-sm text-slate-600">{e.jabatan}{e.divisi !== "-" ? ` • ${e.divisi}` : ""}</div></td>
                <td className="px-4 py-3">{rp(c.resmi)}{c.prorata && <div className="text-sm text-blue-600">Prorata: {rp(c.dasar)}</div>}</td>
                <td className="px-4 py-3">{c.pending ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-sm text-slate-600">Belum diisi</span> : <>{e.hariDigaji}/{s.cal} hari<div className={`text-sm ${c.warn ? "text-amber-600" : "text-slate-600"}`}>{c.pct}% {c.warn && <AlertTriangle size={11} className="inline" />} • Telat {e.telat}x</div></>}</td>
                <td className="px-4 py-3 font-medium text-rose-600">{c.potongan ? "-" + rp(c.potongan) : "-"}</td>
                <td className="px-4 py-3 font-medium text-emerald-600">{c.full + c.noLate + c.bonus ? "+" + rp(c.full + c.noLate + c.bonus) : "-"}</td>
                <td className="px-4 py-3 font-bold text-indigo-700">{c.pending ? <span className="text-sm font-medium text-amber-600">Belum dihitung</span> : rp(c.net)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Btn tone="indigo" onClick={() => setSlip(e)}><Receipt size={14} />Buka E-Slip</Btn>
                    {c.pending ? <Btn tone="emerald" onClick={() => markFull(e)}>Hadir Penuh</Btn> : <Btn tone="amber" onClick={() => setAskUndo(e)}><RotateCcw size={14} />Batal Hitung</Btn>}
                    <Btn tone="sky" onClick={() => setForm(e)}><Pencil size={14} />Edit</Btn>
                    <Btn tone="rose" onClick={() => del(e)}><Trash2 size={14} />Hapus</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pendingN > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 text-base text-blue-800">
          <Clock size={16} className="mt-0.5 shrink-0" />
          <div>{pendingN} karyawan belum diisi absensinya, sehingga gaji bersihnya belum dihitung. Isi lewat Tab Kalkulator Absensi atau tombol Edit. Klik "Hadir Penuh" jika karyawan tidak ada telat, izin, maupun alpa.</div>
        </div>
      )}
      {rows.some((r) => r.c.warn) && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-base text-amber-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <div>Evaluasi 3 bulanan: {rows.filter((r) => r.c.warn).map((r) => r.e.name).join(", ")} berada di bawah target kehadiran {R.minHadir}%.</div>
        </div>
      )}
      {askUndo && <ConfirmModal yes="Ya, kosongkan" text={askUndo === "all" ? `Kosongkan hasil hitungan gaji semua karyawan ${STORES.find((x) => x.key === store).label} di ${s.periode}? Absensi, telat, izin, sakit, dan bonus manual dikosongkan, dan statusnya kembali "Belum dihitung". Gaji pokok, tunjangan, dan catatan kasbon tidak dihapus.` : `Kosongkan hasil hitungan gaji ${askUndo.name} di ${s.periode}? Absensi, telat, izin, sakit, dan bonus manual dikosongkan, dan statusnya kembali "Belum dihitung". Gaji pokok, tunjangan, dan catatan kasbon tidak dihapus.`} onYes={doUndo} onNo={() => setAskUndo(null)} />}
      {askEmp && <ConfirmModal text={`Hapus ${askEmp.name} dari periode ${s.periode}? Catatan kasbonnya di periode ini ikut terhapus.`} onYes={() => doDel(askEmp)} onNo={() => setAskEmp(null)} />}
      {slip && <SlipModal e={db.emps.find((x) => x.id === slip.id) || slip} db={db} onClose={() => setSlip(null)} />}
      {form && <EmpForm init={form === "new" ? null : form} defStore={store} cal={s.cal} jamPerHari={R.jamPerHari} onSave={save} onClose={() => setForm(null)} />}
    </div>
  );
}
