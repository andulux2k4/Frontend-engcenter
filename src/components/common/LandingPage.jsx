import React from 'react';
import Navbar from './Navbar';
import Hero from '../pages/Hero';
import Features from '../pages/Features';
import Courses from '../pages/Courses';
import Testimonials from './Testimonials';
import Contact from '../pages/Contact';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
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