const toMin = (h, m) => h * 60 + m;

export function parseLog(text, tolPas) {
  const out = [];
  const re = /(\d{1,2})[:.](\d{2})/g;
  let m;
  while ((m = re.exec(text))) {
    const h = +m[1], mi = +m[2];
    if (h > 23 || mi > 59) continue;
    const t = toMin(h, mi);
    const shift = t < 600 ? "Pagi" : "Siang";
    const late = shift === "Pagi" ? (tolPas ? t >= 420 : t > 420) : t >= 720;
    out.push({ label: `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`, shift, late });
  }
  return out;
}
