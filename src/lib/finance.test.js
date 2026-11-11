import test from "node:test";
import assert from "node:assert/strict";
import { qTotal, labaRugi } from "./finance.js";
import { seedQris, emptyKas } from "../data/seedQris.js";
import { initialData } from "../data/seed.js";

test("total harian QRIS sesuai data contoh", () => {
  const t = seedQris().rows.map(qTotal);
  assert.deepEqual(t, [7045725, 5025063, 8450690, 6625590]);
});

test("selisih transfer bos sesuai keterangan pemakaian", () => {
  const [a, b] = seedQris().transfers;
  assert.equal(a.total - a.transfer, 432600);
  assert.equal(b.total - b.transfer, 26000);
});

test("laba rugi: pemasukan - gaji - kas keluar - belanja", () => {
  const db = initialData();
  const kas = { ...emptyKas(), rows: [{ id: "k1", date: "2026-10-05", jenis: "Keluar", nominal: 500000 }, { id: "k2", date: "2026-10-06", jenis: "Masuk", nominal: 200000 }], belanja: [{ id: "b1", date: "2026-10-07", nominal: 300000 }] };
  const root = { current: "2026-10", qris: seedQris(), kas };
  const r = labaRugi(root, db);
  assert.equal(r.qris, 7045725 + 5025063);
  assert.equal(r.pemasukan, r.qris + 200000);
  assert.equal(r.pengeluaran, r.gaji + 500000 + 300000);
  assert.equal(r.laba, r.pemasukan - r.pengeluaran);
});
