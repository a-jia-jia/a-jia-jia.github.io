// 公开排行榜后端：给舞台跑酷（runner）和叠舞台（stack）用。
// 部署在 Netlify Functions，成绩存在 Netlify Blobs 里（免费套餐可用）。
// 前端约定（见 leaderboard-ui.js）：
//   GET  /.netlify/functions/leaderboard?game=runner  -> { scores: [{ name, score }] }（前 10 名）
//   POST /.netlify/functions/leaderboard  body { game, playerId, name, score } -> { scores: [...] }
// 每个人只保留最高纪录；返回的成绩里不带 playerId。

'use strict';

const { getStore } = require('@netlify/blobs');

const GAMES = ['runner', 'stack'];
const MAX_ENTRIES = 10;
const MAX_NAME_LENGTH = 12;

function json(statusCode, data) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(data),
  };
}

function keyFor(game) {
  return `scores:${game}`;
}

function toTopList(entries) {
  return entries
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
    .map(({ name, score }) => ({ name, score }));
}

async function loadScores(store, game) {
  const data = await store.get(keyFor(game), { type: 'json' });
  return Array.isArray(data) ? data : [];
}

exports.handler = async (event) => {
  try {
    const store = getStore('leaderboard');

    if (event.httpMethod === 'GET') {
      const game = event.queryStringParameters && event.queryStringParameters.game;
      if (!GAMES.includes(game)) {
        return json(400, { error: 'invalid game' });
      }
      const entries = await loadScores(store, game);
      return json(200, { scores: toTopList(entries) });
    }

    if (event.httpMethod === 'POST') {
      let body;
      try {
        body = JSON.parse(event.body || '{}');
      } catch {
        return json(400, { error: 'invalid json' });
      }
      const game = body.game;
      const playerId = typeof body.playerId === 'string' ? body.playerId.trim() : '';
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      const score = body.score;

      if (!GAMES.includes(game)) return json(400, { error: 'invalid game' });
      if (!playerId || playerId.length > 128) return json(400, { error: 'invalid playerId' });
      if (!name || name.length > MAX_NAME_LENGTH) return json(400, { error: 'invalid name' });
      if (!Number.isInteger(score) || score < 0 || score > 1000000000) {
        return json(400, { error: 'invalid score' });
      }

      const entries = await loadScores(store, game);
      const existing = entries.find((entry) => entry.playerId === playerId);
      if (existing) {
        // 只保留个人最高纪录，名字以最新一次提交为准
        if (score > existing.score) existing.score = score;
        existing.name = name;
      } else {
        entries.push({ playerId, name, score });
      }
      await store.setJSON(keyFor(game), entries);
      return json(200, { scores: toTopList(entries) });
    }

    return json(405, { error: 'method not allowed' });
  } catch (error) {
    console.error('leaderboard error:', error);
    return json(500, { error: 'unavailable' });
  }
};
