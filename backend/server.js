const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const app = express();
// Choisis un port distinct de celui de React (3000 par défaut)
// Ex. 5001 pour éviter les conflits.
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
// Assure-toi que ./database.sqlite existe OU sera créé dans backend/
const db = new Database('./database.sqlite');

// Création de la table users si elle n'existe pas
// (username et email en UNIQUE, password haché dans la colonne password)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Route de test
app.get('/', (req, res) => {
  res.send('Backend fonctionne parfaitement 🎉');
});

// Route d'inscription
app.post('/api/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // On hache le mot de passe avant de stocker
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    stmt.run(username, email, hashedPassword);

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (err) {
    console.error("Erreur d'inscription:", err);
    res.status(400).json({ error: err.message });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // On récupère l'utilisateur depuis la DB par email
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    // compare le password haché
    if (user && await bcrypt.compare(password, user.password)) {
      // Succès : renvoie user info (sans password)
      res.status(200).json({ username: user.username, email: user.email });
    } else {
      // Erreur authentification
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    console.error('Erreur de connexion:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur http://localhost:${PORT}`);
});
