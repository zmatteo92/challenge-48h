import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../db/indexedDB';

function Home() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setLoading(true);
		getAllProducts()
			.then(products => {
				console.log('Produits chargés:', products);
				const sportswearProducts = products.filter(product => product.category === 'Sportswear');
				setProducts(sportswearProducts);
				setLoading(false);
			})
			.catch(err => {
				console.error('Erreur lors du chargement des produits:', err);
				setError(`Une erreur est survenue lors du chargement des produits: ${err.message}`);
				setLoading(false);
			});
	}, []);

	return (
		<section className="hero">
			<h1>Bienvenue au BDS Ynov Paris</h1>
			<p>Boostez vos performances avec notre collection exclusive de sportswear !</p>
			{loading ? (
				<p>Chargement des produits...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				<div className="products">
					{products.length > 0 ? (
						products.map(product => (
							<div className="product" key={product.id}>
								<img src={product.image} alt={product.name} width="200" onError={(e) => e.target.src = '/images/placeholder.png'} />
								<h3>{product.name}</h3>
								<p>{product.description}</p>
								<p><strong>Prix :</strong> {product.price > 0 ? `${product.price}€` : 'Prix non disponible'}</p>
								{product.priceESN > 0 && (
									<p><strong>Prix ESN :</strong> {product.priceESN}€ 💚</p>
								)}
								<a href="https://www.epopey.com" target="_blank" rel="noopener noreferrer" className="btn">
									Acheter sur Epopey
								</a>
							</div>
						))
					) : (
						<p>Aucun produit disponible pour le moment.</p>
					)}
				</div>
			)}
			<div className="about">
				<h2>Le BDS Change d’Identité</h2>
				<p>Nous sommes fiers de dévoiler notre nouveau logo et nos nouvelles couleurs : bleu et noir. Rejoignez-nous pour découvrir nos activités et événements !</p>
				<Link to="/events" className="btn">Suivez nos activités</Link>
			</div>
		</section>
	);
}

export default Home;