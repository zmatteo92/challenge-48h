import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllProducts } from '../db/indexedDB';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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

    // Transition automatique toutes les 5 secondes
    useEffect(() => {
        if (products.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [products]);

    const prevProduct = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? products.length - 1 : prevIndex - 1
        );
    };

    const nextProduct = () => {
        setCurrentIndex((prevIndex) => 
            (prevIndex + 1) % products.length
        );
    };

    const slideVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, x: -100, transition: { duration: 0.5 } },
    };

    return (
        <section className="hero">
            <h1>Bienvenue au BDS Ynov Paris</h1>
            <p>Boostez vos performances avec notre collection exclusive de sportswear !</p>
            {loading ? (
                <p>Chargement des produits...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="product-carousel">
                    {products.length > 0 ? (
                        <>
                            <button className="carousel-nav-btn prev" onClick={prevProduct}>
                                <FaArrowLeft />
                            </button>
                            <div className="carousel-content">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        className="product"
                                        variants={slideVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                    >
                                        <img
                                            src={products[currentIndex].image}
                                            alt={products[currentIndex].name}
                                            onError={(e) => (e.target.src = '/images/placeholder.png')}
                                        />
                                        <h3>{products[currentIndex].name}</h3>
                                        <p>{products[currentIndex].description}</p>
                                        <p>
                                            <strong>Prix :</strong>{' '}
                                            {products[currentIndex].price > 0
                                                ? `${products[currentIndex].price}€`
                                                : 'Prix non disponible'}
                                        </p>
                                        {products[currentIndex].priceESN > 0 && (
                                            <p>
                                                <strong>Prix ESN :</strong>{' '}
                                                {products[currentIndex].priceESN}€
                                            </p>
                                        )}
                                        <a
                                            href="https://www.epopey.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn"
                                        >
                                            Acheter sur Epopey
                                        </a>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <button className="carousel-nav-btn next" onClick={nextProduct}>
                                <FaArrowRight />
                            </button>
                        </>
                    ) : (
                        <p>Aucun produit disponible pour le moment.</p>
                    )}
                    {/* Indicateurs de position (points) */}
                    {products.length > 1 && (
                        <div className="carousel-indicators">
                            {products.map((_, index) => (
                                <span
                                    key={index}
                                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentIndex(index)}
                                ></span>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="about">
                <h2>Le BDS Change d’Identité</h2>
                <p>
                    Nous sommes fiers de dévoiler notre nouveau logo et nos nouvelles couleurs : bleu et
                    noir. Rejoignez-nous pour découvrir nos activités et événements !
                </p>
                <Link to="/events" className="btn">
                    Suivez nos activités
                </Link>
            </div>
        </section>
    );
}

export default Home;