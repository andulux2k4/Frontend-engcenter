import { useState } from 'react';
import '../../styles/dashboard/student.css';
import { 
  FaUserGraduate, 
  FaSignOutAlt, 
  FaChartLine, 
  FaBook, 
  FaTasks, 
  FaStar,
  FaChartPie,
  FaGraduationCap,
  FaCalendarCheck,
  FaFileAlt,
  FaUserCheck,
  FaCalendarDay,
  FaBookOpen,
  FaChalkboardTeacher,
  FaClock,
  FaDoorOpen,
  FaBookReader,
  FaInfoCircle,
  FaCogs,
  FaCalendar,
  FaComment,
  FaUpload,
  FaUserCircle
} from 'react-icons/fa';

function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const mockData = {
    stats: {
      totalCourses: 2,
      attendance: '92%',
      nextExam: '25/03/2024',
      averageScore: '8.5'
    },
    courses: [
      {
        id: 1,
        name: 'IELTS Advanced',
        teacher: 'Sarah Johnson',
        schedule: 'Thứ 2,4,6 - 18:00-20:00',
        room: 'Phòng 101',
        progress: '75%',
        attendance: '90%',
        nextLesson: 'Unit 7: Academic Writing'
      },
      {
        id: 2,
        name: 'TOEIC Preparation',
        teacher: 'John Smith',
        schedule: 'Thứ 3,5 - 17:30-19:30',
        room: 'Phòng 203',
        progress: '60%',
        attendance: '95%',
        nextLesson: 'Unit 5: Listening Skills'
      },
      {
        id: 3,
        name: 'Business English',
        teacher: 'Emily Davis',
        schedule: 'Thứ 2,3,5 - 19:00-21:00',
        room: 'Phòng 105',
        progress: '45%',
        attendance: '88%',
        nextLesson: 'Unit 3: Business Communication'
      },
      {
        id: 4,
        name: 'Conversation Skills',
        teacher: 'Michael Brown',
        schedule: 'Thứ 4,6 - 16:00-18:00',
        room: 'Phòng 102',
        progress: '80%',
        attendance: '92%',
        nextLesson: 'Unit 6: Daily Conversations'
      },
      {
        id: 5,
        name: 'Grammar Foundation',
        teacher: 'Lisa Wilson',
        schedule: 'Thứ 2,5 - 17:00-19:00',
        room: 'Phòng 104',
        progress: '30%',
        attendance: '85%',
        nextLesson: 'Unit 2: Past Tenses'
      }
    ],
    assignments: [
      {
        id: 1,
        course: 'IELTS Advanced',
        title: 'Writing Task 2 Essay',
        dueDate: '20/03/2024',
        status: 'Chưa nộp'
      },
      {
        id: 2,
        course: 'TOEIC Preparation',
        title: 'Reading Practice Test',
        dueDate: '22/03/2024',
        status: 'Chưa nộp'
      }
    ],
    grades: [
      {
        id: 1,
        course: 'IELTS Advanced',
        assessment: 'Writing Task 1',
        score: '7.5/9.0',
        date: '10/03/2024',
        feedback: 'Good structure, need improvement in vocabulary'
      },
      {
        id: 2,
        course: 'TOEIC Preparation',
        assessment: 'Mock Test 1',
        score: '750/990',
        date: '12/03/2024',
        feedback: 'Excellent progress in listening section'
      }
    ]
  };

  const renderHeader = () => (
    <header className="dashboard-header">
      <h1>
        <FaUserGraduate />
        Học viên
      </h1>
      <div className="user-info">
        <span>Xin chào, {user?.name}</span>
        <button onClick={onLogout} className="logout-btn">
          <FaSignOutAlt />
          Đăng xuất
        </button>
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <nav className="nav-menu">
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine />
          Tổng quan
        </button>
        <button 
          className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          <FaBook />
          Khóa học
        </button>
      </nav>
    </aside>
  );

  const renderOverview = () => (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <FaChartPie />
          Tổng quan học tập
        </h2>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        padding: '0.5rem 0',
        overflowX: 'auto'
      }}>
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(179, 0, 0, 0.15)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaGraduationCap />
              Khóa học
            </h3>
            <p className="stat" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaBookOpen />
              {mockData.stats.totalCourses}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Khóa học đang theo học</p>
          </div>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(179, 0, 0, 0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
        </div>
        
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(179, 0, 0, 0.15)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaCalendarCheck />
              Chuyên cần
            </h3>
            <p className="stat" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaUserCheck />
              {mockData.stats.attendance}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Tỷ lệ tham gia</p>
          </div>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(179, 0, 0, 0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
        </div>
        
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(179, 0, 0, 0.15)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaFileAlt />
              Kỳ thi tới
            </h3>
            <p className="stat" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaCalendarDay />
              {mockData.stats.nextExam}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Ngày thi</p>
          </div>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(179, 0, 0, 0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
        </div>
        
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(179, 0, 0, 0.15)';
        }} onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaChartLine />
              Điểm trung bình
            </h3>
            <p className="stat" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaStar />
              {mockData.stats.averageScore}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Điểm trung bình các môn</p>
          </div>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(179, 0, 0, 0.1)',
            borderRadius: '50%',
            zIndex: 0
          }}></div>
        </div>
      </div>
    </section>
  );

  const renderCourses = () => {
    // Tính toán pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mockData.courses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(mockData.courses.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
      <section>
        <div className="section-header">
          <h2 className="section-title">
            <FaBook />
            Khóa học của tôi
          </h2>
        </div>
        
        {/* Courses Container */}
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
            }} onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(179, 0, 0, 0.15)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
            }}>
              <div className="card-content">
                <h3 style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  color: '#b30000',
                  marginBottom: '1rem'
                }}>
                  <FaBook />
                  {course.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaChalkboardTeacher style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Giáo viên:</span>
                    <span className="value">{course.teacher}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaClock style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Lịch học:</span>
                    <span className="value">{course.schedule}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaDoorOpen style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Phòng học:</span>
                    <span className="value">{course.room}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaTasks style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Tiến độ:</span>
                    <span className="value">{course.progress}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUserCheck style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Chuyên cần:</span>
                    <span className="value">{course.attendance}</span>
                  </p>
                  
                </div>
              </div>
              <div className="action-buttons" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem',
                padding: '1rem',
                borderTop: '1px solid #ffebee'
              }}>
                <button className="btn btn-secondary" style={{
                  backgroundColor: 'white',
                  border: '1px solid #0066cc',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#0066cc';
                  e.currentTarget.style.color = 'white';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#0066cc';
                }}>
                  <FaBookReader />
                  <span>Tài liệu</span>
                </button>
                <button className="btn btn-secondary" style={{
                  backgroundColor: 'white',
                  border: '1px solid #28a745',
                  padding: '0.5rem 1rem',
                  borderRadius: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.3s ease'
                }} onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.color = 'white';
                }} onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#28a745';
                }}>
                  <FaComment />
                  <span>Liên hệ GV</span>
                </button>
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
            marginTop: '2rem'
          }}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(pageNumber)}
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
              onClick={() => handlePageChange(currentPage + 1)}
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
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'courses':
        return renderCourses();
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {renderHeader()}
      <div className="dashboard-content">
        {renderSidebar()}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard; 