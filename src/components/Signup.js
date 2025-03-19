import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserByUsername, getUserByEmail, addUser } from '../db/indexedDB';

function Signup({ onLogin }) {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Promise.all([getUserByUsername(formData.username), getUserByEmail(formData.email)]).then(([userByUsername, userByEmail]) => {
            if (userByUsername) {
                setError('Nom d’utilisateur déjà utilisé.');
                return;
            }
            if (userByEmail) {
                setError('Email déjà utilisé.');
                return;
            }
            if (!/\S+@\S+\.\S+/.test(formData.email)) {
                setError('Veuillez entrer un email valide.');
                return;
            }
            const newUser = { username: formData.username, email: formData.email, password: formData.password, isAdmin: false };
            addUser(newUser).then(() => {
                getUserByUsername(formData.username).then(user => {
                    onLogin(user);
                });
            });
        });
    };

    return (
        <div>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Nom d’utilisateur :</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <label htmlFor="password">Mot de passe :</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <button type="submit">S’inscrire</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Déjà un compte ? <Link to="/login">Connectez-vous ici</Link>.</p>
        </div>
    );
}

export default Signup;