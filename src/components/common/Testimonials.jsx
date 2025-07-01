import '../../styles/pages/Testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nguyễn Văn Nam",
      score: "8.0",
      image: "/hh1.jpg",
      text: "Nhờ khóa học tại trung tâm, tôi đã đạt được mục tiêu IELTS 8.0. Giảng viên rất nhiệt tình và phương pháp học rất hiệu quả."
    },
    {
      name: "Trần Thị Bích Hằng",
      score: "7.5",
      image: "/hh2.jpg",
      text: "Môi trường học tập chuyên nghiệp, giáo viên có chuyên môn cao. Tôi đã cải thiện đáng kể kỹ năng Speaking và Writing."
    },
    {
      name: "Lê Văn Cường",
      score: "8.5",
      image: "/hh3.jpg",
      text: "Lộ trình học rõ ràng, tài liệu phong phú. Đặc biệt là các buổi mock test giúp tôi làm quen với áp lực phòng thi."
    }
  ]

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials-container">
        <h2>Học viên nói gì về chúng tôi?</h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-image">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <div className="testimonial-content">
                <h3>{testimonial.name}</h3>
                <div className="score">IELTS {testimonial.score}</div>
                <p>{testimonial.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials 