# ᐯᙆᓬᗑᕒᙆ Velari — Guide d'installation

Langue non-dogmatique de la mémoire spirituelle de l'Humanité.
Application locale avec traducteur IA intégré.

---

## Ce dont tu as besoin

- **Node.js** (version 18 ou supérieure)
  → Télécharge sur https://nodejs.org (bouton "LTS")
- **Une clé API Anthropic**
  → Crée un compte sur https://console.anthropic.com
  → Va dans "API Keys" et crée une nouvelle clé

---

## Installation — 4 étapes

### Étape 1 — Ouvre un terminal

**Sur Mac :**
- Appuie sur `Cmd + Espace`, tape "Terminal", Entrée

**Sur Windows :**
- Appuie sur `Win + R`, tape "powershell", Entrée

---

### Étape 2 — Va dans le dossier de l'application

```bash
cd chemin/vers/velari-app
```

Par exemple, si tu as mis le dossier sur ton Bureau :
```bash
# Mac
cd ~/Desktop/velari-app

# Windows
cd C:\Users\TonNom\Desktop\velari-app
```

---

### Étape 3 — Configure ta clé API

Copie le fichier `.env.example` en `.env` :

```bash
# Mac / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Puis ouvre `.env` dans un éditeur de texte (Notepad, TextEdit...)
et remplace `sk-ant-METS-TA-CLÉ-ICI` par ta vraie clé API :

```
ANTHROPIC_API_KEY=sk-ant-api03-TAVRAIECLE...
```

**Important :** ne partage jamais ce fichier `.env` — il contient ta clé privée.

---

### Étape 4 — Installe et lance

```bash
# Installe les dépendances (une seule fois)
npm install

# Lance le serveur
npm start
```

Tu verras s'afficher :

```
  ᐯᙆᓬᗑᕒᙆ  Velari — Serveur démarré
  ─────────────────────────────────
  Ouvre ton navigateur sur :
  http://localhost:3000
```

**Ouvre ton navigateur et va sur : http://localhost:3000**

---

## Utilisation

### Dictionnaire
Recherche par mot, sens, tradition ou vécu.
Filtre par pilier. Chaque fiche contient le sens complet.

### Traducteur
Entre une phrase en français, anglais ou espagnol.
Appuie sur "Traduire" ou `Ctrl + Entrée`.
Tu obtiens : traduction romanisée, Velaskri, sens profond, variantes.

### Architecture
Schéma animé interactif — clique sur chaque nœud.

### À propos
La philosophie complète du Velari.

---

## Arrêter le serveur

Dans le terminal, appuie sur `Ctrl + C`.

## Relancer

```bash
npm start
```

---

## Structure du projet

```
velari-app/
├── server.js          ← Le serveur (ne pas modifier)
├── package.json       ← Dépendances
├── .env               ← Ta clé API (privé, ne pas partager)
├── .env.example       ← Modèle
└── public/
    └── index.html     ← L'application complète
```

---

## En cas de problème

**"command not found: node"**
→ Node.js n'est pas installé. Va sur https://nodejs.org

**"Error: Cannot find module 'express'"**
→ Lance d'abord `npm install`

**"Erreur : Clé API manquante"**
→ Vérifie que le fichier `.env` existe et contient ta clé

**"Port 3000 already in use"**
→ Modifie le `.env` : ajoute `PORT=3001` et ouvre http://localhost:3001

---

*Ni velarimiron miraveskamilu.*
*Nous créons cette langue pour ceux qui n'existent pas encore.*
