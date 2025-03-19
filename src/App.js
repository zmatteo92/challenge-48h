import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Organigramme from './components/Organigramme';
import Contact from './components/Contact';
import Calendar from './components/Calendar';
import Events from './components/Events';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import './App.css';

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <div className="App">
            <Header currentUser={currentUser} onLogout={handleLogout} />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/organigramme" element={<Organigramme />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/calendar" element={<Calendar currentUser={currentUser} />} />
                    <Route path="/events" element={<Events currentUser={currentUser} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
                    <Route path="/admin" element={<Admin currentUser={currentUser} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;