import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiUser, FiLogOut, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../../styles/common/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  //const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <h1 style={{ color: 'rgb(179, 0, 0)' }}>Trung Tâm Tiếng Anh Episteme</h1>
        </div>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#home">Trang chủ</a>
          <a href="#features">Tính năng</a>
          <a href="#courses">Khóa học</a>
          <a href="#testimonials">Đánh giá</a>
          <a href="#contact">Liên hệ</a>
          
          {user ? (
            <div className="user-section">
              <div className="hamburger-menu">
                <button 
                  className="hamburger-btn"
                  onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                >
                  <FiUser className="user-icon" />
                </button>
                
                {showHamburgerMenu && (
                  <div className="hamburger-dropdown">
                    <Link 
                      to="/dashboard"
                      className="menu-item"
                      onClick={() => setShowHamburgerMenu(false)}
                    >
                      <FiUser className="icon" />
                      Quản lý
                    </Link>
                   
                    <button 
                      className="menu-item"
                      onClick={() => {
                        onLogout();
                        setShowHamburgerMenu(false);
                      }}
                    >
                      <FiLogOut className="icon" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="cta-button"
            >
              <span style={{ color: 'white' }}>Đăng nhập</span>
            </Link>
          )}
        </div>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;