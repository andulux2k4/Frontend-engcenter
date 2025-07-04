import { FaUser, FaEnvelope, FaPhone, FaChalkboardTeacher, FaMoneyBill, FaCalendarAlt, FaCheckCircle, FaBook, FaDoorOpen } from 'react-icons/fa';

function formatDate(date) {
  if (!date) return '-';
  try {
    // Chỉ lấy ngày, không lấy giờ
    return new Date(date).toLocaleDateString('vi-VN');
  } catch {
    return date;
  }
}

function formatSchedule(schedule) {
  if (!schedule) return '-';
  if (typeof schedule === 'string') return schedule;
  const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = (schedule.daysOfLessonInWeek || []).map(d => daysMap[d] || '').filter(Boolean).join(', ');
  const start = schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('vi-VN') : '';
  const end = schedule.endDate ? new Date(schedule.endDate).toLocaleDateString('vi-VN') : '';
  return days && start && end ? `${days} (${start} - ${end})` : '-';
}


function CourseDetailModal({ open, onClose, courseDetail }) {
  if (!open || !courseDetail) return null;
  const course = courseDetail || {};
  // Ưu tiên lấy teacher từ teacherId nếu là object, nếu không thì từ course.teacher (string hoặc object)
  // Ưu tiên lấy teacher từ teacherId nếu là object, nếu không thì từ course.teacher (object hoặc string), nếu không thì lấy từ các trường dự phòng
  let teacher = {};
  if (course.teacherId && typeof course.teacherId === 'object') {
    teacher = course.teacherId;
  } else if (course.teacher && typeof course.teacher === 'object') {
    teacher = course.teacher;
  } else if (course.teacher && typeof course.teacher === 'string') {
    teacher = { name: course.teacher };
  } else if (course.email || course.phone) {
    teacher = { name: course.teacher || '-', email: course.email || '-', phoneNumber: course.phone || '-' };
  } else {
    teacher = {};
  }
  // Ưu tiên lấy startDate/endDate từ course nếu có, nếu không lấy từ schedule object
  let schedule = course.schedule || {};
  let startDate = course.startDate || schedule.startDate || null;
  let endDate = course.endDate || schedule.endDate || null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.18)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: 'linear-gradient(135deg, #fff 60%, #f7faff 100%)', borderRadius: 20, padding: 40, minWidth: 400, maxWidth: 540, boxShadow: '0 8px 40px rgba(179,0,0,0.18)', position: 'relative', border: '2px solid #b30000', animation: 'fadeIn .2s' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 22, background: 'none', border: 'none', fontSize: 32, color: '#b30000', cursor: 'pointer', fontWeight: 700, lineHeight: 1, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='#1976d2'} onMouseOut={e => e.target.style.color='#b30000'}>×</button>
        <h2 style={{ color: '#b30000', marginBottom: 22, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', gap: 12, letterSpacing: 0.5 }}>
          <FaBook style={{marginRight:10, fontSize: 28}} /> Thông tin lớp học
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* LỚP HỌC */}
          <div style={{ background: 'linear-gradient(120deg, #fff8f8 60%, #fff 100%)', borderRadius: 14, padding: 22, border: '1.5px solid #ffeaea', boxShadow: '0 2px 8px #f5eaea33', marginBottom: 2 }}>
            <div style={{ fontWeight: 700, color: '#b30000', fontSize: 19, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: 0.2 }}>
              <FaBook /> Lớp: <span style={{fontWeight:800}}>{course.className || course.name || '-'}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 36px', fontSize: 15.5, color: '#333', lineHeight: 1.7 }}>
              <div><b>Độ tuổi:</b> <span style={{fontWeight:500}}>{course.grade ?? course.age ?? '-'}</span></div>
              <div><b>Năm học:</b> <span style={{fontWeight:500}}>{course.year ?? '-'}</span></div>
              <div><b>Ngày bắt đầu:</b> <span style={{fontWeight:500}}>{startDate ? formatDate(startDate) : '-'}</span></div>
              <div><b>Ngày kết thúc:</b> <span style={{fontWeight:500}}>{endDate ? formatDate(endDate) : '-'}</span></div>
              <div><b>Lịch học:</b> <span style={{fontWeight:500}}>{formatSchedule(schedule)}</span></div>
              <div><b>Giá mỗi buổi:</b> <span style={{fontWeight:500, color:'#b30000'}}>{course.feePerLesson ? course.feePerLesson.toLocaleString() + ' VNĐ' : '-'}</span></div>
            </div>
          </div>
          {/* GIÁO VIÊN */}
          <div style={{ background: 'linear-gradient(120deg, #f7faff 60%, #fff 100%)', borderRadius: 14, padding: 22, border: '1.5px solid #e3f0ff', boxShadow: '0 2px 8px #e3f0ff33' }}>
            <div style={{ fontWeight: 700, color: '#1976d2', fontSize: 19, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, letterSpacing: 0.2 }}>
              <FaChalkboardTeacher /> Giáo viên
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 36px', fontSize: 15.5, color: '#333', lineHeight: 1.7 }}>
              <div><b>Tên giáo viên:</b> <span style={{fontWeight:500}}>{teacher.name || '-'}</span></div>
              <div><b>Email:</b> <span style={{fontWeight:500}}>{teacher.email || course.email || course.teacherEmail || '-'}</span></div>
              <div><b>Số điện thoại:</b> <span style={{fontWeight:500}}>{teacher.phoneNumber || course.phone || course.teacherPhone || '-'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailModal;
