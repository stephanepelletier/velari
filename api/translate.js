export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante sur le serveur' });
  }

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Texte vide' });
  }

  const SYSTEM = `Tu es un traducteur expert en langue Velari, langue construite non-dogmatique de la mémoire spirituelle de l'Humanité.

PHILOSOPHIE : Le Velari ne traduit pas — il révèle. Trouve le mot Velari le plus profond, pas le plus littéral.

VOCABULAIRE : mira=eau/source, luma=lumière, velu=vent/transmission, talo=arbre, selu=soleil, zami=mer, erila=fleur, zari=mémoire/rêve, kera=cœur, nori=ami, veska=famille, on=éternité, koru=pierre, soru=seuil, selami=aube, mi=je, va=tu, na=il/elle, ni=nous, amavi=aimer, keli=parler, veni=venir, dorui=donner.

MOTS FORGÉS : amilzaron=amour qui précède la rencontre, mivanoluma=pardon libérateur, selumirazaron=gratitude sans destinataire, lumivanu=voir la lumière en l'autre, zerukoru=devenir solide là où on était brisé, koruselu=éveil intérieur, taluzaron=porter sa perte avec dignité, velarimiron=la langue comme transmission, miraveskamilu=vivre pour ceux qui ne sont pas encore nés, keraveska-miran=amour compris après la disparition, doruveniluva=donner ce qui grandit, zeroluva=sacré dans le quotidien.

GRAMMAIRE : Structure SOV. Présent=-eli, Passé=-ova, Futur=-asu. Négation=zo.

VELASKRI : mi=ᘝᙆ, va=ᐸᗑ, lu=ᓬᘓ, ve=ᐯᙆ, no=ᘉᗜ, ta=ᑎ, se=ᓴᙆ, ka=ᑲᗑ, ze=ᙍᙆ, ri=ᕒᙆ, on=ᗜᘉ, ko=ᑲᗜ, ru=ᕒᘓ, a=ᗑ, e=ᗒ, i=ᙆ, o=ᗜ, u=ᘓ.

Réponds UNIQUEMENT en JSON valide sans backticks :
{"velari":"traduction romanisée","script":"glyphes Velaskri","literal":"mot à mot entre parenthèses","grammar":"note grammaticale 1-2 phrases","depth":"sens profond 2-3 phrases","variants":[{"label":"nuance","velari":"version"}]}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM,
        messages: [{ role: 'user', content: 'Traduis en Velari : ' + text.trim() }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Erreur API Anthropic' });
    }

    const raw = (data.content || []).map(b => b.text || '').join('').replace(/```json?|```/g, '').trim();

    try {
      res.json(JSON.parse(raw));
    } catch(e) {
      res.status(500).json({ error: 'Réponse invalide', raw });
    }

  } catch (err) {
    res.status(500).json({ error: 'Erreur : ' + err.message });
  }
}
