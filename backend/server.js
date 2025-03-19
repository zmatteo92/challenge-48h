const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Connexion à SQLite
const db = new Database('./database/database.sqlite');

// Crée la table des utilisateurs si elle n'existe pas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )
`);

// Route racine pour tester
app.get('/', (req, res) => {
  res.send('Backend fonctionne parfaitement 🎉');
});

// Route pour l'inscription
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  try {
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, password);
    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
