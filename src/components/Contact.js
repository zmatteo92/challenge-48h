import React, { useState } from 'react';

function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.message) {
            setMessage('Message envoyé avec succès ! (Simulation)');
            setFormData({ name: '', email: '', message: '' });
        } else {
            setMessage('Veuillez remplir tous les champs.');
        }
    };

    return (
        <div>
            <h1>Contactez-nous</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Nom :</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                <label htmlFor="email">Email :</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                <label htmlFor="message">Message :</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                <button type="submit">Envoyer</button>
            </form>
            {message && <p className={message.includes('succès') ? 'success' : 'error'}>{message}</p>}
        </div>
    );
}

export default Contact;