import React from 'react';
import { Link } from 'react-router-dom';
import m1 from '../assets/m1.png';
import m12 from '../assets/m12.png';
import m13 from '../assets/m13.png';
import c from '../assets/c.png';
import u from '../assets/u.png';
import logo_v2 from '../assets/logo_v2.webp';
import './contact.css';

const Contact = () => {
    return (
        <div className="exclusive-contact">

            <div className="exclusive-contact" style={{ paddingTop: '50px' }}></div>
            <div className="breadcrumb">
                <Link to="/" style={{ color: '#aaa' }}>Home</Link> / <span className="active">Contact</span>
            </div>

            <div className="contact-container">
                <div className="contact-info">
                    <div className="info-section">
                        <h3><img src={m12} /><strong>Call To Us</strong></h3>
                        <p>We are available 24/7, 7 days a week.</p>
                        <p><strong>Phone +8806III02222</strong></p>
                    </div>

                    <div className="info-section">
                        <h3><strong><img src={m13} />Write To US</strong></h3>
                        <p>Fill out our form and we will contact you within 24 hours.</p>
                        <p>Emails: customer@exclusive.com</p>
                        <p>Emails: support@exclusive.com</p>
                    </div>
                </div>


                <div className="contact-form">
                    <div className="form-group">
                        <div className="form-label">Your Name *</div>
                        <input
                            type="text"
                            className="form-input-underline"
                        />
                    </div>

                    <div className="form-group">
                        <div className="form-label">Your Email *</div>
                        <input
                            type="email"
                            className="form-input-underline"
                        />
                    </div>

                    <div className="form-group">
                        <div className="form-label">Your Phone *</div>
                        <input
                            type="tel"
                            className="form-input-underline"
                        />
                    </div>

                    <div className="form-group">
                        <div className="form-label">Your Massage</div>
                        <input
                            type="text"
                            className="form-input-underline"
                        />
                    </div>

                    <button className="submit-button">
                        Send Massage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Contact;