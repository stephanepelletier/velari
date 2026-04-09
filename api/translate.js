module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Clé API manquante' });
  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Texte vide' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system: 'Tu es traducteur Velari. Reponds UNIQUEMENT en JSON valide sans backticks: {"velari":"...","script":"...","literal":"...","grammar":"...","depth":"...","variants":[{"label":"...","velari":"..."}]}', messages: [{ role: 'user', content: 'Traduis en Velari : ' + text }] })
    });
    const d = await r.json();
    if (d.error) return res.status(500).json({ error: d.error.message });
    const raw = (d.content||[]).map(b=>b.text||'').join('').replace(/```json?|```/g,'').trim();
    res.json(JSON.parse(raw));
  } catch(e) { res.status(500).json({ error: e.message }); }
};
