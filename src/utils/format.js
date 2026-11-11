export const rp = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");

export const num = (v) => (isNaN(Number(v)) ? 0 : Number(v));

export const uid = () => Math.random().toString(36).slice(2, 9);
