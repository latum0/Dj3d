import React from 'react';
import './ImgDev.css';
import Countdown from './Countdown';

function ImgDev() {
  const time = { 
    days: 3, 
    hours: 5, 
    minutes: 50, 
    seconds: 20 
  };

  return (
    <div className="imgDev-container">
      <div className="text-content">
        <p className="categories-label">Categories</p>
        <h1 className="main-heading">Enhance Your PC<br/>Performance</h1>
        
        <Countdown
          days={time.days}
          hours={time.hours}
          minutes={time.minutes}
          seconds={time.seconds}
        />

        <button className="buy-now-button">
          Buy Now!
        </button>
      </div>

      <div className="image-container">
        <div className="blur-background"></div>
        <img 
          src="src/assets/mbHome.png" 
          alt="PC Components" 
          className="main-image"
        />
      </div>
    </div>
  );
}

export default ImgDev;