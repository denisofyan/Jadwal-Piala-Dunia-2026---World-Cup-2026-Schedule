function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
}

function toNumberOrNull(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim().toLowerCase();
  if (!s || s === 'null' || s === 'undefined') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function isFinished(value) {
  return String(value || '').toUpperCase() === 'TRUE';
}

function mapStatus(game) {
  const finished = isFinished(game.finished);
  const elapsedRaw = String(game.time_elapsed || '').toLowerCase();

  if (finished) {
    return {
      short: 'FT',
      long: 'Match Finished',
      elapsed: 90
    };
  }

  if (
    elapsedRaw &&
    elapsedRaw !== 'notstarted' &&
    elapsedRaw !== 'not_started' &&
    elapsedRaw !== 'null'
  ) {
    const elapsed = parseInt(elapsedRaw, 10);
    return {
      short: 'LIVE',
      long: 'In Play',
      elapsed: Number.isFinite(elapsed) ? elapsed : null
    };
  }

  return {
    short: 'NS',
    long: 'Not Started',
    elapsed: null
  };
}

function normalizeGame(game) {
  const status = mapStatus(game);
  const started = status.short !== 'NS';

  const homeScore = started ? toNumberOrNull(game.home_score) : null;
  const awayScore = started ? toNumberOrNull(game.away_score) : null;

  return {
    fixture: {
      id: Number(game.id) || game.id,
      date: game.local_date || null,
      status
    },
    league: {
      id: 1,
      name: 'FIFA World Cup',
      season: 2026,
      round: game.type === 'group'
        ? `Group ${game.group}`
        : String(game.group || game.type || '')
    },
    teams: {
      home: {
        id: game.home_team_id || null,
        name: game.home_team_name_en || ''
      },
      away: {
        id: game.away_team_id || null,
        name: game.away_team_name_en || ''
      }
    },
    goals: {
      home: homeScore,
      away: awayScore
    },
    score: {
      halftime: {
        home: null,
        away: null
      },
      fulltime: {
        home: isFinished(game.finished) ? homeScore : null,
        away: isFinished(game.finished) ? awayScore : null
      }
    },
    worldcup26: {
      id: game.id,
      group: game.group,
      matchday: game.matchday,
      type: game.type,
      stadium_id: game.stadium_id,
      raw_status: game.time_elapsed,
      source: 'worldcup26.ir'
    }
  };
}

async function callWorldCupApi() {
  const upstream = await fetch('https://worldcup26.ir/get/games', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'WorldCup2026Schedule/1.0'
    }
  });

  let body;
  try {
    body = await upstream.json();
  } catch (_) {
    return {
      status: 502,
      body: {
        errors: { upstream: 'Invalid JSON from worldcup26.ir' },
        response: []
      }
    };
  }

  if (!upstream.ok) {
    return {
      status: upstream.status,
      body: {
        errors: { upstream: `worldcup26.ir HTTP ${upstream.status}` },
        response: []
      }
    };
  }

  const games = Array.isArray(body.games) ? body.games : [];

  return {
    status: 200,
    body: {
      get: 'fixtures',
      parameters: {
        league: '1',
        season: '2026'
      },
      errors: {},
      results: games.length,
      paging: {
        current: 1,
        total: 1
      },
      response: games.map(normalizeGame),
      source: 'worldcup26.ir'
    }
  };
}

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      errors: { method: 'GET only' },
      response: []
    });
  }

  try {
    const result = await callWorldCupApi();
    return res.status(result.status).json(result.body);
  } catch (e) {
    return res.status(502).json({
      errors: {
proxy: e.message || 'Proxy error'
      },
      response: []
    });
  }
};
