let db;

const request = indexedDB.open('bdsDB', 2);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        userStore.createIndex('username', 'username', { unique: true });
        userStore.createIndex('email', 'email', { unique: true });
    }
    if (!db.objectStoreNames.contains('teamMembers')) {
        const teamStore = db.createObjectStore('teamMembers', { keyPath: 'id', autoIncrement: true });
        teamStore.createIndex('pole', 'pole');
    }
    if (!db.objectStoreNames.contains('events')) {
        const eventStore = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        eventStore.createIndex('category', 'category');
    }
    if (!db.objectStoreNames.contains('eventParticipants')) {
        const participantStore = db.createObjectStore('eventParticipants', { keyPath: 'id', autoIncrement: true });
        participantStore.createIndex('userId_eventId', ['userId', 'eventId'], { unique: true });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    initializeDefaultData();
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
            // Bureau
            addTeamMember({ name: 'Antoine', role: 'Président', pole: 'Bureau', description: 'Responsable général du BDS.' });
            addTeamMember({ name: 'Mathis', role: 'Vice-Président', pole: 'Bureau', description: 'Supporte le président dans ses fonctions.' });
            addTeamMember({ name: 'Erwan', role: 'Trésorier', pole: 'Bureau', description: 'Gère les finances du BDS.' });
            addTeamMember({ name: 'Mathilde', role: 'Responsable', pole: 'Pôle Communication', description: 'Gère la communication et les réseaux sociaux.' });
            addTeamMember({ name: 'Anastasia', role: 'Membre', pole: 'Pôle Communication', description: 'Supporte les activités de communication.' });
            addTeamMember({ name: 'Océane', role: 'Responsable', pole: 'Pôle Créa', description: 'Gère les créations visuelles et artistiques.' });
            addTeamMember({ name: 'Hugo', role: 'Membre', pole: 'Pôle Créa', description: 'Supporte les activités créatives.' });
            addTeamMember({ name: 'Lara', role: 'Membre', pole: 'Pôle Créa', description: 'Supporte les activités créatives.' });
            addTeamMember({ name: 'Yann', role: 'Responsable', pole: 'Pôle Event', description: 'Organise les événements du BDS.' });
            addTeamMember({ name: 'Seb', role: 'Membre', pole: 'Pôle Event', description: 'Supporte l’organisation des événements.' });
            addTeamMember({ name: 'Aless', role: 'Membre', pole: 'Pôle Event', description: 'Supporte l’organisation des événements.' });
            addTeamMember({ name: 'Augustin', role: 'Membre', pole: 'Pôle Event', description: 'Supporte l’organisation des événements.' });
            addTeamMember({ name: 'Nathan', role: 'Membre', pole: 'Pôle Event', description: 'Supporte l’organisation des événements.' });
            addTeamMember({ name: 'Jia-Bao', role: 'Responsable', pole: 'Pôle E-Sport', description: 'Gère les activités E-Sport.' });
            addTeamMember({ name: 'Amélie', role: 'Membre', pole: 'Pôle Capta', description: 'Supporte les activités de captation.' });
        }
    });

    getAllEvents().then(events => {
        if (events.length === 0) {
            addEvent({ title: 'Gymnase (Foot)', description: 'Séance de foot au gymnase.', date: '2025-01-08', time: '18:00', location: 'Gymnase', category: 'Sport', createdBy: 1 });
            addEvent({ title: 'Gymnase (Basket)', description: 'Séance de basket au gymnase.', date: '2025-01-10', time: '18:00', location: 'Gymnase', category: 'Sport', createdBy: 1 });
            addEvent({ title: 'Qualification LYC', description: 'Qualifications pour la Ligue Ynov Campus.', date: '2025-01-25', time: '14:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'Tournoi Valorant', description: 'Tournoi de Valorant.', date: '2025-02-22', time: '14:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'Laser Game', description: 'Soirée Laser Game pour les membres.', date: '2025-03-14', time: '19:00', location: 'Paris', category: 'Event', createdBy: 1 });
            addEvent({ title: 'Tournoi RL 3v3', description: 'Tournoi Rocket League 3v3.', date: '2025-03-29', time: '14:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'Tournoi Badminton', description: 'Tournoi de badminton.', date: '2025-04-04', time: '14:00', location: 'Gymnase', category: 'Sport', createdBy: 1 });
            addEvent({ title: 'Valorant Ynov Cup', description: 'Coupe Ynov de Valorant.', date: '2025-04-05', time: '10:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'LoL Ynov Cup', description: 'Coupe Ynov de League of Legends.', date: '2025-04-12', time: '10:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'Tournoi Volley', description: 'Tournoi de volley-ball.', date: '2025-04-11', time: '14:00', location: 'Gymnase', category: 'Sport', createdBy: 1 });
            addEvent({ title: 'Chasse à l’Homme', description: 'Activité ludique de chasse à l’homme.', date: '2025-05-03', time: '15:00', location: 'Parc', category: 'Event', createdBy: 1 });
            addEvent({ title: 'Tournoi Fifa', description: 'Tournoi de Fifa.', date: '2025-05-17', time: '14:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
            addEvent({ title: 'Event Sport', description: 'Événement sportif.', date: '2025-06-04', time: '14:00', location: 'Campus', category: 'Sport', createdBy: 1 });
            addEvent({ title: 'Event E-Sport', description: 'Événement E-Sport.', date: '2025-06-05', time: '14:00', location: 'Campus', category: 'E-Sport', createdBy: 1 });
        }
    });
}

export function addUser(user) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readwrite');
        const store = transaction.objectStore('users');
        const request = store.add(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('username');
        const request = index.get(username);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const index = store.index('email');
        const request = index.get(email);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function getAllUsers() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['users'], 'readonly');
        const store = transaction.objectStore('users');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function addTeamMember(member) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['teamMembers'], 'readwrite');
        const store = transaction.objectStore('teamMembers');
        const request = store.add(member);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function getAllTeamMembers() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['teamMembers'], 'readonly');
        const store = transaction.objectStore('teamMembers');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function addEvent(event) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readwrite');
        const store = transaction.objectStore('events');
        const request = store.add(event);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function getAllEvents() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readonly');
        const store = transaction.objectStore('events');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function getEventsByCategory(category) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['events'], 'readonly');
        const store = transaction.objectStore('events');
        const index = store.index('category');
        const request = index.getAll(category);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function addEventParticipant(participant) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['eventParticipants'], 'readwrite');
        const store = transaction.objectStore('eventParticipants');
        const request = store.add(participant);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function getEventParticipantsByUser(userId) {
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