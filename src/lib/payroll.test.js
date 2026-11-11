// Jalankan dengan: npm test  (memakai test runner bawaan Node, tanpa instalasi tambahan)
import test from "node:test";
import assert from "node:assert/strict";
import { calc } from "./payroll.js";
import { initialData } from "../data/seed.js";

const db = initialData();
const emp = (name) => db.emps.find((e) => e.name === name);
const net = (name) => calc(emp(name), db).net;

test("data awal Oktober 2026 sesuai angka dari pemilik toko", () => {
  assert.equal(net("RENI"), 2200000);   // Kepala Toko, tanpa reward
  assert.equal(net("RANI"), 1580000);   // telat 2x, reward full saja
  assert.equal(net("WIDIA"), 1500000);
  assert.equal(net("BELA"), 1500000);
  assert.equal(net("SILVIA"), 1080300); // prorata 26 hari, telat 1x
  assert.equal(net("WILLI"), 1800000);
  assert.equal(net("ROHMAN"), 1700000);
  assert.equal(net("MIA"), 1500000);
});

test("prorata SILVIA dibulatkan ke ratusan", () => {
  assert.equal(calc(emp("SILVIA"), db).dasar, 1090300);
});

test("upah jam: 20 hari penuh + 4 jam dari gaji resmi 1.300.000 (31 hari, 9 jam/hari)", () => {
  const c = calc({ ...emp("WIDIA"), hariDigaji: 20, jam: 4 }, db);
  assert.equal(c.dasarHari, 838700);
  assert.equal(c.jamPay, 18600);
  assert.equal(c.dasar, 857300);
  assert.equal(c.full, 0); // jam tidak penuh -> reward full tidak cair
});

test("gaji dasar tidak melebihi gaji resmi", () => {
  const c = calc({ ...emp("WIDIA"), hariDigaji: 31, jam: 5 }, db);
  assert.equal(c.dasar, 1300000);
});

test("karyawan yang belum dihitung bernilai 0", () => {
  const c = calc({ ...emp("WIDIA"), absenDiisi: false }, db);
  assert.equal(c.net, 0);
  assert.equal(c.pending, true);
});

test("denda alpa dan izin memakai aturan cabang", () => {
  const c = calc({ ...emp("WIDIA"), alpa: 1, izin: 2 }, db);
  assert.equal(c.dAlpa, 30000);
  assert.equal(c.dIzin, 15000); // izin pertama bebas, izin kedua kena denda
});
