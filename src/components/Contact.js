import React, { useState } from 'react';

function Contact() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		message: ''
	});
	const [success, setSuccess] = useState('');
	const [error, setError] = useState('');

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.message) {
			setError('Veuillez remplir tous les champs.');
			return;
		}
		setError('');
		setSuccess('Message envoyé avec succès !');
		setFormData({ name: '', email: '', message: '' });
	};

	return (
		<div>
			<h1>Contactez-nous</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="name">Nom :</label>
				<input
					type="text"
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
				/>
				<label htmlFor="email">Email :</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
				/>
				<label htmlFor="message">Message :</label>
				<textarea
					id="message"
					name="message"
					value={formData.message}
					onChange={handleChange}
				/>
				<button type="submit">Envoyer</button>
			</form>
			{success && <p className="success">{success}</p>}
			{error && <p className="error">{error}</p>}
		</div>
	);
}

export default Contact;