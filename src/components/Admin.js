import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from '../db/indexedDB';

function Admin({ currentUser }) {
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		date: '',
		time: '',
		location: '',
		category: ''
	});
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	if (!currentUser || !currentUser.isAdmin) {
		navigate('/');
		return null;
	}

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.category) {
			setError('Veuillez remplir tous les champs.');
			return;
		}
		addEvent({ ...formData, createdBy: currentUser.id })
			.then(() => {
				setSuccess('Événement ajouté avec succès !');
				setError('');
				setFormData({ title: '', description: '', date: '', time: '', location: '', category: '' });
			})
			.catch(err => {
				console.error('Erreur lors de l\'ajout de l\'événement:', err);
				setError('Une erreur est survenue lors de l\'ajout de l\'événement.');
				setSuccess('');
			});
	};

	return (
		<div>
			<h1>Administration</h1>
			<h2>Ajouter un Événement</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">Titre :</label>
				<input
					type="text"
					id="title"
					name="title"
					value={formData.title}
					onChange={handleChange}
				/>
				<label htmlFor="description">Description :</label>
				<textarea
					id="description"
					name="description"
					value={formData.description}
					onChange={handleChange}
				/>
				<label htmlFor="date">Date :</label>
				<input
					type="date"
					id="date"
					name="date"
					value={formData.date}
					onChange={handleChange}
				/>
				<label htmlFor="time">Heure :</label>
				<input
					type="time"
					id="time"
					name="time"
					value={formData.time}
					onChange={handleChange}
				/>
				<label htmlFor="location">Lieu :</label>
				<input
					type="text"
					id="location"
					name="location"
					value={formData.location}
					onChange={handleChange}
				/>
				<label htmlFor="category">Catégorie :</label>
				<select id="category" name="category" value={formData.category} onChange={handleChange}>
					<option value="">Sélectionnez une catégorie</option>
					<option value="Sport">Sport</option>
					<option value="E-Sport">E-Sport</option>
					<option value="Event">Événement</option>
				</select>
				<button type="submit">Ajouter</button>
			</form>
			{success && <p className="success">{success}</p>}
			{error && <p className="error">{error}</p>}
		</div>
	);
}

export default Admin;