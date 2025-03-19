let db;
let dbReady = false;

const request = indexedDB.open('bdsDB', 4);

request.onupgradeneeded = function(event) {
	console.log('Mise à jour de la base de données...');
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
	if (!db.objectStoreNames.contains('products')) {
		const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
		productStore.createIndex('category', 'category');
	}
};

request.onsuccess = function(event) {
	console.log('Base de données ouverte avec succès.');
	db = event.target.result;
	dbReady = true;
	initializeDefaultData();
};

request.onerror = function(event) {
	console.error('Erreur lors de l\'ouverture de la base de données:', event.target.errorCode);
};

function waitForDb() {
	return new Promise((resolve, reject) => {
		if (dbReady) {
			resolve();
		} else {
			const checkInterval = setInterval(() => {
				if (dbReady) {
					clearInterval(checkInterval);
					resolve();
				}
			}, 100);
			setTimeout(() => {
				clearInterval(checkInterval);
				reject(new Error('La base de données n\'est pas prête après 5 secondes.'));
			}, 5000);
		}
	});
}

function initializeDefaultData() {
	getAllUsers().then(users => {
		if (users.length === 0) {
			addUser({ username: 'admin', email: 'admin@bds.com', password: 'admin123', isAdmin: true });
		}
	});

	getAllTeamMembers().then(teamMembers => {
		if (teamMembers.length === 0) {
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

	getAllProducts().then(products => {
		if (products.length === 0) {
			console.log('Initialisation des produits...');
			addProduct({
				name: 'Veste 1/4 Zip Macron',
				description: 'Veste de sport 1/4 zip, idéale pour l’entraînement.',
				price: 28,
				priceESN: 28,
				category: 'Sportswear',
				image: '/images/veste-1-4-zip-macron.png'
			});
			addProduct({
				name: 'Short Training',
				description: 'Short de training confortable pour les activités sportives.',
				price: 25,
				priceESN: 25,
				category: 'Sportswear',
				image: '/images/short-training.png'
			});
			addProduct({
				name: 'Maillot Training',
				description: 'Maillot de training pour les séances sportives.',
				price: 25,
				priceESN: 25,
				category: 'Sportswear',
				image: '/images/maillot-training.png'
			});
			addProduct({
				name: 'Veste Softshell',
				description: 'Veste softshell pour les entraînements en extérieur.',
				price: 37,
				priceESN: 37,
				category: 'Sportswear',
				image: '/images/veste-softshell.png'
			});
			addProduct({
				name: 'T-Shirt Ozers Original',
				description: 'T-shirt Ozers pour les entraînements.',
				price: 0,
				priceESN: 0,
				category: 'Sportswear',
				image: '/images/t-shirt-ozers.png'
			});
		} else {
			console.log('Produits déjà initialisés:', products);
		}
	}).catch(err => {
		console.error('Erreur lors de l\'initialisation des produits:', err);
	});
}

export function addUser(user) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['users'], 'readwrite');
			const store = transaction.objectStore('users');
			const request = store.add(user);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	});
}

export function getUserByUsername(username) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['users'], 'readonly');
			const store = transaction.objectStore('users');
			const index = store.index('username');
			const request = index.get(username);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function getUserByEmail(email) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['users'], 'readonly');
			const store = transaction.objectStore('users');
			const index = store.index('email');
			const request = index.get(email);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function getAllUsers() {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['users'], 'readonly');
			const store = transaction.objectStore('users');
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function addTeamMember(member) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['teamMembers'], 'readwrite');
			const store = transaction.objectStore('teamMembers');
			const request = store.add(member);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	});
}

export function getAllTeamMembers() {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['teamMembers'], 'readonly');
			const store = transaction.objectStore('teamMembers');
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function addEvent(event) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['events'], 'readwrite');
			const store = transaction.objectStore('events');
			const request = store.add(event);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	});
}

export function getAllEvents() {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['events'], 'readonly');
			const store = transaction.objectStore('events');
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function getEventsByCategory(category) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['events'], 'readonly');
			const store = transaction.objectStore('events');
			const index = store.index('category');
			const request = index.getAll(category);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function addEventParticipant(participant) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['eventParticipants'], 'readwrite');
			const store = transaction.objectStore('eventParticipants');
			const request = store.add(participant);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	});
}

export function getEventParticipantsByUser(userId) {
	return waitForDb().then(() => {
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
	});
}

export function addProduct(product) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['products'], 'readwrite');
			const store = transaction.objectStore('products');
			const request = store.add(product);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	});
}

export function getAllProducts() {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			if (!db) {
				reject(new Error('La base de données n\'est pas initialisée.'));
				return;
			}
			const transaction = db.transaction(['products'], 'readonly');
			const store = transaction.objectStore('products');
			const request = store.getAll();
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}

export function getProductsByCategory(category) {
	return waitForDb().then(() => {
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(['products'], 'readonly');
			const store = transaction.objectStore('products');
			const index = store.index('category');
			const request = index.getAll(category);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	});
}