import { H2C_URL } from "../constants.js";

// Ekspor gambar: html2canvas dari cdnjs (utama), html2canvas-pro sebagai cadangan.
// Warna modern (oklab/oklch/color-mix) milik Tailwind terbaru diubah dulu ke rgba pada salinan slip agar tidak error.
const H2C_SOURCES = [
  H2C_URL,
  "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js",
];

const h2cCache = {};

export const loadScript = (src) =>
  new Promise((res, rej) => {
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => res();
    el.onerror = () => { el.remove(); rej(new Error("gagal memuat " + src)); };
    document.head.appendChild(el);
  });

const loadH2C = async (src) => {
  if (h2cCache[src]) return h2cCache[src];
  await loadScript(src);
  if (!window.html2canvas) throw new Error("html2canvas tidak tersedia");
  h2cCache[src] = window.html2canvas;
  return window.html2canvas;
};

const BAD_COLOR = /oklab|oklch|color-mix|color\(|lab\(|lch\(|hwb\(/;

const COLOR_PROPS = ["color", "background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "outline-color", "text-decoration-color"];

let _ctx = null;

const toRGBA = (v) => {
  if (!_ctx) { const cv = document.createElement("canvas"); cv.width = 1; cv.height = 1; _ctx = cv.getContext("2d", { willReadFrequently: true }); }
  _ctx.clearRect(0, 0, 1, 1);
  _ctx.fillStyle = "#000000";
  _ctx.fillStyle = v;
  _ctx.fillRect(0, 0, 1, 1);
  const d = _ctx.getImageData(0, 0, 1, 1).data;
  return `rgba(${d[0]}, ${d[1]}, ${d[2]}, ${(d[3] / 255).toFixed(3)})`;
};

const sanitizeClone = (doc) => {
  doc.querySelectorAll(".dk").forEach((n) => n.classList.remove("dk")); // gambar selalu terang
  const win = doc.defaultView || window;
  doc.querySelectorAll("*").forEach((el) => {
    const cs = win.getComputedStyle(el);
    COLOR_PROPS.forEach((p) => {
      const v = cs.getPropertyValue(p);
      if (v && BAD_COLOR.test(v)) el.style.setProperty(p, toRGBA(v), "important");
    });
    ["box-shadow", "text-shadow", "background-image"].forEach((p) => {
      const v = cs.getPropertyValue(p);
      if (v && v !== "none" && BAD_COLOR.test(v)) el.style.setProperty(p, "none", "important");
    });
  });
};

export const renderSlip = async (el) => {
  const opts = { scale: 2, backgroundColor: "#ffffff", useCORS: true, onclone: sanitizeClone };
  let lastErr = new Error("Gagal memuat html2canvas. Periksa koneksi internet.");
  for (const src of H2C_SOURCES) {
    try { const h2c = await loadH2C(src); return await h2c(el, opts); } catch (e) { lastErr = e; }
  }
  throw lastErr;
};
