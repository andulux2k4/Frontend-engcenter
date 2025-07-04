import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaGlobe } from 'react-icons/fa'
import '../../styles/pages/Contact.css'

const Contact = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        {/* Header Section */}
        <div className="contact-header">
          <h2>Liên hệ với chúng tôi</h2>
          <p className="contact-description">
            Chinh phục thần tốc mục tiêu IELTS với IELTS Fighter!<br />
            Hơn <span className="highlight">300.000 học viên</span> đã thành công cán đích.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="contact-cards">
          <div className="contact-card">
            <div className="card-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="card-content">
              <h3>Địa chỉ</h3>
              <p>123 Đường ABC, Quận XYZ<br />TP. Hồ Chí Minh</p>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FaPhone />
            </div>
            <div className="card-content">
              <h3>Hotline</h3>
              <p>0123 456 789</p>
              <span className="availability">24/7 Hỗ trợ</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="card-icon">
              <FaEnvelope />
            </div>
            <div className="card-content">
              <h3>Email</h3>
              <p>info@trungtamtienganh.com</p>
              <span className="availability">Phản hồi trong 24h</span>
            </div>
          </div>

          
        </div>

        {/* Additional Info */}
        <div className="contact-footer">
          <div className="footer-content">
            <div className="social-links">
              <h4>Theo dõi chúng tôi</h4>
              <div className="social-icons">
                <a href="#" className="social-icon">Facebook</a>
                <a href="#" className="social-icon">Instagram</a>
                <a href="#" className="social-icon">YouTube</a>
              </div>
            </div>
            <div className="cta-section">
              <h4>Sẵn sàng bắt đầu?</h4>
              <p>Đăng ký ngay để nhận tư vấn miễn phí và ưu đãi đặc biệt!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact 