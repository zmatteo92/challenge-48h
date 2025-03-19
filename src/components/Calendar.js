import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../db/indexedDB';

function Calendar({ currentUser }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);

    useEffect(() => {
        setLoading(true);
        getAllEvents()
            .then(events => {
                setEvents(events);
                setLoading(false);
            })
            .catch(err => {
                console.error('Erreur lors du chargement des événements:', err);
                setError('Une erreur est survenue lors du chargement des événements.');
                setLoading(false);
            });
    }, []);

    // Fonction pour générer les jours du mois
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 1);
        const days = [];
        while (date.getMonth() === month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    // Fonction pour obtenir le premier jour du mois (pour l'alignement)
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Fonction pour naviguer entre les mois
    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
        setSelectedDate(null);
        setSelectedEvents([]);
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
        setSelectedDate(null);
        setSelectedEvents([]);
    };

    // Générer les jours du mois actuel
    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    // Fonction pour vérifier si un jour a des événements
    const hasEvents = (date) => {
        return events.some(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Fonction pour gérer le clic sur un jour
    const handleDayClick = (date) => {
        setSelectedDate(date);
        const dayEvents = events.filter(event => {
            const eventDate = new Date(event.date);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
        setSelectedEvents(dayEvents);
    };

    return (
        <div>
            <h1>Calendrier des Événements</h1>
            {loading ? (
                <p>Chargement des événements...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="calendar-container">
                    <div className="calendar-header">
                        <button onClick={prevMonth} className="calendar-nav-btn">
                            ← Précédent
                        </button>
                        <h2>
                            {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <button onClick={nextMonth} className="calendar-nav-btn">
                            Suivant →
                        </button>
                    </div>
                    <div className="calendar-grid">
                        <div className="calendar-day-header">Dim</div>
                        <div className="calendar-day-header">Lun</div>
                        <div className="calendar-day-header">Mar</div>
                        <div className="calendar-day-header">Mer</div>
                        <div className="calendar-day-header">Jeu</div>
                        <div className="calendar-day-header">Ven</div>
                        <div className="calendar-day-header">Sam</div>
                        {/* Ajouter des cases vides pour aligner le premier jour */}
                        {Array.from({ length: firstDay }).map((_, index) => (
                            <div key={`empty-${index}`} className="calendar-day empty"></div>
                        ))}
                        {/* Afficher les jours du mois */}
                        {daysInMonth.map((day, index) => (
                            <div
                                key={index}
                                className={`calendar-day ${
                                    hasEvents(day) ? 'has-events' : ''
                                } ${
                                    selectedDate &&
                                    selectedDate.getDate() === day.getDate() &&
                                    selectedDate.getMonth() === day.getMonth() &&
                                    selectedDate.getFullYear() === day.getFullYear()
                                        ? 'selected'
                                        : ''
                                }`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day.getDate()}
                            </div>
                        ))}
                    </div>
                    {/* Afficher les événements du jour sélectionné */}
                    {selectedDate && (
                        <div className="selected-date-events">
                            <h3>
                                Événements du{' '}
                                {selectedDate.toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </h3>
                            {selectedEvents.length > 0 ? (
                                <div className="events">
                                    {selectedEvents.map(event => (
                                        <div className="event" key={event.id}>
                                            <h3>{event.title}</h3>
                                            <p>{event.description}</p>
                                            <p><strong>Heure :</strong> {event.time}</p>
                                            <p><strong>Lieu :</strong> {event.location}</p>
                                            <p><strong>Catégorie :</strong> {event.category}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Aucun événement pour ce jour.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Calendar;