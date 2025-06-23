import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './Hero.css';

const CATEGORIES = [
  {
    name: "Prototyping & Engineering Components",
    icon: "⚙️",
    description: "Functional parts & mechanical components"
  },
  {
    name: "Home Décor & Art Pieces",
    icon: "🎨",
    description: "Custom decorative items & sculptures"
  },
  {
    name: "Miniatures & Figurines",
    icon: "🏰",
    description: "Gaming pieces & collectible models"
  },
  {
    name: "Wearables & Jewelry",
    icon: "💎",
    description: "Custom accessories & fashion items"
  },
  {
    name: "Cosplay & Props",
    icon: "🎭",
    description: "Costume pieces & replica props"
  },
  {
    name: "Educational & STEM Kits",
    icon: "🔬",
    description: "Learning tools & science models"
  },
  {
    name: "Medical & Dental Models",
    icon: "🦷",
    description: "Healthcare & anatomical prints"
  }
];

const FARM_SLIDES = [
  {
    title: "Premium 3D Printing",
    subtitle: "Transform your ideas into reality with precision manufacturing",
    cta: "Start Your Project",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop&crop=center",
    accent: "Precision"
  },
  {
    title: "Custom Manufacturing",
    subtitle: "From concept to creation - we bring your designs to life",
    cta: "Get Quote",
    image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=1200&h=600&fit=crop&crop=center",
    accent: "Quality"
  },
  {
    title: "Rapid Prototyping",
    subtitle: "Fast turnaround times for your most critical projects",
    cta: "Learn More",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=1200&h=600&fit=crop&crop=center",
    accent: "Speed"
  },
  {
    title: "Professional Service",
    subtitle: "Expert consultation and premium finishing options",
    cta: "Contact Us",
    image: "https://cdn.shopify.com/s/files/1/0606/0323/6501/files/man-editing-using-3d-printing-software_654c7e8c-b1ef-44fc-bdb0-91f4545443a4.webp?v=1697091891",
    accent: "Expert"
  }
];

const Hero = () => {
  return (
    <div className="printing-farm-hero">
      <div className="hero-container">
        {/* Left Categories Panel */}
        <div className="categories-panel">
          <div className="panel-header">
            <h2 className="panel-title">
              <span className="title-icon">🏭</span>
              Our Services
            </h2>
            <div className="panel-subtitle">Explore our 3D printing categories</div>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((category, index) => (
              <a
                key={index}
                href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-desc">{category.description}</p>
                </div>
                <div className="category-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right Slider Panel */}
        <div className="slider-panel">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            effect="fade"
            fadeEffect={{
              crossFade: true
            }}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active'
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="farm-slider"
          >
            {FARM_SLIDES.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="slide-content">
                  <div className="slide-background">
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.title}
                      className="hero-image"
                    />
                    <div className="slide-overlay"></div>
                  </div>

                  <div className="slide-text">
                    <div className="slide-accent">{slide.accent}</div>
                    <h1 className="slide-title">{slide.title}</h1>
                    <p className="slide-subtitle">{slide.subtitle}</p>
                    <button className="slide-cta">
                      {slide.cta}
                      <svg className="cta-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="custom-prev nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="custom-next nav-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Hero);