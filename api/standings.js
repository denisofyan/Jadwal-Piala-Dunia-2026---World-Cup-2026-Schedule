function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
}

function getApiKey() {
  return process.env.API_FOOTBALL_KEY || process.env.APISPORTS_KEY || process.env.X_APISPORTS_KEY;
}

async function callApi(path, query) {
  const key = getApiKey();
  if (!key) {
    return {
      status: 500,
      body: { errors: { env: 'Missing API_FOOTBALL_KEY in Vercel Environment Variables' }, response: [] }
    };
  }

  const qs = new URLSearchParams(query).toString();
  const url = `https://v3.football.api-sports.io/${path}?${qs}`;
  const upstream = await fetch(url, {
    headers: { 'x-apisports-key': key },
  });

  let body;
  try { body = await upstream.json(); }
  catch (_) { body = { errors: { upstream: 'Invalid JSON from API-Football' }, response: [] }; }

  return { status: upstream.status, body };
}

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ errors: { method: 'GET only' }, response: [] });

  try {
    const league = req.query.league || '1';
    const season = req.query.season || '2026';
    const result = await callApi('standings', { league, season });
    return res.status(result.status).json(result.body);
  } catch (e) {
    return res.status(502).json({ errors: { proxy: e.message || 'Proxy error' }, response: [] });
  }
};
