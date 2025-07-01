import { FaClock, FaCheck, FaGraduationCap } from 'react-icons/fa'
import '../../styles/pages/Courses.css'

const Courses = () => {
  const courses = [
    {
      title: "Khóa học IELTS Foundation",
      level: "Cơ bản",
      duration: "3 tháng",
      price: "4,500,000đ",
      features: [
        "Làm quen với format bài thi IELTS",
        "Xây dựng nền tảng ngữ pháp",
        "Phát triển từ vựng cơ bản",
        "Luyện tập 4 kỹ năng"
      ]
    },
    {
      title: "Khóa học IELTS Intermediate",
      level: "Trung cấp",
      duration: "4 tháng",
      price: "6,500,000đ",
      features: [
        "Nâng cao kỹ năng làm bài",
        "Chiến lược làm bài hiệu quả",
        "Luyện tập chuyên sâu",
        "Mock test định kỳ"
      ]
    },
    {
      title: "Khóa học IELTS Advanced Level 7.0+",
      level: "Nâng cao",
      duration: "3 tháng",
      price: "8,500,000đ",
      features: [
        "Luyện thi chuyên sâu",
        "Chiến thuật đạt điểm cao",
        "Phân tích đề thi thật",
        "Đảm bảo đầu ra 7.0+"
      ]
    }
  ]

  return (
    <section className="courses" id="courses">
      <div className="courses-container">
        <h2>Khóa học của chúng tôi</h2>
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div className="course-card" key={index}>
              <div className="course-header" style={{ backgroundColor: 'rgb(179, 0, 0)' }}>
                <h3>{course.title}</h3>
                <span className="course-level">
                  <FaGraduationCap /> {course.level}
                </span>
              </div>
              <div className="course-details">
                <p className="duration">
                  <FaClock /> Thời lượng: {course.duration}
                </p>
                <p className="price" style={{ color: 'rgb(179, 0, 0)' }}>
                  {course.price}
                </p>
              </div>
              <ul className="course-features">
                {course.features.map((feature, idx) => (
                  <li key={idx}>
                    <FaCheck style={{ color: 'rgb(179, 0, 0)', marginRight: '8px' }} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="enroll-button" 
                style={{ 
                  backgroundColor: 'rgb(179, 0, 0)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    backgroundColor: 'rgb(150, 0, 0)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Đăng ký ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses 