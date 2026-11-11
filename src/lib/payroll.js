import { num } from "../utils/format.js";
import { getRules } from "./rules.js";

export function calc(e, db) {
  const { cal } = db.settings;
  const r = getRules(db.settings, e.store);
  const resmi = num(e.pokok) + num(e.kes) + num(e.akom);
  const jam = num(e.jam);
  const prorata = e.hariDigaji < cal || jam > 0;
  const dasarHari = e.hariDigaji < cal ? Math.round(((resmi / cal) * e.hariDigaji) / 100) * 100 : resmi;
  const upahJam = resmi / cal / r.jamPerHari;
  const jamPay = jam > 0 ? Math.round((upahJam * jam) / 100) * 100 : 0;
  const dasar = Math.min(resmi, dasarHari + jamPay);
  const sakit = num(e.sakitSurat) + num(e.sakitTanpa);
  const isKT = e.jabatan === "Kepala Toko";
  const st = db.stores[e.store] || {};
  const full = !isKT && !e.midMonth && e.hariDigaji >= cal && !jam && !e.alpa && !e.izin && !sakit ? r.rFull : 0;
  const noLate = !isKT && !e.telat && !e.alpa && !e.izin && !sakit ? r.rNoLate : 0;
  const kinerja = isKT && st.c1 && st.c2 && st.c3 ? r.rKinerja : 0;
  const bonus = kinerja + num(e.bonusManual);
  const dTelat = r.dTelat * e.telat, dAlpa = r.dAlpa * e.alpa;
  const dIzin = e.izin > r.izinBebas ? r.dIzin * (e.izin - r.izinBebas) : 0;
  const dSakit = r.dSakit * e.sakitTanpa;
  const kasList = db.kasbon.filter((k) => k.empId === e.id && k.status === "Potong Gaji Bulan Ini");
  const kas = kasList.reduce((a, k) => a + num(k.nominal), 0);
  const potongan = dTelat + dAlpa + dIzin + dSakit + kas;
  const net = dasar + full + noLate + bonus - potongan;
  const pct = Math.min(100, Math.round(((e.hariDigaji + jam / r.jamPerHari + num(e.sakitSurat)) / cal) * 1000) / 10);
  const warn = pct < r.minHadir && !e.midMonth;

  let rFull;
  if (isKT) rFull = "TIDAK BERLAKU • Sesuai aturan khusus Jabatan Kepala Toko";
  else if (full) rFull = "CAIR • Hadir penuh 100% bulan ini";
  else {
    const why = [];
    if (e.midMonth) why.push("karyawan masuk tengah bulan");
    if (jam > 0) why.push(`ada hari masuk tidak penuh (${jam} jam)`);
    if (sakit) why.push(`terdapat ${sakit} hari izin sakit (tidak penuh ${cal} hari)`);
    if (e.izin) why.push(`terdapat ${e.izin}x izin`);
    if (e.alpa) why.push(`terdapat ${e.alpa}x alpa`);
    if (!why.length && e.hariDigaji < cal) why.push(`hari digaji ${e.hariDigaji} dari ${cal}`);
    rFull = "TIDAK CAIR • " + why.join(", ");
  }
  let rLate;
  if (isKT) rLate = "TIDAK BERLAKU • Sesuai aturan khusus Jabatan Kepala Toko";
  else if (noLate) rLate = "CAIR • Disiplin 0x terlambat";
  else {
    const why = [];
    if (e.telat) why.push(`tercatat terlambat ${e.telat}x${e.telatNote ? " (" + e.telatNote + ")" : ""}`);
    if (e.alpa) why.push(`${e.alpa}x alpa`);
    if (e.izin) why.push(`${e.izin}x izin`);
    if (sakit) why.push(`${sakit}x sakit`);
    rLate = "GUGUR • " + why.join(", ");
  }
  const out = { resmi, prorata, dasar, dasarHari, jamPay, upahJam, jam, full, noLate, kinerja, bonus, dTelat, dAlpa, dIzin, dSakit, kasList, kas, potongan, net, pct, warn, rFull, rLate, sakit, isKT, pending: false, r };
  if (e.absenDiisi === false) {
    const why = "BELUM DIHITUNG • Absensi bulan ini belum diisi";
    return { ...out, dasar: 0, jamPay: 0, full: 0, noLate: 0, kinerja: 0, bonus: 0, dTelat: 0, dAlpa: 0, dIzin: 0, dSakit: 0, kas: 0, potongan: 0, net: 0, pct: 0, warn: false, rFull: why, rLate: why, pending: true };
  }
  return out;
}
