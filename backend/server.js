const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt'); 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connexion à SQLite 
const db = new Database('/mnt/data/database.sqlite', { verbose: console.log });

// Création de la table 
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Test du backend
app.get('/', (req, res) => {
  res.send('Backend fonctionne parfaitement 🎉');
});

// Route pour l'inscription 
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    console.error('Erreur d\'inscription:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route pour la connexion 
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ username: user.username, email: user.email });
    } else {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// (serveur)
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
