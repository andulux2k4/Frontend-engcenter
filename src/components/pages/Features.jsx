
import React from 'react';
import { FaGraduationCap, FaUsers, FaBook, FaChartLine, FaCertificate, FaHeadset } from 'react-icons/fa'
import '../../styles/pages/Features.css'

const Features = () => {
  const features = [
    {
      icon: <FaGraduationCap style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Giảng viên chuyên môn cao",
      description: "Đội ngũ giảng viên giàu kinh nghiệm, tốt nghiệp từ các trường đại học hàng đầu"
    },
    {
      icon: <FaUsers style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Lớp học tương tác",
      description: "Phương pháp học tập tương tác, thực hành trực tiếp với giảng viên và bạn học"
    },
    {
      icon: <FaBook style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Giáo trình chuẩn quốc tế",
      description: "Sử dụng giáo trình được biên soạn theo chuẩn quốc tế, phù hợp với người Việt"
    },
    {
      icon: <FaChartLine style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Lộ trình học tập rõ ràng",
      description: "Xây dựng lộ trình học tập cá nhân hóa, phù hợp với mục tiêu của từng học viên"
    },
    {
      icon: <FaCertificate style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Chứng chỉ quốc tế",
      description: "Cấp chứng chỉ được công nhận toàn cầu sau khi hoàn thành khóa học"
    },
    {
      icon: <FaHeadset style={{ color: 'rgb(179, 0, 0)' }} />,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp thắc mắc và hỗ trợ học viên mọi lúc"
    }
  ]

  return (
    <section className="features" id="features">
      <div className="features-container">
        <h2>Tại sao chọn chúng tôi?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features 