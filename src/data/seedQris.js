// Data contoh awal QRIS (s1a = Store 1 Shift 1, s1b = Store 1 Shift 2, dst.)
export const seedQris = () => ({
  rows: [
    { id: "q1", date: "2026-10-27", s1a: 1229500, s1b: 2844200, s2a: 726000, s2b: 1804525, s3a: 150000, s3b: 291500, verif: "Benar", ket: "Sended" },
    { id: "q2", date: "2026-10-28", s1a: 456500, s1b: 1115063, s2a: 785000, s2b: 2596500, s3a: 72000, s3b: 0, verif: "Benar", ket: "Sended" },
    { id: "q3", date: "2026-11-07", s1a: 2278470, s1b: 1890500, s2a: 1247000, s2b: 2510720, s3a: 310000, s3b: 214000, verif: "Benar", ket: "blm kirm" },
    { id: "q4", date: "2026-11-08", s1a: 1177000, s1b: 1607090, s2a: 1894000, s2b: 1899000, s3a: 23500, s3b: 25000, verif: "Benar", ket: "blm kirm" },
  ],
  transfers: [
    { id: "t1", from: "2026-10-24", to: "2026-10-24", total: 4853098, transfer: 4420498, ket: "432600 skincare fifi" },
    { id: "t2", from: "2026-10-25", to: "2026-10-25", total: 7212894, transfer: 7186894, ket: "26000 beli hisana sarapan" },
  ],
});
export const emptyKas = () => ({ rows: [], belanja: [], opname: [] });
