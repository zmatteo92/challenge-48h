import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents, addEvent } from '../db/indexedDB';

function Admin({ currentUser }) {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', time: '', location: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser || !currentUser.isAdmin) {
            navigate('/login');
            return;
        }
        getAllEvents().then(events => {
            setEvents(events);
        });
    }, [currentUser, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEvent = { ...formData, createdBy: currentUser.id };
        addEvent(newEvent).then(() => {
            getAllEvents().then(updatedEvents => {
                setEvents(updatedEvents);
                setFormData({ title: '', description: '', date: '', time: '', location: '' });
            });
        });
    };

    return (
        <div>
            <h1>Page Administrateur</h1>
            <h2>Ajouter un Événement</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Titre :</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
                <label htmlFor="description">Description :</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
                <label htmlFor="date">Date :</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                <label htmlFor="time">Heure :</label>
                <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                <label htmlFor="location">Lieu :</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                <button type="submit">Ajouter</button>
            </form>
            <h2>Événements Existants</h2>
            <div className="events">
                {events.length > 0 ? (
                    events.map(event => (
                        <div className="event" key={event.id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Date :</strong> {event.date} à {event.time}</p>
                            <p><strong>Lieu :</strong> {event.location}</p>
                        </div>
                    ))
                ) : (
                    <p>Aucun événement pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Admin;