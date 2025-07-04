import React, { useState } from "react";
import { FaChild, FaUser, FaUserGraduate, FaBook, FaChalkboardTeacher, FaUserCheck, FaCalendarCheck, FaCalendarTimes, FaPercentage, FaClipboardList, FaPhone, FaEnvelope, FaTimes, FaEye, FaGraduationCap } from "react-icons/fa";

function ChildrenList({ children, currentPage, itemsPerPage, onPageChange }) {
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = children.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(children.length / itemsPerPage);

  const handleCardClick = (child) => {
    setSelectedChild(child);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setShowDetailModal(false);
    setSelectedChild(null);
  };

  return (
    <section style={{ marginTop: '64px', padding: '0 220px 0 0' }}>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaChild />
          Con em của tôi
        </h2>
      </div>
      
      {/* Cards Grid */}
      <div className="parent-card-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        padding: '1.5rem 0',
        width: '100%',
        minWidth: 0,
        maxWidth: '1200px',
        margin: '0 auto',
        justifyItems: 'center'
      }}>
        {currentItems.map(child => (
          <div 
            key={child.id || child._id} 
            className="parent-card"
            onClick={() => handleCardClick(child)}
            style={{ 
              minWidth: '320px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              padding: '2rem 1.5rem 1.5rem 1.5rem',
              borderRadius: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(179, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Header với tên học sinh */}
            <div style={{
              background: 'linear-gradient(135deg, rgb(179, 0, 0))',
              margin: '-2rem -1.5rem 2rem -1.5rem',
              padding: '1.25rem 1.5rem',
              color: 'white',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }}>
              <h3 style={{ 
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fff'
              }}>
                <FaUser />
                {child.name}
              </h3>
            </div>
            
            {/* Khóa học đang theo */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ 
                color: '#b30000', 
                marginBottom: '0.75rem', 
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaGraduationCap />
                Khóa học đang theo
              </h4>
              <div style={{ 
                background: '#fff5f5', 
                border: '1px solid #ffebee', 
                borderRadius: '8px', 
                padding: '0.75rem' 
              }}>
                {(child.courses || child.classes || []).slice(0, 2).map((course, index) => (
                  <div key={index} style={{ 
                    marginBottom: index < 1 ? '0.75rem' : '0', 
                    paddingBottom: index < 1 ? '0.75rem' : '0',
                    borderBottom: index < 1 ? '1px solid #ffebee' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      <FaBook style={{ color: '#b30000', fontSize: '0.8rem' }} />
                      {course.name || course.className || '-'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', flexDirection: 'column', gap: '0.2rem', marginLeft: '1.5rem' }}>
                      <span><strong>Khối:</strong> {course.grade || '-'}</span>
                      <span><strong>Gíao viên:</strong> {course.teacher?.name || '-'}</span>
                      <span><strong>Email:</strong> {course.teacher?.email || '-'}</span>
                    </div>
                  </div>
                ))}
                {(child.courses || child.classes || []).length > 2 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    fontSize: '0.8rem', 
                    fontStyle: 'italic',
                    marginTop: '0.5rem'
                  }}>
                    +{(child.courses || child.classes || []).length - 2} khóa học khác
                  </div>
                )}
              </div>
            </div>

            {/* Tổng quan điểm danh */}
            <div>
              <h4 style={{ 
                color: '#b30000', 
                marginBottom: '0.75rem', 
                fontSize: '0.95rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FaClipboardList />
                Tổng quan điểm danh
              </h4>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '0.5rem'
              }}>
                <div className="status-badge success" style={{ 
                  justifyContent: 'center',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  minWidth: '110px',
                  textAlign: 'center'
                }}>
                  <FaCalendarCheck />
                  Đi: {child.totalAttended || 0}
                </div>
                <div className="status-badge" style={{ 
                  backgroundColor: '#fef2f2',
                  color: '#dc2626',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  minWidth: '110px',
                  textAlign: 'center'
                }}>
                  <FaCalendarTimes />
                  Vắng: {child.totalAbsent || 0}
                </div>
                <div className="status-badge" style={{ 
                  backgroundColor: '#faf5ff',
                  color: '#7c3aed',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  minWidth: '110px',
                  textAlign: 'center'
                }}>
                  <FaBook />
                  Tổng: {child.totalLessons || 0}
                </div>
                <div className="status-badge" style={{ 
                  backgroundColor: '#f0f9ff',
                  color: '#0891b2',
                  justifyContent: 'center',
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  minWidth: '110px',
                  textAlign: 'center'
                }}>
                  <FaPercentage />
                  {child.overallAttendanceRate || '0'}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginTop: '2rem',
          padding: '1rem 0'
        }}>
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`btn ${currentPage === 1 ? 'btn-secondary' : 'btn-primary'}`}
            style={{ 
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
            <button 
              key={pageNumber} 
              onClick={() => onPageChange(pageNumber)}
              className={`btn ${currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'}`}
              style={{ minWidth: '40px' }}
            >
              {pageNumber}
            </button>
          ))}
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`btn ${currentPage === totalPages ? 'btn-secondary' : 'btn-primary'}`}
            style={{ 
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal chi tiết */}
      {showDetailModal && selectedChild && (
        <div className="modal">
          <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #b30000 0%, #800000 100%)',
              margin: '-2.5rem -2.5rem 2rem -2.5rem',
              padding: '1.5rem 2.5rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ 
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#fff'
              }}>
                <FaUser />
                Chi tiết học sinh: {selectedChild.name} 
              </h2>
              <button 
                onClick={closeModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Content */}
            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Thông tin cơ bản */}
              <div className="parent-card" style={{ margin: 0 }}>
                <h3 style={{ 
                  color: '#b30000', 
                  marginBottom: '1rem', 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaUser /> Thông tin cơ bản
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaEnvelope style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600' }}>Email:</span>
                    <span>{selectedChild.email || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPhone style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600' }}>Số điện thoại:</span>
                    <span>{selectedChild.phone || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUser style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600' }}>Giới tính:</span>
                    <span>{selectedChild.gender || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Tổng quan điểm danh */}
              <div className="parent-card" style={{ margin: 0 }}>
                <h3 style={{ 
                  color: '#b30000', 
                  marginBottom: '1rem', 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaClipboardList /> Tổng quan điểm danh
                </h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                  gap: '1rem' 
                }}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#e6f4ea', 
                    borderRadius: '8px',
                    border: '1px solid #c8e6c9'
                  }}>
                    <FaCalendarCheck style={{ color: '#137333', fontSize: '2rem', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Đi học</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#137333' }}>
                      {selectedChild.totalAttended || 0}
                    </p>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#fef2f2', 
                    borderRadius: '8px',
                    border: '1px solid #fecaca'
                  }}>
                    <FaCalendarTimes style={{ color: '#dc2626', fontSize: '2rem', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Vắng mặt</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#dc2626' }}>
                      {selectedChild.totalAbsent || 0}
                    </p>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#faf5ff', 
                    borderRadius: '8px',
                    border: '1px solid #e9d5ff'
                  }}>
                    <FaBook style={{ color: '#7c3aed', fontSize: '2rem', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Tổng buổi</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#7c3aed' }}>
                      {selectedChild.totalLessons || 0}
                    </p>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: '#f0f9ff', 
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <FaPercentage style={{ color: '#0891b2', fontSize: '2rem', marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Tỷ lệ tham gia</p>
                    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700', color: '#0891b2' }}>
                      {selectedChild.overallAttendanceRate || '0'}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi tiết từng khóa học */}
              <div>
                <h3 style={{ 
                  color: '#b30000', 
                  marginBottom: '1rem', 
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FaGraduationCap /> Chi tiết từng khóa học
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {(selectedChild.courses || selectedChild.classes || []).map((course, index) => (
                    <div key={index} className="parent-card" style={{ margin: 0 }}>
                      <h4 style={{ 
                        color: '#b30000', 
                        marginBottom: '1rem', 
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <FaBook />
                        {course.name || course.className || `Khóa học ${index + 1}`}
                      </h4>
                      
                      {/* Thông tin khóa học */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '0.75rem', 
                        marginBottom: '1rem',
                        padding: '0.75rem',
                        background: '#fff5f5',
                        borderRadius: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaUserGraduate style={{ color: '#b30000', minWidth: '14px' }} />
                          <span style={{ fontWeight: '600' }}>Khối:</span>
                          <span>{course.grade || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaChalkboardTeacher style={{ color: '#b30000', minWidth: '14px' }} />
                          <span style={{ fontWeight: '600' }}>Giáo viên:</span>
                          <span>{course.teacher?.name || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaPhone style={{ color: '#b30000', minWidth: '14px' }} />
                          <span style={{ fontWeight: '600' }}>SĐT:</span>
                          <span>{course.teacher?.phone || '-'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FaEnvelope style={{ color: '#b30000', minWidth: '14px' }} />
                          <span style={{ fontWeight: '600' }}>Email:</span>
                          <span>{course.teacher?.email || '-'}</span>
                        </div>
                      </div>

                      {/* Điểm danh khóa học */}
                      {course.attendance && (
                        <div>
                          <h5 style={{ 
                            color: '#b30000', 
                            marginBottom: '0.75rem', 
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <FaUserCheck /> Điểm danh khóa học này:
                          </h5>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                            gap: '0.75rem', 
                            marginBottom: '1rem' 
                          }}>
                            <div className="status-badge success" style={{ 
                              flexDirection: 'column', 
                              padding: '0.75rem',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Đi học</span>
                              <span style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                                {course.attendance.attendedLessons || 0}
                              </span>
                            </div>
                            <div className="status-badge" style={{ 
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              flexDirection: 'column', 
                              padding: '0.75rem',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Vắng mặt</span>
                              <span style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                                {course.attendance.absentLessons || 0}
                              </span>
                            </div>
                            <div className="status-badge" style={{ 
                              backgroundColor: '#faf5ff',
                              color: '#7c3aed',
                              flexDirection: 'column', 
                              padding: '0.75rem',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Tổng buổi</span>
                              <span style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                                {course.attendance.totalLessons || 0}
                              </span>
                            </div>
                            <div className="status-badge" style={{ 
                              backgroundColor: '#f0f9ff',
                              color: '#0891b2',
                              flexDirection: 'column', 
                              padding: '0.75rem',
                              textAlign: 'center'
                            }}>
                              <span style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Tỷ lệ</span>
                              <span style={{ fontSize: '1.4rem', fontWeight: '700' }}>
                                {course.attendance.attendanceRate || '0'}%
                              </span>
                            </div>
                          </div>

                          {/* Ngày vắng gần đây */}
                          {course.attendance.absentDates && course.attendance.absentDates.length > 0 && (
                            <div>
                              <h6 style={{ 
                                color: '#dc2626', 
                                fontSize: '0.9rem', 
                                marginBottom: '0.5rem', 
                                fontWeight: '600' 
                              }}>
                                Buổi vắng:
                              </h6>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {course.attendance.absentDates.slice(-5).map((absent, idx) => (
                                  <span key={idx} className="status-badge" style={{ 
                                    backgroundColor: '#fef2f2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    fontSize: '0.8rem'
                                  }}>
                                    {new Date(absent.date).toLocaleDateString('vi-VN')} (Buổi {absent.lessonNumber})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ChildrenList;
