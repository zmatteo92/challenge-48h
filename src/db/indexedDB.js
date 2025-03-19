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