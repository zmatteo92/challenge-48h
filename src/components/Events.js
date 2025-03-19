import React, { useState, useEffect } from 'react';
import { getAllEvents, getEventParticipantsByUser, addEventParticipant } from '../db/indexedDB';

function Events({ currentUser }) {
	const [events, setEvents] = useState([]);
	const [userParticipations, setUserParticipations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState('');

	useEffect(() => {
		setLoading(true);
		getAllEvents()
			.then(events => {
				const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
				setEvents(sortedEvents);
				if (currentUser) {
					getEventParticipantsByUser(currentUser.id)
						.then(participations => {
							setUserParticipations(participations);
							setLoading(false);
						})
						.catch(err => {
							console.error('Erreur lors du chargement des participations:', err);
							setError('Une erreur est survenue lors du chargement de vos participations.');
							setLoading(false);
						});
				} else {
					setLoading(false);
				}
			})
			.catch(err => {
				console.error('Erreur lors du chargement des événements:', err);
				setError('Une erreur est survenue lors du chargement des événements.');
				setLoading(false);
			});
	}, [currentUser]);

	const handleParticipate = (eventId) => {
		if (!currentUser) {
			setError('Vous devez être connecté pour participer à un événement.');
			return;
		}

		addEventParticipant({ userId: currentUser.id, eventId })
			.then(() => {
				setUserParticipations([...userParticipations, { userId: currentUser.id, eventId }]);
				setSuccess('Inscription réussie !');
				setError('');
			})
			.catch(err => {
				console.error('Erreur lors de l\'inscription:', err);
				setError('Une erreur est survenue lors de l\'inscription.');
				setSuccess('');
			});
	};

	return (
		<div>
			<h1>Nos Événements</h1>
			{loading ? (
				<p>Chargement des événements...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				<>
					{success && <p className="success">{success}</p>}
					<div className="events">
						{events.length > 0 ? (
							events.map(event => (
								<div className="event" key={event.id}>
									<h3>{event.title}</h3>
									<p>{event.description}</p>
									<p><strong>Date :</strong> {new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</p>
									<p><strong>Lieu :</strong> {event.location}</p>
									<p><strong>Catégorie :</strong> {event.category}</p>
									{currentUser && (
										userParticipations.some(p => p.eventId === event.id) ? (
											<p>Vous êtes déjà inscrit à cet événement.</p>
										) : (
											<button onClick={() => handleParticipate(event.id)}>Participer</button>
										)
									)}
								</div>
							))
						) : (
							<p>Aucun événement pour le moment.</p>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Events;