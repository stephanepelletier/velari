module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'Clé API manquante' });
  const text = (req.body && req.body.text) ? req.body.text : '';
  if (!text.trim()) return res.status(400).json({ error: 'Texte vide' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Tu es traducteur Velari. Reponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou apres, sans backticks, sans markdown. Format exact: {"velari":"traduction","script":"glyphes","literal":"mot a mot","grammar":"note","depth":"sens profond","variants":[{"label":"variante","velari":"version"}]}',
        messages: [{ role: 'user', content: 'Traduis en Velari : ' + text.trim() }]
      })
    });
    const d = await r.json();
    if (d.error) return res.status(500).json({ error: d.error.message });
    let raw = (d.content || []).map(b => b.text || '').join('').trim();
    raw = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start === -1 || end === -1) return res.status(500).json({ error: 'Format invalide', raw });
    raw = raw.slice(start, end + 1);
    res.json(JSON.parse(raw));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
};
