import React, { useState } from 'react';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Inscription réussie ! 🎉');
      } else {
        alert('Erreur : ' + data.error);
      }
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Nom d'utilisateur" onChange={handleChange} required />
      <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
      <input name="password" placeholder="Mot de passe" type="password" onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
}

export default Signup;
