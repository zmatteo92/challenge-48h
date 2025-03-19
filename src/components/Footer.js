import React from 'react';

function Footer() {
    return (
        <footer>
            <p>© 2025 Bureau des Sports. Tous droits réservés.</p>
            <div className="social-links">
                <a href="https://www.instagram.com/bdsynovparis/" target="_blank" rel="noopener noreferrer">
                    <img src="/images/instagram-logo.png" alt="Instagram" width="30" />
                </a>
                <a href="https://www.facebook.com/BDSYnovParis" target="_blank" rel="noopener noreferrer">
                    <img src="/images/facebook-logo.png" alt="Facebook" width="30" />
                </a>
            </div>
        </footer>
    );
}

export default Footer;