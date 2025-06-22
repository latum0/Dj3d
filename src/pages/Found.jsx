import React from 'react';
import { Link } from 'react-router-dom';
import logo_v2 from '../assets/logo_v2.webp';
import c from '../assets/c.png';
import u from '../assets/u.png';
import m1 from '../assets/m1.png';
import './Found.css';

const Found = () => {
    return (
        <div className="not-found-container">
            <nav className="navbar">
                <div className="logo-container">
                    <img src={logo_v2} alt="SKILL MARKET Logo" className="nav-logo" />
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/about" className="nav-link ">About</Link>
                    <Link to="/about" className="nav-link ">Sign Up</Link>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="What are you looking for?" />
                </div>
                <div className="nav-icons">
                    <button className="icon-button">
                        <img src={c} className="about-image" />
                    </button>
                    <button className="icon-button">
                        <img src={m1} />
                    </button>
                    <button className="icon-button">
                        <img src={u} />
                    </button>
                </div>
            </nav>
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <span style={{ color: '#aaa' }}>Home</span> / <span className="active">Found</span>
            </div>

            {/* Main Content */}
            <div className="not-found-content">
                <h1 className="not-found-title">404 Not Found</h1>
                <p className="not-found-message">
                    Your visited page not found. You may go home page.
                </p>
                <Link to="/" className="not-found-button">
                    Back to home page
                </Link>
            </div>
        </div>
    );
};

export default Found;