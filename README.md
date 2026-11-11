# Sistem Keuangan, Absensi & Payroll - CV. Sumber Agung

## Menjalankan
```
npm install
npm run dev      # buka alamat yang tampil (biasanya http://localhost:5173)
npm test         # tes rumus gaji (tanpa instalasi tambahan)
npm run build    # hasil jadi ada di folder dist/
```

## Mau mengubah apa? Buka file ini
| Yang ingin diubah | File |
|---|---|
| Rumus gaji, reward, denda, prorata, upah jam | `src/lib/payroll.js` |
| Nilai awal aturan (denda telat, reward, dll) | `src/constants.js` (`DEFAULT_RULES`) |
| Aturan per cabang | `src/lib/rules.js` |
| Nama cabang, warna cabang & tab | `src/constants.js` (`STORES`, `TONE`, `STORE_TONE`) |
| Data karyawan awal (contoh Oktober 2026) | `src/data/seed.js` |
| Cara periode/bulan dibuat, disalin, dimigrasi | `src/lib/periods.js` |
| Deteksi shift & telat dari log mesin absensi | `src/lib/attendance.js` |
| Teks pesan WhatsApp | `src/lib/waText.js` |
| Tampilan E-Slip | `src/components/Slip.jsx` |
| Tombol unduh/salin gambar & PDF slip | `src/components/SlipModal.jsx`, `src/lib/exportImage.js` |
| Form tambah/edit karyawan | `src/components/EmpForm.jsx` |
| Bar pilih bulan & tahun | `src/components/PeriodBar.jsx` |
| Tab Payroll / Absensi / Kasbon / Omzet / Rekap | `src/tabs/Tab*.jsx` |
| Menu samping (sidebar) & daftar menu | `src/components/Sidebar.jsx` |
| Sub-tab di atas konten | `src/components/SubTabs.jsx`, `src/modules/*Module.jsx` |
| Pendataan QRIS (harian, transfer bos, bulanan) | `src/modules/QrisModule.jsx` |
| Kas operasional, belanja stok, opname gudang | `src/modules/KasModule.jsx` |
| Rekap laba rugi & pajak CV | `src/modules/LabaRugiModule.jsx`, `src/lib/finance.js` |
| Data contoh QRIS | `src/data/seedQris.js` |
| Tabel isian serbaguna (QRIS, kas, belanja) | `src/components/ListEditor.jsx` |
| Tombol, kolom isian, jendela pop-up | `src/components/ui.jsx` |
| Warna mode gelap | `src/styles/darkTheme.js` |
| Kerangka aplikasi, tema terang/gelap, backup/restore | `src/App.jsx` |

Setelah mengubah rumus gaji, jalankan `npm test` untuk memastikan angka lama tidak ikut berubah.
Data tersimpan di browser (localStorage). Gunakan tombol Backup (.json) secara rutin.
