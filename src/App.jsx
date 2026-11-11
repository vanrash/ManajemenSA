import { useState, useEffect, useRef } from "react";
import { ConfirmModal, Modal } from "./components/ui.jsx";
import { PeriodBar } from "./components/PeriodBar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { PayrollModule } from "./modules/PayrollModule.jsx";
import { QrisModule } from "./modules/QrisModule.jsx";
import { KasModule } from "./modules/KasModule.jsx";
import { LabaRugiModule } from "./modules/LabaRugiModule.jsx";
import { LS_KEY } from "./constants.js";
import { initialRoot, normalizeRoot, pLabel, daysIn } from "./lib/periods.js";
import { DARK_CSS, DARK_CSS2 } from "./styles/darkTheme.js";

export default function App() {
  const [root, setRoot] = useState(() => {
    try { const raw = localStorage.getItem(LS_KEY); if (raw) { const n = normalizeRoot(JSON.parse(raw)); if (n) return n; } } catch (e) { /* abaikan */ }
    return initialRoot();
  });
  const cur = root.periods[root.current];
  // Label periode selalu diturunkan dari periode yang aktif (bukan dari teks yang tersimpan)
  const calAuto = daysIn(+root.current.split("-")[0], +root.current.split("-")[1]);
  const db = {
    ...cur,
    settings: { ...cur.settings, periode: pLabel(root.current), cal: calAuto },
    emps: cur.emps.map((e) => {
      if (e.hariMasuk !== undefined && e.hariMasuk !== null) {
        const m = Math.min(Math.max(e.hariMasuk, 0), calAuto);
        return { ...e, hariMasuk: m, tidakDigaji: calAuto - m, hariDigaji: m };
      }
      const tidak = e.tidakDigaji !== undefined ? e.tidakDigaji : Math.max(0, (cur.settings.cal || calAuto) - (e.hariDigaji === undefined ? cur.settings.cal : e.hariDigaji));
      const hd = Math.max(0, calAuto - tidak);
      return { ...e, tidakDigaji: tidak, hariDigaji: hd, hariMasuk: hd };
    }),
  };
  const setDb = (fn) => setRoot((r) => ({ ...r, periods: { ...r.periods, [r.current]: typeof fn === "function" ? fn(r.periods[r.current]) : fn } }));
  const [dark, setDark] = useState(() => { try { return localStorage.getItem("sumber-agung-theme") === "dark"; } catch (e) { return false; } });
  const wrapRef = useRef(null);
  const toggleTheme = () => {
    setDark((d) => !d);
    try {
      if (wrapRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) wrapRef.current.animate([{ opacity: 0.55 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    } catch (e) { /* animasi opsional */ }
  };
  useEffect(() => { try { localStorage.setItem("sumber-agung-theme", dark ? "dark" : "light"); } catch (e) { /* abaikan */ } }, [dark]);
  const [missing, setMissing] = useState(false);
  const [store, setStore] = useState("S1");
  const fileRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(LS_KEY, JSON.stringify(root)); } catch (e) { /* storage tidak tersedia */ } }, 400);
    return () => clearTimeout(t);
  }, [root]);

  const [askReset, setAskReset] = useState(false);
  const [notice, setNotice] = useState("");
  const reset = () => setAskReset(true);
  const backup = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(root, null, 2)], { type: "application/json" }));
    a.download = `Backup_SumberAgung_Semua_Periode.json`;
    a.click();
  };
  const restore = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const j = JSON.parse(r.result);
        const n = normalizeRoot(j);
        if (!n) throw new Error();
        setRoot(n);
      } catch { setNotice("File backup tidak valid."); }
    };
    r.readAsText(file);
    ev.target.value = "";
  };

  const [menu, setMenu] = useState(0);
  return (
    <div ref={wrapRef} className={`min-h-screen bg-slate-50 text-slate-800 leading-relaxed ${dark ? "dk" : ""}`} style={{ colorScheme: dark ? "dark" : "light", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <style>{`@media print{body *{visibility:hidden}#slip-print,#slip-print *{visibility:visible}#slip-print{position:fixed;left:0;top:0}}` + DARK_CSS + "input[type=number]{-moz-appearance:textfield;appearance:textfield}input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}tbody tr:nth-child(even){background-color:rgba(100,116,139,.08)}" + DARK_CSS2}</style>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar menu={menu} setMenu={setMenu} dark={dark} toggleTheme={toggleTheme} backup={backup} onRestore={() => fileRef.current?.click()} reset={reset} />
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={restore} />
        <main className="min-w-0 flex-1 space-y-4 p-4">
          <PeriodBar root={root} setRoot={setRoot} onMissing={setMissing} />
          {!missing && menu === 0 && <PayrollModule db={db} setDb={setDb} store={store} setStore={setStore} />}
          {!missing && menu === 1 && <QrisModule root={root} setRoot={setRoot} />}
          {!missing && menu === 2 && <KasModule root={root} setRoot={setRoot} />}
          {!missing && menu === 3 && <LabaRugiModule root={root} db={db} setDb={setDb} />}
        </main>
      </div>
      {askReset && <ConfirmModal yes="Ya, reset semua" text="Kembalikan SEMUA periode ke data awal Oktober 2026? Semua periode lain akan terhapus. Sebaiknya Backup dulu." onYes={() => { setRoot(initialRoot()); setAskReset(false); }} onNo={() => setAskReset(false)} />}
      {notice && <Modal title="Pemberitahuan" onClose={() => setNotice("")}><p className="text-base text-slate-700">{notice}</p></Modal>}
    </div>
  );
}
