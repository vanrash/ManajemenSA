import { STORES } from "../constants.js";
import { rp, num } from "../utils/format.js";

export function Slip({ e, c, db, cardRef }) {
  const { periode, cal } = db.settings;
  const st = STORES.find((s) => s.key === e.store);
  const row = (l, v, cls = "text-slate-800") => (
    <div key={l + v} className="flex items-baseline justify-between gap-3 py-1.5 text-[15px]">
      <span className="text-slate-600">{l}</span>
      <span className={`whitespace-nowrap font-semibold ${cls}`}>{v}</span>
    </div>
  );
  const note = (t) => (
    <div className={`-mt-1 pb-2 text-[13px] leading-snug ${t.startsWith("CAIR") ? "text-emerald-700" : t.startsWith("TIDAK BERLAKU") ? "text-slate-500" : "text-amber-700"}`}>Status: {t}</div>
  );
  const section = (title, dot, children) => (
    <div className="px-5 py-4">
      <div className="mb-1.5 flex items-center gap-2 text-sm font-bold text-slate-700"><span className={`h-2 w-2 rounded-full ${dot}`} />{title}</div>
      {children}
    </div>
  );
  const dash = <div className="mx-5 border-t border-dashed border-slate-300" />;
  const income = c.dasar + c.full + c.noLate + c.bonus;
  return (
    <div ref={cardRef} id="slip-print" className="mx-auto w-[420px] max-w-full overflow-hidden rounded-3xl border border-slate-300 bg-white" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-base font-bold text-white">SA</div>
          <div>
            <div className="text-base font-bold text-slate-900">CV. SUMBER AGUNG</div>
            <div className="text-sm text-slate-600">Slip Gaji • {periode}</div>
          </div>
        </div>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[13px] font-semibold text-indigo-700">{st?.short}</span>
      </div>

      <div className="px-5 pt-5">
        <div className="text-2xl font-bold text-slate-900">{e.name}</div>
        <div className="text-sm text-slate-600">{e.jabatan}{e.divisi && e.divisi !== "-" ? ` • ${e.divisi}` : ""}</div>
      </div>

      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-indigo-50 p-4">
          <div className="text-sm font-medium text-slate-600">Total Gaji Diterima</div>
          <div className="mt-1.5 text-[40px] font-extrabold leading-none text-indigo-700">{rp(c.net)}</div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <div className="grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-300 text-center">
          {[["Hari Digaji", `${e.hariDigaji}/${cal}`], ["Telat", `${e.telat}x`], ["Izin/Sakit", `${e.izin + c.sakit}x`], ["Alpa", `${e.alpa}x`]].map(([l, v], i) => (
            <div key={l} className={`py-2.5 ${i < 3 ? "border-r border-slate-300" : ""}`}>
              <div className="text-base font-bold text-slate-800">{v}</div>
              <div className="text-sm text-slate-600">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-600">Kehadiran efektif {c.pct}%</span>
          <span className={`rounded-full px-2 py-0.5 text-[13px] font-semibold ${c.warn ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
            {c.warn ? `Di Bawah ${c.r.minHadir}% (Evaluasi)` : `Memenuhi Target >= ${c.r.minHadir}%`}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className={`h-full rounded-full ${c.warn ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${c.pct}%` }} /></div>
      </div>

      <div className="mt-2">{dash}</div>
      {section("Rincian Gaji Resmi", "bg-indigo-500", (
        <>
          {row("Gaji Pokok", rp(e.pokok))}{row("Tunjangan Kesehatan", rp(e.kes))}{row("Tunjangan Akomodasi", rp(e.akom))}
          {row("Total Gaji Resmi", rp(c.resmi))}
          {c.prorata && (
            <div className="my-1.5 rounded-xl bg-blue-50 p-3 text-[13px] leading-relaxed text-blue-900">
              {e.hariDigaji < cal && <div>Perhitungan Prorata ({e.hariDigaji} dari {cal} Hari): ({rp(c.resmi)} ÷ {cal} hari) × {e.hariDigaji} hari = <b>{rp(c.dasarHari)}</b></div>}
              {c.jam > 0 && <div>Upah Jam ({c.jam} jam): ({rp(c.resmi)} ÷ {cal} hari ÷ {c.r.jamPerHari} jam) × {c.jam} jam = <b>{rp(c.jamPay)}</b></div>}
            </div>
          )}
          {row("Gaji Dasar", rp(c.dasar), "text-indigo-700")}
        </>
      ))}
      {dash}
      {section("Apresiasi & Bonus", "bg-emerald-500", (
        <>
          {row(`Reward Absensi Full (${rp(c.r.rFull)})`, c.full ? "+" + rp(c.full) : "Rp 0", c.full ? "text-emerald-600" : "text-slate-500")}
          {note(c.rFull)}
          {row(`Reward Tanpa Terlambat (${rp(c.r.rNoLate)})`, c.noLate ? "+" + rp(c.noLate) : "Rp 0", c.noLate ? "text-emerald-600" : "text-slate-500")}
          {note(c.rLate)}
          {c.kinerja > 0 && row("Bonus Kinerja Kepala Toko", "+" + rp(c.kinerja), "text-emerald-600")}
          {num(e.bonusManual) > 0 && row("Lembur / Lainnya", "+" + rp(e.bonusManual), "text-emerald-600")}
        </>
      ))}
      {dash}
      {section("Potongan & Hak Toleransi", "bg-rose-500", (
        <>
          {e.sakitSurat > 0 && <div className="my-1 rounded-lg bg-emerald-50 p-2 text-[13px] text-emerald-800">{e.sakitSurat}x Sakit (Ada Surat Dokter) → Rp 0 (Bebas Potongan)</div>}
          {e.izin > 0 && c.r.izinBebas > 0 && <div className="my-1 rounded-lg bg-blue-50 p-2 text-[13px] text-blue-800">Izin {Math.min(e.izin, c.r.izinBebas)} hari → Rp 0 (Toleransi {c.r.izinBebas} hari/bulan)</div>}
          {c.dTelat > 0 && row(`Denda Telat ${e.telat}x${e.telatNote ? ` (${e.telatNote})` : ""}`, "-" + rp(c.dTelat), "text-rose-600")}
          {c.dAlpa > 0 && row(`Denda Alpa ${e.alpa}x`, "-" + rp(c.dAlpa), "text-rose-600")}
          {c.dIzin > 0 && row(`Denda Izin di atas toleransi (${e.izin - c.r.izinBebas}x)`, "-" + rp(c.dIzin), "text-rose-600")}
          {c.dSakit > 0 && row(`Sakit Tanpa Surat ${e.sakitTanpa}x`, "-" + rp(c.dSakit), "text-rose-600")}
          {c.kasList.map((k) => row(`${k.jenis}: ${k.ket || "-"}`, "-" + rp(k.nominal), "text-rose-600"))}
          {c.potongan === 0 && e.sakitSurat === 0 && e.izin === 0 && <div className="text-sm text-slate-500">Tidak ada potongan bulan ini.</div>}
        </>
      ))}

      <div className="border-t border-slate-300 bg-slate-100 px-5 py-4">
        {row("Total Pendapatan", rp(income))}
        {row("Total Potongan", c.potongan ? "-" + rp(c.potongan) : "Rp 0", c.potongan ? "text-rose-600" : "text-slate-500")}
        <div className="mt-1 flex items-baseline justify-between border-t border-slate-300 pt-3">
          <span className="text-base font-bold text-slate-800">Total Gaji Diterima</span>
          <span className="text-xl font-extrabold text-indigo-700">{rp(c.net)}</span>
        </div>
        <div className="mt-3 text-center text-sm text-slate-500">Dokumen ini dibuat otomatis oleh sistem CV. Sumber Agung</div>
      </div>
    </div>
  );
}
