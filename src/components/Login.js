import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserByUsername } from '../db/indexedDB';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        getUserByUsername(formData.username).then(user => {
            if (user && user.password === formData.password) {
                onLogin(user);
            } else {
                setError('Nom d’utilisateur ou mot de passe incorrect.');
            }
        });
    };

    return (
        <div>
            <h1>Connexion</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Nom d’utilisateur :</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
                <label htmlFor="password">Mot de passe :</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Se connecter</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p>Pas de compte ? <Link to="/signup">Inscrivez-vous ici</Link>.</p>
        </div>
    );
}

export default Login;