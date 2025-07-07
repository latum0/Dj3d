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
                    <h1 className="about-title">NeoPrinting</h1>
                    <p>
                        At NeoPrinting, we believe that customized products should be accessible, affordable, and locally made.
                    </p>
                    <p>
                        Our journey began with a simple observation: many Algerians struggle to find spare parts or custom-made items for everyday needs — often forced to import or abandon perfectly usable devices.
                    </p>
                    <p>
                        We saw this as more than just a market gap — we saw it as an opportunity to empower local manufacturing using 3D printing.
                    </p>
                    <p>
                        That’s why we created NeoPrinting:
                        A 3D printing farm connected to a smart e-commerce platform where:
                    </p>
                    <p>
                        Customers can order ready-made products or upload their own ideas

                        Every item is printed on demand, locally

                        We're a team of passionate students, makers, and problem-solvers who believe that digital manufacturing can change the way people access products — one print at a time.

                        Welcome to the future of local, on-demand production.
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