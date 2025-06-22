import React, { useState, useEffect } from 'react';
import './Countdown.css';

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: Number(days),
    hours: Number(hours),
    minutes: Number(minutes),
    seconds: Number(seconds)
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) return { ...prev, seconds: seconds - 1 };
        if (minutes > 0) return { ...prev, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { ...prev, hours: hours - 1, minutes: 59, seconds: 59 };
        if (days > 0) return { ...prev, days: days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [days, hours, minutes, seconds]);

  return (
    <div className="countdown-container">
      <div className="countdown-content">
        <div className="timer-grid">
          <div className="time-block">
            <span className="time-number">{timeLeft.days.toString().padStart(2, '0')}</span>
            <span className="time-label">Days</span>
          </div>
          <div className="time-block">
            <span className="time-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="time-label">Hours</span>
          </div>
          <div className="time-block">
            <span className="time-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="time-label">Minutes</span>
          </div>
          <div className="time-block">
            <span className="time-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="time-label">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;