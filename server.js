const express = require('express');
const path = require('path');
const fs = require('fs');

// Load env
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── TRANSLATE ENDPOINT ──
app.post('/api/translate', async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante. Vérifiez votre fichier .env' });
  }

  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Texte vide' });
  }

  const SYSTEM = `Tu es un traducteur expert en langue Velari, langue construite non-dogmatique de la mémoire spirituelle de l'Humanité.

PHILOSOPHIE : Le Velari ne traduit pas — il révèle. Chaque phrase française cache une vérité que le Velari nomme plus justement. Trouve le mot Velari le plus profond, pas le plus littéral.

VOCABULAIRE ESSENTIEL :
Racines : mira=eau/source, luma=lumière, velu=vent/transmission, talo=arbre/enracinement, selu=soleil, zami=mer/immensité, erila=fleur, zari=mémoire/rêve, kera=cœur, nori=ami, veska=famille/communauté, on=éternité, koru=pierre/solidité, soru=seuil, selami=aube, talovi=tristesse qui révèle, noreli=marcher ensemble
Pronoms : mi=je, va=tu, na=il/elle, ni=nous
Verbes : amavi=aimer, keli=parler, veni=venir/revenir, dorui=donner, okuli=voir, zarivi=rêver, selumi=sourire, velomi=s'adresser à l'immensité
Temps : présent=-eli, passé=-ova, futur=-asu. Négation=zo avant verbe.
Suffixe zaron=depuis avant le temps. Suffixe on=éternité.

MOTS CLÉS FORGÉS :
amilzaron=amour qui précède la rencontre, mivanoluma=pardon libérateur, selumirazaron=gratitude sans destinataire, lumivanu=voir la lumière en l'autre, zerukoru=devenir solide là où on était brisé, koruselu=éveil intérieur irréversible, taluzaron=porter sa perte avec dignité, velarimiron=la langue elle-même comme transmission, miraveskamilu=vivre pour ceux qui ne sont pas encore nés, keraveska-miran=amour compris après la disparition, doruveniluva=donner ce qui grandit en étant donné, zeroluva=sacré dans le quotidien, miluvenikoru=chaque lumière allumée par une autre, veluzarinomi=le silence dans l'œuvre

GRAMMAIRE :
Structure SOV (Sujet-Objet-Verbe). Tiret mi-va pour relation directe entre deux êtres. Le mot le plus long encode l'engagement le plus profond.

VELASKRI (écriture syllabique) :
mi=ᘝᙆ, va=ᐸᗑ, na=ᐣ, ni=ᘉᙆ, lu=ᓬᘓ, ma=ᘝᗑ, ra=ᖇ, ve=ᐯᙆ, no=ᘉᗜ, ta=ᑎ, se=ᓴᙆ, ka=ᑲᗑ, ze=ᙍᙆ, ri=ᕒᙆ, lo=ᓬᗜ, ko=ᑲᗜ, ru=ᕒᘓ, te=ᑎᗒ, a=ᗑ, e=ᗒ, i=ᙆ, o=ᗜ, u=ᘓ, on=ᗜᘉ, za=ᙍᗑ, li=ᓬᙆ, mi=ᘝᙆ, am=ᗑᘝ, el=ᗒᓬ, vi=ᐯᙆ, ro=ᕒᗜ, la=ᓬᗑ, sa=ᓴᗑ, to=ᑎᗜ, do=ᑎᗜ, vo=ᐯᗜ

Réponds UNIQUEMENT en JSON valide, sans backticks, sans commentaires :
{
  "velari": "traduction romanisée complète",
  "script": "traduction en Velaskri (quelques glyphes clés)",
  "literal": "traduction mot à mot entre parenthèses",
  "grammar": "note grammaticale 1-2 phrases sur la structure choisie",
  "depth": "sens profond 2-3 phrases — ce que le Velari dit que le français ne peut pas",
  "variants": [
    {"label": "nuance courte", "velari": "version courte"},
    {"label": "nuance complète", "velari": "version développée"}
  ]
}`;

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
      return res.status(500).json({ error: data.error.message || 'Erreur API' });
    }

    const raw = (data.content || []).map(b => b.text || '').join('').replace(/```json?|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return res.status(500).json({ error: 'Réponse invalide de l\'API', raw });
    }

    res.json(parsed);

  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur : ' + err.message });
  }
});

// ── WORDS ENDPOINT (pour extensions futures) ──
app.get('/api/words', (req, res) => {
  res.json({ count: 'voir le frontend' });
});

// ── CATCH ALL → index.html ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log('');
  console.log('  ᐯᙆᓬᗑᕒᙆ  Velari — Serveur démarré');
  console.log('  ─────────────────────────────────');
  console.log(`  Ouvre ton navigateur sur :`);
  console.log(`  http://localhost:${PORT}`);
  console.log('');
  if (!API_KEY) {
    console.log('  ⚠  Clé API manquante — crée un fichier .env');
    console.log('     avec ANTHROPIC_API_KEY=sk-ant-...');
    console.log('');
  }
});
