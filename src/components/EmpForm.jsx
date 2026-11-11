import { useState } from "react";
import { STORES, TONE } from "../constants.js";
import { rp, num, uid } from "../utils/format.js";
import { mk } from "../data/seed.js";
import { Field, inp, NumIn, MoneyIn, Btn, Modal } from "./ui.jsx";

export function EmpForm({ init, defStore, cal, jamPerHari, onSave, onClose }) {
  const [f, setF] = useState(init ? (init.absenDiisi === false ? { ...init, hariMasuk: 0 } : init) : { ...mk(uid(), "", defStore, "Karyawan", "-", 1000000, 200000, 100000), hariMasuk: 0 });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Modal title={init ? "Edit Karyawan" : "Tambah Karyawan"} onClose={onClose} wide>
      <div className="space-y-5">
        <div>
          <div className={`mb-3 rounded-xl px-3 py-2 text-base font-bold ${TONE.indigo.head}`}>1. Data Karyawan</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Jabatan"><select className={inp} value={f.jabatan} onChange={(e) => set("jabatan", e.target.value)}><option>Karyawan</option><option>Kepala Toko</option></select></Field>
            <Field label="Divisi Tugas"><input className={inp} value={f.divisi} onChange={(e) => set("divisi", e.target.value)} /></Field>
            <Field label="Nama"><input className={inp} value={f.name} onChange={(e) => set("name", e.target.value.toUpperCase())} /></Field>
            <Field label="Cabang"><select className={inp} value={f.store} onChange={(e) => set("store", e.target.value)}>{STORES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}</select></Field>
          </div>
        </div>

        <div>
          <div className={`mb-3 rounded-xl px-3 py-2 text-base font-bold ${TONE.emerald.head}`}>2. Gaji & Lembur</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Gaji Pokok"><MoneyIn value={f.pokok} onChange={(v) => set("pokok", v)} /></Field>
            <Field label="Tunjangan Kesehatan"><MoneyIn value={f.kes} onChange={(v) => set("kes", v)} /></Field>
            <Field label="Tunjangan Akomodasi"><MoneyIn value={f.akom} onChange={(v) => set("akom", v)} /></Field>
            <Field label="Lembur / Lainnya (Rp)"><MoneyIn value={f.bonusManual} onChange={(v) => set("bonusManual", v)} /></Field>
          </div>
        </div>

        <div>
          <div className={`mb-3 rounded-xl px-3 py-2 text-base font-bold ${TONE.sky.head}`}>3. Kehadiran Bulan Ini</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={`Hari Digaji / Hari Masuk (dari ${cal} hari)`}><NumIn value={f.hariMasuk} min={0} max={cal} onChange={(v) => set("hariMasuk", Math.min(Math.max(v, 0), cal))} /></Field>
            <Field label="Jam Masuk Tidak Penuh (jam)"><NumIn value={f.jam || 0} step="0.5" onChange={(v) => set("jam", v)} /></Field>
            <Field label="Jumlah Telat (x)"><NumIn value={f.telat} onChange={(v) => set("telat", v)} /></Field>
            <Field label="Catatan Telat (tanggal/alasan)"><input className={inp} value={f.telatNote} onChange={(e) => set("telatNote", e.target.value)} /></Field>
          </div>
          <div className="mt-2 text-sm text-slate-600">Upah per jam: {rp(Math.round((num(f.pokok) + num(f.kes) + num(f.akom)) / cal / jamPerHari))} ({jamPerHari} jam per hari). Jam tidak penuh diisi untuk hari setengah hari; hari penuh diisi di kolom hari.</div>
          <label className="mt-3 flex items-center gap-2 text-base text-slate-700"><input type="checkbox" checked={f.midMonth} onChange={(e) => set("midMonth", e.target.checked)} />Masuk tengah bulan (karyawan baru)</label>
        </div>

        <div>
          <div className={`mb-3 rounded-xl px-3 py-2 text-base font-bold ${TONE.rose.head}`}>4. Alpa, Izin & Sakit</div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Alpa (hari)"><NumIn value={f.alpa} onChange={(v) => set("alpa", v)} /></Field>
            <Field label="Izin (hari)"><NumIn value={f.izin} onChange={(v) => set("izin", v)} /></Field>
            <Field label="Sakit Dengan Surat Dokter (hari)"><NumIn value={f.sakitSurat} onChange={(v) => set("sakitSurat", v)} /></Field>
            <Field label="Sakit Tanpa Surat (hari)"><NumIn value={f.sakitTanpa} onChange={(v) => set("sakitTanpa", v)} /></Field>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Btn onClick={onClose}>Batal</Btn>
        <Btn tone="indigo" onClick={() => f.name.trim() && onSave({ ...f, absenDiisi: true })}>Simpan</Btn>
      </div>
    </Modal>
  );
}
