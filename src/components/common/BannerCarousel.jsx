import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/common/BannerCarousel.css';

import banner1 from '../../assets/banner1.jpg';
import banner2 from '../../assets/banner2.jpg';
import banner3 from '../../assets/banner3.jpg';

const banners = [
  {
    img: banner1,
  },
  {
    img: banner2,
  },
  {
    img: banner3,
  },
];

const BannerCarousel = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Auto slide every 3s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const nextSlide = () => setCurrent((current + 1) % banners.length);
  const prevSlide = () => setCurrent((current - 1 + banners.length) % banners.length);

  return (
    <div className="banner-carousel" style={{ marginTop: '100px' }}>
      <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous slide">
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
          <FaChevronLeft size={32} />
        </span>
      </button>
      <div className="carousel-slide">
        <img src={banners[current].img} alt={banners[current].alt || ''} className="carousel-img" />
        <div className="carousel-caption">{banners[current].caption}</div>
      </div>
      <button className="carousel-btn next" onClick={nextSlide} aria-label="Next slide">
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48 }}>
          <FaChevronRight size={32} />
        </span>
      </button>
      <div className="carousel-dots">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
