export default function handler(req, res) {
  const raw = process.env.STREAM_DATA || '{}';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const parsed = JSON.parse(raw);
    // Kalau isinya { "streams": {...} }, ambil bagian dalamnya saja
    // Kalau sudah flat { "Tim1|Tim2": {...} }, kirim langsung
    const links = parsed.streams || parsed;
    res.end(JSON.stringify(links));
  } catch(e) {
    console.error('[stream-data] STREAM_DATA bukan JSON valid:', e.message);
    res.end('{}');
  }
}
