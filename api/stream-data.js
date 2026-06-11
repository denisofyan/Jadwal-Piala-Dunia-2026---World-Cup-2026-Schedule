export default function handler(req, res) {
  const raw = process.env.STREAM_DATA || '{}';
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(raw);
}
