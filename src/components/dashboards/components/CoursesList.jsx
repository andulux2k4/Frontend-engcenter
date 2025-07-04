

import React, { useState } from 'react';
import { FaBook, FaChalkboardTeacher, FaClock, FaDoorOpen, FaTasks, FaBookReader, FaCalendar } from 'react-icons/fa';
import CourseDetailModal from './modals/CourseDetailModal';

function CoursesList({ courses, currentPage, itemsPerPage, onPageChange }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Đảm bảo teacher là object nếu có, và schedule là string đẹp
  const currentItems = courses.slice(indexOfFirstItem, indexOfLastItem).map(course => {
    let teacher = course.teacher;
    if (!teacher && course.teacherId && typeof course.teacherId === 'object') {
      teacher = course.teacherId.userId || course.teacherId;
    }
    // Format schedule nếu là object
    let schedule = course.schedule;
    if (typeof schedule === 'object' && schedule !== null) {
      // Dùng lại logic formatSchedule từ modal nếu muốn đồng bộ
      const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const days = (schedule.daysOfLessonInWeek || []).map(d => daysMap[d] || '').filter(Boolean).join(', ');
      const start = schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('vi-VN') : '';
      const end = schedule.endDate ? new Date(schedule.endDate).toLocaleDateString('vi-VN') : '';
      schedule = days && start && end ? `${days} (${start} - ${end})` : '-';
    }
    return {
      ...course,
      teacher,
      schedule
    };
  });
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  const handleOpenModal = (course) => {
    setSelectedCourse(course);
  };
  const handleCloseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <FaBook />
          Khóa học của tôi
        </h2>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        padding: '0.5rem 0',
        overflowX: 'auto',
        marginBottom: '2rem'
      }}>
        {currentItems.map(course => (
          <div key={course.id} className="card" style={{
            minWidth: '300px',
            flex: '1',
            background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
            border: '2px solid #ffebee',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
            onClick={() => handleOpenModal(course)}
          >
            <div className="card-content">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', marginBottom: '1rem' }}>
                <FaBook />
                {course.name}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendar style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Năm học:</span>
                  <span className="value">{course.year || '-'}</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaChalkboardTeacher style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Giáo viên:</span>
                  <span className="value">{typeof course.teacher === 'object' ? course.teacher?.name : course.teacher || '-'}</span>
                </p>
                 <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaBookReader style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Độ tuổi:</span>
                  <span className="value">{course.age || '-'}</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaClock style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Lịch học:</span>
                  <span className="value">{course.schedule || '-'}</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaTasks style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Trạng thái:</span>
                  <span className="value">{course.status || '-'}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal hiển thị chi tiết */}
      {selectedCourse && (
        <CourseDetailModal open={true} onClose={handleCloseModal} courseDetail={selectedCourse} />
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #b30000',
              backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
              color: currentPage === 1 ? '#999' : '#b30000',
              borderRadius: '5px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #b30000',
                backgroundColor: currentPage === pageNumber ? '#b30000' : 'white',
                color: currentPage === pageNumber ? 'white' : '#b30000',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #b30000',
              backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
              color: currentPage === totalPages ? '#999' : '#b30000',
              borderRadius: '5px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Sau
          </button>
        </div>
      )}
    </section>
  );
}

export default CoursesList;
