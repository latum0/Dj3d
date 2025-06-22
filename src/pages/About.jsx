import React from 'react';
import { Link } from 'react-router-dom';
import "./About.css";
import photo2 from '../assets/m.png';
import emma from '../assets/emma.png';
import will from '../assets/will.png';
import tom from '../assets/tom.png';
import t1 from '../assets/t1.png';
import m10 from '../assets/m10.png';
import m2 from '../assets/m2.png';
import m4 from '../assets/m4.png';
import m5 from '../assets/m5.png';
import m6 from '../assets/m6.png';
import m7 from '../assets/m7.png';

export default function About() {
    return (
        <div className="about-container">
            <div className="exclusive-contact" style={{ paddingTop: '80px' }}></div>
            <div className="breadcrumb">
                <Link to="/" style={{ color: '#aaa' }}>Home</Link> / <span className="active">About</span>
            </div>

            <section className="about-section">
                <div className="about-content">
                    <h1 className="about-title">Our Story</h1>
                    <p>
                        Launched in 2025, Skill Market is the first e-commerce platform specialized in PC equipment with an active presence across Africa. Powered by advanced customization and recommendation technologies, Skill Market offers over 15,000 products from 500 different brands and serves more than 2 million tech and gaming enthusiasts.
                    </p>
                    <p>
                        Skill Market offers a diverse range of products covering all computing needs—from high-performance components to gaming peripherals—constantly evolving to keep up with the latest innovations. Our platform allows users to customize PCs, compare technical specifications, and benefit from expert advice to optimize their purchases across all categories, from graphics cards to advanced cooling systems.
                    </p>
                </div>

                <div className="about-image-container">
                    <img
                        src={photo2}
                        alt="Shopping Girls"
                        className="about-main-image"
                    />
                </div>
            </section>

            <section className="stats-section">
                <div className="stat-card">
                    <img src={t1} alt="Sellers icon" className="stat-icon" />
                    <h2>10.5k</h2>
                    <p>Sellers active in our site</p>
                </div>
                <div className="stat-card highlight">
                    <img src={m10} alt="Sales icon" className="stat-icon" />
                    <h2>33k</h2>
                    <p>Monthly Product Sale</p>
                </div>
                <div className="stat-card">
                    <img src={m2} alt="Customers icon" className="stat-icon" />
                    <h2>45.5k</h2>
                    <p>Customer active in our site</p>
                </div>
                <div className="stat-card">
                    <img src={m4} alt="Gross sale icon" className="stat-icon" />
                    <h2>25k</h2>
                    <p>Annual gross sale in our site</p>
                </div>
            </section>

            <section className="team-section">
                <h2 className="section-title">Our Team</h2>
                <div className="team-grid">
                    <div className="team-member">
                        <img src={tom} alt="Tom Cruise" className="member-photo" />
                        <h3>Tom Cruise</h3>
                        <p>Founder & Chairman</p>
                    </div>
                    <div className="team-member">
                        <img src={emma} alt="Emma Watson" className="member-photo" />
                        <h3>Emma Watson</h3>
                        <p>Managing Director</p>
                    </div>
                    <div className="team-member">
                        <img src={will} alt="Will Smith" className="member-photo" />
                        <h3>Will Smith</h3>
                        <p>Product Designer</p>
                    </div>
                </div>
            </section>

            <div className="carousel-indicators">
                {['indicator-1', 'indicator-2', 'indicator-3', 'indicator-4', 'indicator-5'].map((id, index) => (
                    <span
                        key={id}
                        className={`indicator ${index === 2 ? 'active' : ''}`}
                    ></span>
                ))}
            </div>

            <section className="features-section">
                <div className="feature-card">
                    <img src={m5} alt="Free delivery icon" className="feature-icon" />
                    <h3>FREE AND FAST DELIVERY</h3>
                    <p>Free delivery for all orders over $140</p>
                </div>
                <div className="feature-card">
                    <img src={m6} alt="Customer service icon" className="feature-icon" />
                    <h3>24/7 CUSTOMER SERVICE</h3>
                    <p>Friendly 24/7 customer support</p>
                </div>
                <div className="feature-card">
                    <img src={m7} alt="Money back guarantee icon" className="feature-icon" />
                    <h3>MONEY BACK GUARANTEE</h3>
                    <p>We return money within 30 days</p>
                </div>
            </section>
        </div>
    );
}