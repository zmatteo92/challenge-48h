import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <section className="hero">
            <h1>Bienvenue au Bureau des Sports (BDS)</h1>
            <p>Le BDS organise des activités sportives pour les étudiants, comme des séances de gym, des soirées laser game, les Olympiades du campus de Paris et la coupe LoL Ynov.</p>
            <Link to="/events" className="btn">Voir les événements</Link>
        </section>
    );
}

export default Home;