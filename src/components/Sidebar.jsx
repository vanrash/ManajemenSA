import { Users, QrCode, Warehouse, BarChart3, Store, Sun, Moon, Download, Upload, RotateCcw } from "lucide-react";
import { Btn } from "./ui.jsx";
import { TONE } from "../constants.js";

export const MENU = [
  { icon: Users, label: "Payroll & SDM", tone: "indigo" },
  { icon: QrCode, label: "Pendataan QRIS & Rek. Bos", tone: "sky" },
  { icon: Warehouse, label: "Kas & Operasional Gudang", tone: "amber" },
  { icon: BarChart3, label: "Rekap Laba Rugi & Pajak CV", tone: "emerald" },
];

export function Sidebar({ menu, setMenu, dark, toggleTheme, backup, onRestore, reset }) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-slate-200 bg-white p-4 md:sticky md:top-0 md:h-screen md:w-72 md:overflow-y-auto md:border-b-0 md:border-r">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-600"><Store size={22} /></div>
        <div>
          <h1 className="text-xl font-bold leading-tight text-slate-900">CV. Sumber Agung</h1>
          <p className="text-sm text-slate-600">Manajemen Keuangan, QRIS, Gudang & Payroll</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1.5">
        {MENU.map((m, i) => (
          <button key={m.label} onClick={() => setMenu(i)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-base font-semibold ${menu === i ? TONE[m.tone].chip : "border-transparent text-slate-700 hover:bg-slate-50"}`}>
            <m.icon size={20} className={menu === i ? "" : TONE[m.tone].ico} />{m.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
        <Btn onClick={toggleTheme}>{dark ? <Sun size={15} /> : <Moon size={15} />}{dark ? "Mode Terang" : "Mode Gelap"}</Btn>
        <Btn onClick={backup}><Download size={15} />Backup (.json)</Btn>
        <Btn onClick={onRestore}><Upload size={15} />Restore (.json)</Btn>
        <Btn tone="rose" onClick={reset}><RotateCcw size={15} />Reset Data Awal</Btn>
      </div>
    </aside>
  );
}
