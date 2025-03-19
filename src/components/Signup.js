import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser, getUserByUsername, getUserByEmail } from '../db/indexedDB';

function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username || !email || !password) {
			setError('Veuillez remplir tous les champs.');
			return;
		}

		Promise.all([getUserByUsername(username), getUserByEmail(email)])
			.then(([userByUsername, userByEmail]) => {
				if (userByUsername) {
					setError('Ce nom d\'utilisateur est déjà pris.');
					return;
				}
				if (userByEmail) {
					setError('Cet email est déjà utilisé.');
					return;
				}
				addUser({ username, email, password, isAdmin: false })
					.then(() => {
						setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
						setError('');
						setTimeout(() => navigate('/login'), 2000);
					})
					.catch(err => {
						console.error('Erreur lors de l\'inscription:', err);
						setError('Une erreur est survenue lors de l\'inscription.');
					});
			})
			.catch(err => {
				console.error('Erreur lors de la vérification des données:', err);
				setError('Une erreur est survenue lors de la vérification des données.');
			});
	};

	return (
		<div>
			<h1>Inscription</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="username">Nom d'utilisateur :</label>
				<input
					type="text"
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<label htmlFor="email">Email :</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<label htmlFor="password">Mot de passe :</label>
				<input
					type="password"
					id="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">S'inscrire</button>
			</form>
			{success && <p className="success">{success}</p>}
			{error && <p className="error">{error}</p>}
		</div>
	);
}

export default Signup;