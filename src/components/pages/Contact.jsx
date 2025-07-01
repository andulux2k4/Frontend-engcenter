import { useState } from 'react'
import '../../styles/pages/Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="contact-content">
          <h2>Đừng bỏ lỡ cơ hội!!</h2>
          <div className="contact-subtitle">
            <strong>Chinh phục thần tốc mục tiêu IELTS với IELTS Fighter!</strong><br />
            Hơn <span style={{color: 'rgb(179, 0, 0)', fontWeight: 600}}>300.000 học viên</span> đã thành công cán đích. Bạn có muốn trở thành người tiếp theo?
          </div>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Bạn hiện đang là?</option>
                <option value="foundation">Học sinh</option>
                <option value="intermediate">Sinh viên</option>
                <option value="advanced">Người đi làm</option>
              </select>
            </div>
            <div className="form-group">
              <select name="branch" required>
                <option value="">Cơ sở gần bạn nhất</option>
                <option value="cs1">Cơ sở 1</option>
                <option value="cs2">Cơ sở 2</option>
                <option value="cs3">Cơ sở 3</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="Bạn cần giải đáp điều gì?"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="submit-button">
              GIỮ CHỖ NGAY
            </button>
            <div className="form-note">
              Đăng ký ngay, nhận ưu đãi liền tay.<br />
              Cơ hội chỉ dành cho 100 bạn đầu tiên.<br />
              <span style={{color: 'rgb(179, 0, 0)'}}>Nhanh tay lên, chỉ còn 100 suất thôi!</span>
            </div>
            <div className="form-subnote">
              * Vui lòng để ý điện thoại, chúng tôi sẽ liên hệ lại sớm (trong vòng 24h)
            </div>
          </form>
        </div>
        <div className="contact-info">
          <h3>Thông tin liên hệ</h3>
          <div className="info-item">
            <strong>Địa chỉ:</strong>
            <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
          </div>
          <div className="info-item">
            <strong>Hotline:</strong>
            <p>0123 456 789</p>
          </div>
          <div className="info-item">
            <strong>Email:</strong>
            <p>info@trungtamtienganh.com</p>
          </div>
          <img className="contact-image" src="diachi.webp" alt="Thông tin trung tâm" />
        </div>
        
      </div>
    </section>
  )
}

export default Contact 