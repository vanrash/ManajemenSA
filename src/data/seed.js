import { STORES } from "../constants.js";

export const mk = (id, name, store, jabatan, divisi, pokok, kes, akom, extra = {}) => ({
  id, name, store, jabatan, divisi, pokok, kes, akom,
  hariDigaji: 31, telat: 0, telatNote: "", alpa: 0, izin: 0, sakitSurat: 0, sakitTanpa: 0,
  midMonth: false, bonusManual: 0, absenDiisi: true, tidakDigaji: 0, jam: 0, ...extra,
});

export const initialData = () => ({
  settings: { periode: "Oktober 2026", cal: 31, libur: 4, telatPas: true },
  emps: [
    mk("e1", "RENI", "S1", "Kepala Toko", "KEP.TOKO", 1900000, 150000, 150000),
    mk("e2", "RANI", "S1", "Karyawan", "-", 1250000, 100000, 100000, { telat: 2, telatNote: "Tgl 9 & 20" }),
    mk("e3", "WIDIA", "S1", "Karyawan", "-", 1000000, 200000, 100000),
    mk("e4", "BELA", "S1", "Karyawan", "-", 1000000, 200000, 100000),
    mk("e5", "SILVIA", "S1", "Karyawan", "-", 1000000, 200000, 100000, { hariDigaji: 26, tidakDigaji: 5, sakitSurat: 5, telat: 1, telatNote: "Ada Ujian TKA" }),
    mk("e6", "WILLI", "S1", "Karyawan", "-", 1250000, 200000, 150000),
    mk("e7", "ROHMAN", "S1", "Karyawan", "-", 1250000, 150000, 100000),
    mk("e8", "MIA", "S3", "Karyawan", "FROZEN & PERBANTUAN BHN MASAK", 1000000, 200000, 100000),
    mk("e9", "SELVIA", "S3", "Karyawan", "FROZEN & PERBANTUAN BHN KUE", 1000000, 200000, 100000),
    mk("e10", "RIRIN", "S3", "Karyawan", "BHN KUE&MASAK", 1000000, 200000, 100000),
  ],
  kasbon: [],
  stores: Object.fromEntries(STORES.map((s) => [s.key, { omzet: 0, omzetPrev: 0, selisih: 0, lain: 0, c1: false, c2: false, c3: false }])),
  pajakRate: 0.5,
});
