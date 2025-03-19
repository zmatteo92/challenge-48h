import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByUsername } from '../db/indexedDB';

function Login({ onLogin }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		getUserByUsername(username)
			.then(user => {
				if (user && user.password === password) {
					onLogin(user);
					navigate('/');
				} else {
					setError('Nom d\'utilisateur ou mot de passe incorrect.');
				}
			})
			.catch(err => {
				console.error('Erreur lors de la connexion:', err);
				setError('Une erreur est survenue lors de la connexion.');
			});
	};

	return (
		<div>
			<h1>Connexion</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Nom d'utilisateur :</label>
				<input
					type="text"
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<label htmlFor="password">Mot de passe :</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Se connecter</button>
			</form>
			{error && <p className="error">{error}</p>}
		</div>
	);
}

export default Login;