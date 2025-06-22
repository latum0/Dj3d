import React from 'react';
import ReactStars from "react-stars";

const StarEx = ({ rating }) => {
  return (
    <div className="star-rating">
      <ReactStars
        count={5}
        value={rating}
        size={24}
        color2={'#ffd700'}
        edit={false}
      />
    </div>
  );
};

export default StarEx;