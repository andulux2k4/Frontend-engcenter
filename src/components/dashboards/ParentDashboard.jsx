import { useState } from 'react';
import '../../styles/dashboard/parent.css';
import {
  FaUserFriends,
  FaSignOutAlt,
  FaChartLine,
  FaChild,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaChartPie,
  FaBook,
  FaUser,
  FaChalkboardTeacher,
  FaStar,
  FaComments,
  FaDollarSign,
  FaCalendar,
  FaInfoCircle,
  FaCogs,
  FaCreditCard,
  FaClock,
  FaDoorOpen,
  FaCircle,
  FaUserCircle,
  FaUserGraduate,
  FaUserCheck
} from 'react-icons/fa';

function ParentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const mockData = {
    stats: {
      totalChildren: 2,
      totalCourses: 3,
      nextPayment: '25/03/2024',
      totalFees: '15.000.000'
    },
    children: [
      {
        id: 1,
        name: 'Alice Brown',
        age: 15,
        grade: '10',
        courses: [
          {
            name: 'IELTS Advanced',
            teacher: 'Sarah Johnson',
            attendance: '90%',
            progress: 'Excellent'
          },
          {
            name: 'TOEIC Preparation',
            teacher: 'John Smith',
            attendance: '85%',
            progress: 'Good'
          }
        ]
      },
      {
        id: 2,
        name: 'Bob Brown',
        age: 13,
        grade: '8',
        courses: [
          {
            name: 'English for Teens',
            teacher: 'Mary Wilson',
            attendance: '95%',
            progress: 'Very Good'
          }
        ]
      }
    ],
    payments: [
      {
        id: 1,
        child: 'Alice Brown',
        course: 'IELTS Advanced',
        amount: '5.000.000',
        dueDate: '25/03/2024',
        status: 'Chưa thanh toán'
      },
      {
        id: 2,
        child: 'Alice Brown',
        course: 'TOEIC Preparation',
        amount: '5.000.000',
        dueDate: '25/03/2024',
        status: 'Chưa thanh toán'
      },
      {
        id: 3,
        child: 'Bob Brown',
        course: 'English for Teens',
        amount: '5.000.000',
        dueDate: '25/03/2024',
        status: 'Chưa thanh toán'
      }
    ],
    schedule: [
      {
        id: 1,
        child: 'Alice Brown',
        course: 'IELTS Advanced',
        time: '18:00-20:00',
        date: 'Thứ 2, 18/03/2024',
        room: 'Phòng 101'
      },
      {
        id: 2,
        child: 'Alice Brown',
        course: 'TOEIC Preparation',
        time: '17:30-19:30',
        date: 'Thứ 3, 19/03/2024',
        room: 'Phòng 203'
      },
      {
        id: 3,
        child: 'Bob Brown',
        course: 'English for Teens',
        time: '15:00-17:00',
        date: 'Thứ 4, 20/03/2024',
        room: 'Phòng 102'
      }
    ]
  };

  const renderHeader = () => (
    <header className="parent-header">
      <h1>
        <FaUserFriends />
        Phụ huynh
      </h1>
      <div className="parent-info">
        <span> Xin chào, {user?.name}</span>
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
          className={`nav-item ${activeTab === 'children' ? 'active' : ''}`}
          onClick={() => setActiveTab('children')}
        >
          <FaChild />
          Con em
        </button>
        <button 
          className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <FaMoneyBillWave />
          Học phí
        </button>
      </nav>
    </aside>
  );

  const renderOverview = () => (
    <section>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaChartPie />
          Tổng quan
        </h2>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        padding: '0.5rem 0',
        overflowX: 'auto'
      }}>
        <div className="parent-card" style={{
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
              <FaChild />
              Số con em
            </h3>
            <p className="stat" style={{
              fontSize: '1.rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaUserFriends />
              {mockData.stats.totalChildren}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Con em đang theo học</p>
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
        
        <div className="parent-card" style={{
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
              <FaBook />
              Tổng khóa học
            </h3>
            <p className="stat" style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaBook />
              {mockData.stats.totalCourses}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Khóa học đang tham gia</p>
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
        
        <div className="parent-card" style={{
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
              <FaCalendarAlt />
              Thanh toán tới
            </h3>
            <p className="stat" style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaCalendarAlt />
              {mockData.stats.nextPayment}
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Hạn thanh toán</p>
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
        
        <div className="parent-card" style={{
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
              <FaMoneyBillWave />
              Tổng học phí
            </h3>
            <p className="stat" style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaMoneyBillWave />
              {mockData.stats.totalFees} VNĐ
            </p>
            <p style={{
              textAlign: 'center',
              color: '#666',
              fontSize: '0.9rem',
              margin: '0'
            }}>Học phí tháng này</p>
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

  const renderChildren = () => {
    // Tính toán pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mockData.children.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(mockData.children.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
    <section>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaChild />
          Con em của tôi
        </h2>
      </div>
        
        {/* Children Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1.5rem',
          padding: '0.5rem 0',
          overflowX: 'auto',
          marginBottom: '2rem'
        }}>
          {currentItems.map(child => (
            <div key={child.id} className="parent-card" style={{
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
                <FaUser />
                {child.name}
              </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaChild style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Tuổi:</span>
                <span>{child.age}</span>
              </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUserGraduate style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Lớp:</span>
                <span>{child.grade}</span>
              </p>
              <div className="courses-list">
                    <h4 style={{ color: '#b30000', marginBottom: '0.75rem' }}><FaBook /> Khóa học đang theo:</h4>
                {child.courses.map((course, index) => (
                      <div key={index} className="course-item" style={{
                        background: '#fef2f2',
                        border: '1px solid #fee2e2',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        marginBottom: '0.75rem'
                      }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                          <FaBook style={{ color: '#b30000', minWidth: '16px' }} />
                          <span style={{ fontWeight: '600', minWidth: '90px' }}>Khóa học:</span>
                      <span>{course.name}</span>
                    </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                          <FaChalkboardTeacher style={{ color: '#b30000', minWidth: '16px' }} />
                          <span style={{ fontWeight: '600', minWidth: '90px' }}>Giáo viên:</span>
                      <span>{course.teacher}</span>
                    </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                          <FaUserCheck style={{ color: '#b30000', minWidth: '16px' }} />
                          <span style={{ fontWeight: '600', minWidth: '90px' }}>Chuyên cần:</span>
                      <span>{course.attendance}</span>
                    </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
                          <FaStar style={{ color: '#b30000', minWidth: '16px' }} />
                          <span style={{ fontWeight: '600', minWidth: '90px' }}>Kết quả:</span>
                      <span>{course.progress}</span>
                    </p>
                  </div>
                ))}
              </div>
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
                  <FaChartLine />
                  <span>Tiến độ</span>
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
                  <FaComments />
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

  const renderPayments = () => {
    // Tính toán pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = mockData.payments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(mockData.payments.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    return (
    <section>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaMoneyBillWave />
          Quản lý học phí
        </h2>
      </div>
        
        {/* Payments Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1.5rem',
          padding: '0.5rem 0',
          overflowX: 'auto',
          marginBottom: '2rem'
        }}>
          {currentItems.map(payment => (
            <div key={payment.id} className="parent-card" style={{
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
                  <FaUser />
                  {payment.child}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaBook style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Khóa học:</span>
                    <span>{payment.course}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaDollarSign style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Số tiền:</span>
                    <span>{payment.amount} VNĐ</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCalendar style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Hạn nộp:</span>
                    <span>{payment.dueDate}</span>
                  </p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaInfoCircle style={{ color: '#b30000', minWidth: '16px' }} />
                    <span style={{ fontWeight: '600', minWidth: '80px' }}>Trạng thái:</span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      backgroundColor: payment.status === 'Đã thanh toán' ? '#d4edda' : '#fff3cd',
                      color: payment.status === 'Đã thanh toán' ? '#155724' : '#856404',
                      border: payment.status === 'Đã thanh toán' ? '1px solid #c3e6cb' : '1px solid #ffeaa7'
                    }}>
                  {payment.status}
                </span>
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
                  <FaCreditCard />
                  <span>Thanh toán</span>
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
      case 'children':
        return renderChildren();
      case 'payments':
        return renderPayments();
      default:
        return null;
    }
  };

  return (
    <div className="parent-dashboard">
      {renderHeader()}
      <div className="dashboard-content" style={{margin:0}}>
        {renderSidebar()}
        <main className="parent-main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default ParentDashboard; 