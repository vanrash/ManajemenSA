import { TONE } from "../constants.js";

// items: [{ label, icon, tone }]
export function SubTabs({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, i) => {
        const Ic = it.icon;
        const on = value === i;
        return (
          <button key={it.label} onClick={() => onChange(i)} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-base font-semibold ${on ? TONE[it.tone].chip : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            {Ic && <Ic size={17} className={on ? "" : TONE[it.tone].ico} />}{it.label}
          </button>
        );
      })}
    </div>
  );
}
