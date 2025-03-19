import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

function Footer() {
	return (
		<footer>
			<p>© 2025 Bureau des Sports. Tous droits réservés.</p>
			<div className="social-links">
				<a href="https://www.instagram.com/bdsynovparis/" target="_blank" rel="noopener noreferrer">
					<FaInstagram size={30} />
				</a>
				<a href="https://www.facebook.com/BDSYnovParis" target="_blank" rel="noopener noreferrer">
					<FaFacebook size={30} />
				</a>
			</div>
		</footer>
	);
}

export default Footer;