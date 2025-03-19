import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { getAllEvents } from '../db/indexedDB';

function Calendar({ currentUser }) {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        getAllEvents().then(events => {
            const calendarEvents = events.map(event => ({
                title: event.title,
                start: `${event.date}T${event.time}`,
                end: `${event.date}T${event.time}`,
                description: event.description,
                location: event.location
            }));
            setEvents(calendarEvents);
        });
    }, [currentUser, navigate]);

    const handleEventClick = (info) => {
        alert(`Événement : ${info.event.title}\nDescription : ${info.event.extendedProps.description}\nLieu : ${info.event.extendedProps.location}`);
    };

    return (
        <div>
            <h1>Calendrier des Événements</h1>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
            />
        </div>
    );
}

export default Calendar;