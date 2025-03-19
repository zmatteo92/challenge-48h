import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../db/indexedDB';

function Products() {
	const [products, setProducts] = useState([]);
	const [filter, setFilter] = useState('Sportswear');
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

	const filteredProducts = filter === 'All' ? products : products.filter(product => product.category === filter);

	return (
		<div>
			<h1>Nos Produits</h1>
			<div className="filter">
				<label>Filtrer par catégorie :</label>
				<select onChange={(e) => setFilter(e.target.value)} value={filter}>
					<option value="All">Tous</option>
					<option value="Sportswear">Sportswear</option>
				</select>
			</div>
			{loading ? (
				<p>Chargement des produits...</p>
			) : error ? (
				<p className="error">{error}</p>
			) : (
				<div className="products">
					{filteredProducts.length > 0 ? (
						filteredProducts.map(product => (
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
		</div>
	);
}

export default Products;