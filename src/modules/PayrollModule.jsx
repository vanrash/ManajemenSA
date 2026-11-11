import { useState } from "react";
import { Users, Clock, Wallet, Store } from "lucide-react";
import { SubTabs } from "../components/SubTabs.jsx";
import { TabPayroll } from "../tabs/TabPayroll.jsx";
import { TabAbsensi } from "../tabs/TabAbsensi.jsx";
import { TabKasbon } from "../tabs/TabKasbon.jsx";
import { TabOmzet } from "../tabs/TabOmzet.jsx";

const ITEMS = [
  { label: "Payroll & E-Slip", icon: Users, tone: "indigo" },
  { label: "Kalkulator Absensi", icon: Clock, tone: "sky" },
  { label: "Kasbon & Potongan", icon: Wallet, tone: "rose" },
  { label: "Omzet & Evaluasi", icon: Store, tone: "amber" },
];

export function PayrollModule({ db, setDb, store, setStore }) {
  const [sub, setSub] = useState(0);
  return (
    <div className="space-y-4">
      <SubTabs items={ITEMS} value={sub} onChange={setSub} />
      {sub === 0 && <TabPayroll db={db} setDb={setDb} store={store} setStore={setStore} />}
      {sub === 1 && <TabAbsensi db={db} setDb={setDb} store={store} />}
      {sub === 2 && <TabKasbon db={db} setDb={setDb} store={store} />}
      {sub === 3 && <TabOmzet db={db} setDb={setDb} />}
    </div>
  );
}
