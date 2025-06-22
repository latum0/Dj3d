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
        <footer className="footer">
            <div className="footer-container">
                {/* Subscribe Section */}
                <div className="footer-section">
                    <h2 className="footer-heading">Exclusive</h2>
                    <div className="subscribe-section">
                        <h3 className="section-title">Subscribe</h3>
                        <p className="section-subtitle">Get 10% off your first order</p>
                        <form onSubmit={handleSubmit} className="subscribe-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="email-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="subscribe-button">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Support Section */}
                <div className="footer-section">
                    <h3 className="section-title">Support</h3>
                    <ul className="support-list">
                        <li>Ill Bijoy sorani, Dhaka, DH 1515, Bangladesh.</li>
                        <li>exclusive@gmail.com</li>
                        <li>+88015-88888-9999</li>
                    </ul>
                </div>

                {/* Account Section */}
                <div className="footer-section">
                    <h3 className="section-title">Account</h3>
                    <div className="account-columns">
                        <div className="account-column">
                            <div className="account-item">My Account</div>
                            <div className="account-item">Login / Register</div>
                            <div className="account-item">Cart</div>
                            <div className="account-item">Wishlist</div>
                            <div className="account-item">Shop</div>
                        </div>

                    </div>
                </div>

                <div className="footer-section">
                    <h3 className="section-title">Quick Link</h3>
                    <div className="account-item">Privacy Policy</div>
                    <div className="account-item">Terms Of Use</div>
                    <div className="account-item">FAQ</div>
                    <div className="account-item">Contact</div>
                </div>

                {/* Download App Section */}

            </div>

            {/* Copyright Section */}
            <div className="copyright">
                © Copyright 2025. All right reserved
            </div>
        </footer>
    );
};

export default Footer;