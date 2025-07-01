import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/common/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1 style={{ color: 'rgb(179, 0, 0)' }}>Trung Tâm Tiếng Anh</h1>
        </div>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#home">Trang chủ</a>
          <a href="#features">Tính năng</a>
          <a href="#courses">Khóa học</a>
          <a href="#testimonials">Đánh giá</a>
          <a href="#contact">Liên hệ</a>
          <a href="/login" className="cta-button"><span style={{ color: 'white' }}>Đăng nhập</span></a>
        </div>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 