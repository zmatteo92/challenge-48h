import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents, getEventParticipantsByUser, addEventParticipant } from '../db/indexedDB';

function Events({ currentUser }) {
    const [events, setEvents] = useState([]);
    const [userParticipations, setUserParticipations] = useState([]);
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        Promise.all([getAllEvents(), getEventParticipantsByUser(currentUser.id)]).then(([events, participations]) => {
            setEvents(events);
            setUserParticipations(participations.map(p => p.eventId));
        });
    }, [currentUser, navigate]);

    const handleRegister = (eventId) => {
        if (userParticipations.includes(eventId)) {
            alert('Vous êtes déjà inscrit à cet événement.');
            return;
        }
        const participant = { userId: currentUser.id, eventId };
        addEventParticipant(participant).then(() => {
            setUserParticipations([...userParticipations, eventId]);
        });
    };

    const filteredEvents = filter === 'All' ? events : events.filter(event => event.category === filter);

    return (
        <div>
            <h1>Événements</h1>
            <div className="filter">
                <label>Filtrer par catégorie : </label>
                <select onChange={(e) => setFilter(e.target.value)} value={filter}>
                    <option value="All">Tous</option>
                    <option value="Sport">Sport</option>
                    <option value="E-Sport">E-Sport</option>
                    <option value="Event">Événement</option>
                </select>
            </div>
            <div className="events">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <div className="event" key={event.id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <p><strong>Date :</strong> {event.date} à {event.time}</p>
                            <p><strong>Lieu :</strong> {event.location}</p>
                            <p><strong>Catégorie :</strong> {event.category}</p>
                            {userParticipations.includes(event.id) ? (
                                <p>Vous êtes déjà inscrit à cet événement.</p>
                            ) : (
                                <button className="btn" onClick={() => handleRegister(event.id)}>S’inscrire</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Aucun événement pour le moment.</p>
                )}
            </div>
        </div>
    );
}

export default Events;