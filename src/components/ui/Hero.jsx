import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './hero.css';
import caseImage from '../../assets/case.jpg'; // Import image properly


const CATEGORIES = [
  "Core Components",
  "Power & Cooling",
  "Peripherals & Accessories",
  "Pre-Built & Custom Solutions",
  "Storage Solutions",
  "Networking & Software",
  "Cases & Modding",
  
];

const OFFERS = [
  { 
    title: "Up to 10% off Voucher", 
    cta: "Shop Now →",
    img: caseImage // Use imported image
  },
  { 
    title: "Summer Sale 20% Off", 
    cta: "Discover More →",
    img: caseImage // Add placeholder or actual image
  },
  { 
    title: "New Arrivals Special", 
    cta: "Explore Now →",
    img: caseImage // Add placeholder or actual image
  }
];
const Hero = () => {
  // Moved static data outside the component to prevent re-creation on re-renders
  

  return (

    <div className="hero">
      <div className="offers-container">
      <div className="left-hero">
        <h2 className="category-text">Categories</h2>
        <div className="categories-list">
          {CATEGORIES.map((category, index) => (
            <a 
              key={index} 
              href={`#${category.toLowerCase().replace(/ /g, '-')}`} 
              className="category-item" 
            >
              {category}
            </a>
          ))}
        </div>
      </div>

      <div className="right-hero">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          className="swiper-container" 
        >
          {OFFERS.map((offer, index) => (
            <SwiperSlide key={index}>
              <div className="offer-card">
                <div className="offer-content">
                  <div className="left-offer">
                    <div className="text-offer">
                      <p>{offer.title}</p>
                      <a href="" className="cta-link">{offer.cta}</a>
                    </div>
                  </div>
                  
                  
                  <img 
                    src={offer.img} 
                    alt={offer.title} 
                    className="offer-image" 
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>

    </div>
    
  );
};

export default React.memo(Hero); // Memoized for performance