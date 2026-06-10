function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function fetchJson(url) {
  const upstream = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'WorldCup2026Schedule/1.0'
    }
  });

  let body;
  try {
    body = await upstream.json();
  } catch (_) {
    throw new Error(`Invalid JSON from ${url}`);
  }

  if (!upstream.ok) {
    throw new Error(`${url} HTTP ${upstream.status}`);
  }

  return body;
}

function buildTeamMap(teams) {
  const map = {};

  (teams || []).forEach((team) => {
    map[String(team.id)] = {
      id: String(team.id),
      name: team.name_en || '',
      flag: team.flag || '',
      fifaCode: team.fifa_code || '',
      iso2: team.iso2 || '',
      group: team.groups || ''
    };
  });

  return map;
}

function normalizeStandings(groups, teamMap) {
  const result = {};

  (groups || []).forEach((group) => {
    const groupName = String(group.name || '').toUpperCase();
    if (!groupName) return;

    result[groupName] = (group.teams || []).map((row) => {
      const team = teamMap[String(row.team_id)] || {};

      return {
        id: String(row.team_id || ''),
        name: team.name || '',
        flag: team.flag || '',
        fifaCode: team.fifaCode || '',
        iso2: team.iso2 || '',
        group: groupName,

        m: toNumber(row.mp),
        w: toNumber(row.w),
        d: toNumber(row.d),
        l: toNumber(row.l),
        gf: toNumber(row.gf),
        ga: toNumber(row.ga),
        gd: toNumber(row.gd),
        pts: toNumber(row.pts)
      };
    });
  });

  return result;
}

async function callWorldCupStandings() {
  const [groupsBody, teamsBody] = await Promise.all([
    fetchJson('https://worldcup26.ir/get/groups'),
    fetchJson('https://worldcup26.ir/get/teams')
  ]);

  const groups = Array.isArray(groupsBody.groups) ? groupsBody.groups : [];
  const teams = Array.isArray(teamsBody.teams) ? teamsBody.teams : [];
  const teamMap = buildTeamMap(teams);
  const standings = normalizeStandings(groups, teamMap);

  return {
    status: 200,
    body: {
      get: 'standings',
      parameters: {
        league: '1',
        season: '2026'
      },
      errors: {},
      results: Object.keys(standings).length,
      response: standings,
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
      response: {}
    });
  }

  try {
    const result = await callWorldCupStandings();
    return res.status(result.status).json(result.body);
  } catch (e) {
    return res.status(502).json({
      errors: {
        proxy: e.message || 'Proxy error'
      },
      response: {}
    });
  }
};
