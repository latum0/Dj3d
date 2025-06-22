import React from 'react'
import Diviser from './Diviser'
import './New.css'

function New() {
  return (
    <div>
      <Diviser name="Featured" title="New Arrival" />
      <div className="main-container">
      
        
        <section className="hero-section">
          <div className="case">
            <div className="case-content">
              <h2>Pc Cases</h2>
              <p>Protective, stylish, airflow-optimized enclosures for components.</p>
              <button className="shop-now-btn">Shop Now</button>
            </div>
          </div>
          
          <div className="razer-section">
            <div className="razer-content">
              <h3>Razer Laptops</h3>
              <p>powerful, sleek gaming machines with style</p>
            </div>
          </div>
        </section>

       
        <div className="news-grid">
          <div className="new-card speaker-card">
            <h3>Setups</h3>
          </div>
          <div className="new-card perfume-card">
            <h3>Keyboards</h3>
          </div>
        </div>

       
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon delivery-icon"></div>
            <h4>FREE AND FAST DELIVERY</h4>
            <p>Free delivery for all orders over $140</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon support-icon"></div>
            <h4>24/7 CUSTOMER SERVICE</h4>
            <p>Friendly 24/7 customer support</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon guarantee-icon"></div>
            <h4>MONEY BACK GUARANTEE</h4>
            <p>We return money within 30 days</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default New