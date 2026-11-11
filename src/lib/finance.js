import { num } from "../utils/format.js";
import { calc } from "./payroll.js";

export const QRIS_KEYS = ["s1a", "s1b", "s2a", "s2b", "s3a", "s3b"];
export const qTotal = (r) => QRIS_KEYS.reduce((a, k) => a + num(r[k]), 0);
export const inMonth = (date, key) => (date || "").startsWith(key); // key = "2026-10"
export const sumBy = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
export const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Laba rugi satu periode: pemasukan (QRIS + kas masuk) dikurangi gaji, kas keluar, dan belanja gudang.
export function labaRugi(root, db) {
  const key = root.current;
  const m = (arr) => arr.filter((x) => inMonth(x.date, key));
  const qris = sumBy(m(root.qris.rows), qTotal);
  const kas = m(root.kas.rows);
  const kasMasuk = sumBy(kas.filter((r) => r.jenis === "Masuk"), (r) => num(r.nominal));
  const kasKeluar = sumBy(kas.filter((r) => r.jenis === "Keluar"), (r) => num(r.nominal));
  const belanja = sumBy(m(root.kas.belanja), (r) => num(r.nominal));
  const gaji = sumBy(db.emps, (e) => calc(e, db).net);
  const pemasukan = qris + kasMasuk;
  const pengeluaran = gaji + kasKeluar + belanja;
  const laba = pemasukan - pengeluaran;
  const pajak = Math.round((pemasukan * num(db.pajakRate)) / 100);
  return { qris, kasMasuk, pemasukan, gaji, kasKeluar, belanja, pengeluaran, laba, pajak, labaBersih: laba - pajak };
}
