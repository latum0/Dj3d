import React from 'react'
import Diviser from './Diviser'
import './New.css'

function New() {
  return (
    <div>

      <div className="main-container">

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