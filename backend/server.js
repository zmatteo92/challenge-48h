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

// Route pour connexion des utilisateurs
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);

    if (user) {
      res.status(200).json({ username: user.username, email: user.email });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
