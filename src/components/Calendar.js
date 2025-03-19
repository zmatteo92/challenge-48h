import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../db/indexedDB';

function Calendar({ currentUser }) {
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		getAllEvents()
			.then(events => {
				const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
				setEvents(sortedEvents);
				setLoading(false);
			})
			.catch(err => {
				console.error('Erreur lors du chargement des événements:', err);
				setError('Une erreur est survenue lors du chargement des événements.');
				setLoading(false);
			});
	}, []);

	return (
		<div>
			<h1>Calendrier des Événements</h1>
			{loading ? (
				<p>Chargement des événements...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				<div className="events">
					{events.length > 0 ? (
						events.map(event => (
							<div className="event" key={event.id}>
								<h3>{event.title}</h3>
								<p>{event.description}</p>
								<p><strong>Date :</strong> {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</p>
								<p><strong>Lieu :</strong> {event.location}</p>
								<p><strong>Catégorie :</strong> {event.category}</p>
							</div>
						))
					) : (
						<p>Aucun événement pour le moment.</p>
					)}
				</div>
			)}
		</div>
	);
}

export default Calendar;