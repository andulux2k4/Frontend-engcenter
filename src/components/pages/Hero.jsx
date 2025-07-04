
import React from 'react';
import '../../styles/pages/Hero.css'

const Hero = () => {
  return (
    <section className="hero" id="home" style={{ background: 'linear-gradient(135deg, rgb(179, 0, 0) 0%, rgb(204, 0, 0) 100%)' }}>
      <div className="hero-container">
        <div className="hero-content">
          <h1>Chinh Phục Tiếng Anh Cùng Chúng Tôi</h1>
          <p>Khám phá phương pháp học tiếng Anh hiệu quả, được thiết kế riêng cho người Việt</p>
          <div className="hero-buttons">
            
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Học viên</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Hài lòng</p>
            </div>
            <div className="stat-item">
              <h3>8.0+</h3>
              <p>Điểm IELTS</p>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/fakeLogo.png" alt="Students learning English" />
        </div>
      </div>
    </section>
  )
}

export default Hero 