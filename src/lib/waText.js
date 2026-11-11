import { STORES } from "../constants.js";
import { rp } from "../utils/format.js";

export function waText(e, c, db) {
  const { periode, cal } = db.settings;
  const L = [`*SLIP GAJI - CV. SUMBER AGUNG*`, `Periode: ${periode}`, `Nama: ${e.name} (${e.jabatan})`, `Cabang: ${STORES.find((s) => s.key === e.store)?.short}`, ``,
    `Gaji Resmi: ${rp(c.resmi)}`, `Gaji Dasar: ${rp(c.dasar)}${c.prorata ? ` (prorata ${e.hariDigaji}/${cal} hari)` : ""}`,
    `Reward Absensi Full: ${rp(c.full)}`, `Reward Tanpa Terlambat: ${rp(c.noLate)}`];
  if (c.jamPay) L.push(`Upah Jam (${c.jam} jam): ${rp(c.jamPay)}`);
  if (c.bonus) L.push(`Bonus Kinerja/Omzet: ${rp(c.bonus)}`);
  L.push(``, `Potongan:`);
  if (c.dTelat) L.push(`- Telat ${e.telat}x${e.telatNote ? ` (${e.telatNote})` : ""}: -${rp(c.dTelat)}`);
  if (c.dAlpa) L.push(`- Alpa ${e.alpa}x: -${rp(c.dAlpa)}`);
  if (c.dIzin) L.push(`- Izin di atas toleransi: -${rp(c.dIzin)}`);
  if (c.dSakit) L.push(`- Sakit tanpa surat: -${rp(c.dSakit)}`);
  c.kasList.forEach((k) => L.push(`- ${k.jenis} ${k.ket}: -${rp(k.nominal)}`));
  if (!c.potongan) L.push(`- Tidak ada`);
  L.push(``, `*TOTAL DITERIMA: ${rp(c.net)}*`, `Kehadiran: ${c.pct}% ${c.warn ? "(Di bawah 90%, evaluasi)" : "(Memenuhi target)"}`);
  return L.join("\n");
}
