export default function handler(req, res) {
  const raw = process.env.STREAM_DATA || '{}';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  try {
    const parsed = JSON.parse(raw);
    res.end(JSON.stringify(parsed));
  } catch(e) {
    console.error('[stream-data] STREAM_DATA bukan JSON valid:', e.message);
    res.end('{}');
  }
}
