import { seedQris, emptyKas } from "../data/seedQris.js";
import { STORES } from "../constants.js";
import { uid } from "../utils/format.js";
import { initialData } from "../data/seed.js";

export const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export const pKey = (y, m) => `${y}-${String(m).padStart(2, "0")}`;

export const pLabel = (key) => { const [y, m] = key.split("-"); return `${MONTHS[+m - 1]} ${y}`; };

export const daysIn = (y, m) => new Date(y, m, 0).getDate();

const nextKey = (key) => { let [y, m] = key.split("-").map(Number); m++; if (m > 12) { m = 1; y++; } return pKey(y, m); };

export const withExtras = (r) => ({ ...r, qris: r.qris || seedQris(), kas: r.kas || emptyKas() });
export const initialRoot = () => withExtras({ current: "2026-10", periods: { "2026-10": initialData() } });

export const normalizeRoot = (j) => {
  if (j && j.periods && j.current && j.periods[j.current]) return withExtras(j);
  if (j && j.emps && j.settings) { // format lama (satu periode)
    const txt = j.settings.periode || "";
    const mi = MONTHS.findIndex((n) => txt.toLowerCase().startsWith(n.toLowerCase()));
    const y = parseInt((txt.match(/\d{4}/) || ["2026"])[0], 10);
    const key = pKey(y, mi >= 0 ? mi + 1 : 10);
    return withExtras({ current: key, periods: { [key]: j } });
  }
  return null;
};

// Periode baru: data master karyawan disalin, data bulanan (absensi, bonus, omzet) dikosongkan.
export const buildPeriod = (src, key) => {
  const [y, m] = key.split("-").map(Number);
  const cal = daysIn(y, m);
  return {
    settings: { ...src.settings, periode: pLabel(key), cal },
    emps: src.emps.map((e) => ({ ...e, hariDigaji: cal, telat: 0, telatNote: "", alpa: 0, izin: 0, sakitSurat: 0, sakitTanpa: 0, midMonth: false, bonusManual: 0, absenDiisi: false, tidakDigaji: 0, jam: 0, hariMasuk: undefined })),
    kasbon: src.kasbon.filter((k) => k.status === "Ditunda").map((k) => ({ ...k, id: uid() })),
    stores: Object.fromEntries(STORES.map((st) => [st.key, { omzet: 0, omzetPrev: (src.stores[st.key] || {}).omzet || 0, selisih: 0, lain: 0, c1: false, c2: false, c3: false }])),
    pajakRate: src.pajakRate,
  };
};
