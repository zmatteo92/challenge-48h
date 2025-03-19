import React from 'react';
import { Link } from 'react-router-dom';

function Header({ currentUser, onLogout }) {
	return (
		<header>
			<nav>
				<div className="logo">
					<img src="/images/logo.png" alt="Logo BDS" width="60" />
				</div>
				<ul>
					<li><Link to="/">Accueil</Link></li>
					<li><Link to="/products">Produits</Link></li>
					<li><Link to="/organigramme">Organigramme</Link></li>
					<li><Link to="/contact">Contact</Link></li>
					<li><Link to="/calendar">Calendrier</Link></li>
					<li><Link to="/events">Événements</Link></li>
					{currentUser && currentUser.isAdmin && (
						<li><Link to="/admin">Admin</Link></li>
					)}
					{currentUser ? (
						<li>
							<button
								onClick={onLogout}
								className="logout-btn"
								aria-label="Se déconnecter"
							>
								Déconnexion
							</button>
						</li>
					) : (
						<>
							<li><Link to="/login">Connexion</Link></li>
							<li><Link to="/signup">Inscription</Link></li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
}

export default Header;