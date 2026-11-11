import { useState, useRef } from "react";
import { Download, Copy, Printer, Image as ImgIcon } from "lucide-react";
import { calc } from "../lib/payroll.js";
import { loadScript, renderSlip } from "../lib/exportImage.js";
import { inp, Btn, Modal } from "./ui.jsx";
import { Slip } from "./Slip.jsx";
import { waText } from "../lib/waText.js";

export function SlipModal({ e, db, onClose }) {
  const ref = useRef(null);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState("");
  const [textBox, setTextBox] = useState("");
  const c = calc(e, db);
  if (c.pending) return (
    <Modal title={`E-Slip ${e.name}`} onClose={onClose}>
      <div className="rounded-lg bg-amber-50 p-4 text-base text-amber-900">Absensi {e.name} untuk {db.settings.periode} belum diisi, jadi gaji bersih belum dihitung. Isi lewat tab Kalkulator Absensi atau tombol Edit di tabel Payroll, atau klik "Hadir Penuh" jika tidak ada telat, izin, maupun alpa.</div>
    </Modal>
  );
  const canvas = () => renderSlip(ref.current);
  const dl = async () => {
    try {
      setMsg("Memproses gambar...");
      const cv = await canvas();
      const a = document.createElement("a");
      a.download = `ESlip_${e.name}_${db.settings.periode.replace(/\s+/g, "_")}.png`;
      a.href = cv.toDataURL("image/png");
      a.click();
      setMsg("Gambar PNG berhasil diunduh.");
    } catch (er) { setMsg(er.message); }
  };
  const cp = async () => {
    let cv;
    try {
      setMsg("Memproses gambar...");
      setPreview("");
      cv = await canvas();
      const blob = await new Promise((r) => cv.toBlob(r, "image/png"));
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setMsg("Gambar tersalin. Tekan Ctrl + V di chat WhatsApp.");
    } catch (er) {
      if (cv) {
        setPreview(cv.toDataURL("image/png"));
        setMsg("Browser memblokir salin otomatis di sini. Klik kanan gambar di bawah (di HP: tekan lama) lalu pilih Salin Gambar, atau pakai tombol Download.");
      } else setMsg(er.message);
    }
  };
  const pdf = async () => {
    try {
      setMsg("Membuat PDF...");
      const cv = await canvas();
      if (!window.jspdf) await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js");
      const { jsPDF } = window.jspdf;
      const w = cv.width / 2, h = cv.height / 2;
      const doc = new jsPDF({ orientation: w > h ? "l" : "p", unit: "px", format: [w, h], hotfixes: ["px_scaling"] });
      doc.addImage(cv.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, w, h);
      // Unduh lewat tautan data (cara yang sama dengan PNG) karena doc.save() dapat diblokir di iframe
      const a = document.createElement("a");
      a.href = doc.output("datauristring");
      a.download = `ESlip_${e.name}_${db.settings.periode.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMsg("PDF berhasil diunduh. Buka file PDF-nya lalu cetak jika perlu.");
    } catch (er) { setMsg("Gagal membuat PDF: " + er.message); }
  };
  const cpTxt = async () => {
    const t = waText(e, c, db);
    setTextBox("");
    try { await navigator.clipboard.writeText(t); setMsg("Teks WhatsApp tersalin."); return; } catch (er) { /* pakai cadangan */ }
    const ta = document.createElement("textarea");
    ta.value = t;
    ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (er2) { ok = false; }
    ta.remove();
    if (ok) setMsg("Teks WhatsApp tersalin.");
    else { setTextBox(t); setMsg("Browser memblokir salin otomatis. Teks ada di kotak di bawah: tekan Ctrl + C (di HP: tekan lama lalu Salin)."); }
  };
  return (
    <Modal title={`E-Slip ${e.name}`} onClose={onClose} wide>
      <Slip e={e} c={c} db={db} cardRef={ref} />
      <div className="mx-auto mt-4 grid max-w-[420px] grid-cols-2 gap-2">
        <Btn tone="indigo" onClick={dl}><Download size={15} />Download Gambar PNG (HD)</Btn>
        <Btn tone="emerald" onClick={cp}><ImgIcon size={15} />Salin Gambar (Paste di WA Web)</Btn>
        <Btn onClick={cpTxt}><Copy size={15} />Salin Teks WA</Btn>
        <Btn onClick={pdf}><Printer size={15} />Download PDF</Btn>
      </div>
      {msg && <div className="mx-auto mt-3 max-w-[420px] rounded-lg bg-slate-100 p-2 text-center text-sm text-slate-700">{msg}</div>}
      {preview && <div className="mx-auto mt-3 max-w-[420px]"><img src={preview} alt="E-Slip" className="w-full rounded-xl border border-slate-300" /></div>}
      {textBox && <textarea readOnly rows={8} className={inp + " mx-auto mt-3 block max-w-[420px]"} value={textBox} onFocus={(ev) => ev.target.select()} />}
    </Modal>
  );
}
