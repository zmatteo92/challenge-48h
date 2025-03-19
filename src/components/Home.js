import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <section className="hero">
            <h1>Bienvenue au Bureau des Sports (BDS)</h1>
            <p>Le BDS organise des activités sportives pour les étudiants, comme des séances de gym, des soirées laser game, les Olympiades du campus de Paris et la coupe LoL Ynov.</p>
            <Link to="/events" className="btn">Voir les événements</Link>
            <div className="about">
                <h2>Le BDS Change d’Identité</h2>
                <p>Nous sommes fiers de dévoiler notre nouveau logo et nos nouvelles couleurs : bleu et noir. Rejoignez-nous pour découvrir nos activités et événements !</p>
                <Link to="/events" className="btn">Suivez nos activités</Link>
            </div>
        </section>
    );
}

export default Home;