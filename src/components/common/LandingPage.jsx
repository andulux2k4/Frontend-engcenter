import React from 'react';
import Navbar from './Navbar';
import Hero from '../pages/Hero';
import Features from '../pages/Features';
import Courses from '../pages/Courses';
import Testimonials from './Testimonials';
import Contact from '../pages/Contact';
import BannerCarousel from './BannerCarousel';

const LandingPage = ({ user, onLogout, onGoHome }) => {
  return (
    <div className="landing-page">
      <Navbar user={user} onLogout={onLogout} onGoHome={onGoHome} />
      <main>
        <div style={{ marginTop: '135px' }}>
          {/* Banner Carousel ở đầu trang */}
          <BannerCarousel />
        </div>
        <Hero />
        <Features />
        <Courses />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
};

export default LandingPage; 