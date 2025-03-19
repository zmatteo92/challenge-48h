$(document).ready(function() {
    let db;
    const request = indexedDB.open('bdsDB', 1);

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains('users')) {
            const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
            userStore.createIndex('username', 'username', { unique: true });
            userStore.createIndex('email', 'email', { unique: true });
        }
        if (!db.objectStoreNames.contains('teamMembers')) {
            db.createObjectStore('teamMembers', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('events')) {
            db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('eventParticipants')) {
            const participantStore = db.createObjectStore('eventParticipants', { keyPath: 'id', autoIncrement: true });
            participantStore.createIndex('userId_eventId', ['userId', 'eventId'], { unique: true });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;

        initializeDefaultData();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            $('#login-link').hide();
            $('#signup-link').hide();
            $('#logout-link').show();
            if (currentUser.isAdmin) {
                $('#admin-link').show();
            }
        }

        if ($('#team-members').length) {
            getAllTeamMembers().then(teamMembers => {
                let html = '';
                if (teamMembers.length > 0) {
                    teamMembers.forEach(member => {
                        html += `
                            <div class="member">
                                <h3>${member.name}</h3>
                                <p><strong>Rôle :</strong> ${member.role}</p>
                                <p>${member.description}</p>
                            </div>
                        `;
                    });
                } else {
                    html = '<p>Aucun membre pour le moment.</p>';
                }
                $('#team-members').html(html);
            });
        }

        $('#contact-form').on('submit', function(e) {
            e.preventDefault();
            const name = $('#name').val();
            const email = $('#email').val();
            const message = $('#message').val();
            if (name && email && message) {
                alert('Message envoyé avec succès ! (Simulation)');
                this.reset();
            } else {
                alert('Veuillez remplir tous les champs.');
            }
        });

        if ($('#calendar').length) {
            if (!currentUser) {
                window.location.href = 'login.html';
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
                $('#calendar').fullCalendar({
                    events: calendarEvents,
                    eventClick: function(event) {
                        alert(`Événement : ${event.title}\nDescription : ${event.description}\nLieu : ${event.location}`);
                    }
                });
            });
        }

        if ($('#events-list').length) {
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }
            Promise.all([getAllEvents(), getEventParticipantsByUser(currentUser.id)]).then(([events, userParticipations]) => {
                const userEventIds = userParticipations.map(p => p.eventId);
                let html = '';
                if (events.length > 0) {
                    events.forEach(event => {
                        const isRegistered = userEventIds.includes(event.id);
                        html += `
                            <div class="event">
                                <h3>${event.title}</h3>
                                <p>${event.description}</p>
                                <p><strong>Date :</strong> ${event.date} à ${event.time}</p>
                                <p><strong>Lieu :</strong> ${event.location}</p>
                                ${isRegistered ? '<p>Vous êtes déjà inscrit à cet événement.</p>' : `<a href="#" class="btn" onclick="registerForEvent(${event.id})">S’inscrire</a>`}
                            </div>
                        `;
                    });
                } else {
                    html = '<p>Aucun événement pour le moment.</p>';
                }
                $('#events-list').html(html);
            });
        }

        $('#login-form').on('submit', function(e) {
            e.preventDefault();
            const username = $('#username').val();
            const password = $('#password').val();
            getUserByUsername(username).then(user => {
                if (user && user.password === password) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = 'index.html';
                } else {
                    alert('Nom d’utilisateur ou mot de passe incorrect.');
                }
            });
        });

        $('#signup-form').on('submit', function(e) {
            e.preventDefault();
            const username = $('#username').val();
            const email = $('#email').val();
            const password = $('#password').val();

            Promise.all([getUserByUsername(username), getUserByEmail(email)]).then(([userByUsername, userByEmail]) => {
                if (userByUsername) {
                    alert('Nom d’utilisateur déjà utilisé.');
                    return;
                }
                if (userByEmail) {
                    alert('Email déjà utilisé.');
                    return;
                }
                if (!/\S+@\S+\.\S+/.test(email)) {
                    alert('Veuillez entrer un email valide.');
                    return;
                }
                const newUser = { username, email, password, isAdmin: false };
                addUser(newUser).then(() => {
                    getUserByUsername(username).then(user => {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        window.location.href = 'index.html';
                    });
                });
            });
        });

        if ($('#add-event-form').length) {
            if (!currentUser || !currentUser.isAdmin) {
                window.location.href = 'login.html';
                return;
            }
            getAllEvents().then(events => {
                let html = '';
                if (events.length > 0) {
                    events.forEach(event => {
                        html += `
                            <div class="event">
                                <h3>${event.title}</h3>
                                <p>${event.description}</p>
                                <p><strong>Date :</strong> ${event.date} à ${event.time}</p>
                                <p><strong>Lieu :</strong> ${event.location}</p>
                            </div>
                        `;
                    });
                } else {
                    html = '<p>Aucun événement pour le moment.</p>';
                }
                $('#admin-events-list').html(html);
            });

            $('#add-event-form').on('submit', function(e) {
                e.preventDefault();
                const title = $('#title').val();
                const description = $('#description').val();
                const date = $('#date').val();
                const time = $('#time').val();
                const location = $('#location').val();
                const newEvent = { title, description, date, time, location, createdBy: currentUser.id };
                addEvent(newEvent).then(() => {
                    window.location.reload();
                });
            });
        }
    };

    request.onerror = function(event) {
        console.error('Erreur IndexedDB:', event.target.errorCode);
    };


    function initializeDefaultData() {
        getAllUsers().then(users => {
            if (users.length === 0) {
                addUser({ username: 'admin', email: 'admin@bds.com', password: 'admin123', isAdmin: true });
            }
        });
        getAllTeamMembers().then(teamMembers => {
            if (teamMembers.length === 0) {
                addTeamMember({ name: 'Jean Dupont', role: 'Président', description: 'Responsable des activités sportives.' });
                addTeamMember({ name: 'Marie Martin', role: 'Trésorière', description: 'Gère les finances du BDS.' });
            }
        });
        getAllEvents().then(events => {
            if (events.length === 0) {
                addEvent({ title: 'Soirée Laser Game', description: 'Une soirée amusante au laser game.', date: '2025-04-01', time: '18:00', location: 'Paris', createdBy: 1 });
            }
        });
    }

    function addUser(user) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.add(user);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    function getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('username');
            const request = index.get(username);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const request = index.get(email);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function getAllUsers() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function addTeamMember(member) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['teamMembers'], 'readwrite');
            const store = transaction.objectStore('teamMembers');
            const request = store.add(member);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    function getAllTeamMembers() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['teamMembers'], 'readonly');
            const store = transaction.objectStore('teamMembers');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function addEvent(event) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['events'], 'readwrite');
            const store = transaction.objectStore('events');
            const request = store.add(event);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    function getAllEvents() {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['events'], 'readonly');
            const store = transaction.objectStore('events');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    function addEventParticipant(participant) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['eventParticipants'], 'readwrite');
            const store = transaction.objectStore('eventParticipants');
            const request = store.add(participant);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    function getEventParticipantsByUser(userId) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['eventParticipants'], 'readonly');
            const store = transaction.objectStore('eventParticipants');
            const request = store.getAll();
            request.onsuccess = () => {
                const participants = request.result.filter(p => p.userId === userId);
                resolve(participants);
            };
            request.onerror = () => reject(request.error);
        });
    }
});

function registerForEvent(eventId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const participant = { userId: currentUser.id, eventId };
    const request = indexedDB.open('bdsDB', 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        getEventParticipantsByUser(currentUser.id).then(participants => {
            if (participants.find(p => p.eventId === eventId)) {
                alert('Vous êtes déjà inscrit à cet événement.');
                return;
            }
            addEventParticipant(participant).then(() => {
                window.location.reload();
            });
        });
    };
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}