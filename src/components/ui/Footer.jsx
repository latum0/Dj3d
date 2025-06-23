import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Subscribed with email: ${email}`);
        setEmail('');
    };

    return (
        <footer className="site-footer">
            <div className="site-footer-container">
                {/* Subscribe Section */}
                <div className="site-footer-section">
                    <h2 className="site-footer-heading">Exclusive</h2>
                    <div className="site-subscribe-section">
                        <h3 className="site-section-title">Subscribe</h3>
                        <p className="site-section-subtitle">Get 10% off your first order</p>
                        <form onSubmit={handleSubmit} className="site-subscribe-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="site-email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="site-subscribe-button">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Support Section */}
                <div className="site-footer-section">
                    <h3 className="site-section-title">Support</h3>
                    <ul className="site-support-list">
                        <li>123 Business Street, City, State 12345</li>
                        <li>support@exclusive.com</li>
                        <li>+1 (555) 123-4567</li>
                    </ul>
                </div>

                {/* Account Section */}
                <div className="site-footer-section">
                    <h3 className="site-section-title">Account</h3>
                    <div className="site-account-columns">
                        <div className="site-account-column">
                            <div className="site-account-item">My Account</div>
                            <div className="site-account-item">Login / Register</div>
                            <div className="site-account-item">Cart</div>
                            <div className="site-account-item">Wishlist</div>
                            <div className="site-account-item">Shop</div>
                        </div>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="site-footer-section">
                    <h3 className="site-section-title">Quick Links</h3>
                    <div className="site-account-item">Privacy Policy</div>
                    <div className="site-account-item">Terms Of Use</div>
                    <div className="site-account-item">FAQ</div>
                    <div className="site-account-item">Contact</div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="site-copyright">
                © Copyright 2025. All rights reserved
            </div>
        </footer>
    );
};

export default Footer;