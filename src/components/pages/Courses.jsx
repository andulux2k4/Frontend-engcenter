import React, { useState, useEffect } from 'react';
import { FaClock, FaCheck, FaGraduationCap, FaSpinner, FaCalendar } from 'react-icons/fa'
import apiService from '../../services/api';
import '../../styles/pages/Courses.css'

const Courses = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📢 Fetching advertisements from API...');
      const response = await apiService.getPublicAdvertisements();
      
      console.log('📥 Advertisements API Response:', response);
      
      if (response.success && response.data) {
        setAdvertisements(response.data);
        console.log('✅ Advertisements loaded successfully:', response.data.length, 'items');
      } else {
        console.log('⚠️ No advertisements found or API error:', response);
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('❌ Error fetching advertisements:', error);
      
      // More specific error messages based on error type
      if (error.message.includes('500')) {
        setError('Server đang gặp sự cố kỹ thuật. Hiển thị thông tin khóa học cơ bản.');
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else if (error.message.includes('cloudinaryService')) {
        setError('Dịch vụ hình ảnh đang bảo trì. Hiển thị thông tin khóa học cơ bản.');
      } else {
        setError('Không thể tải thông tin khóa học từ server. Hiển thị thông tin cơ bản.');
      }
      
      setAdvertisements([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fallback data if API fails or no data
  const fallbackCourses = [
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
  ];

  // Use API data if available, otherwise use fallback
  const displayCourses = advertisements.length > 0 ? advertisements : fallbackCourses;

  if (loading) {
    return (
      <section className="courses" id="courses">
        <div className="courses-container">
          <h2>Khóa học của chúng tôi</h2>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <FaSpinner style={{ 
              fontSize: '40px', 
              color: 'rgb(179, 0, 0)',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#666', fontSize: '16px' }}>Đang tải thông tin khóa học...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="courses" id="courses">
      <div className="courses-container">
        <h2>Khóa học của chúng tôi</h2>
        
        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #f5c6cb',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>{error}</p>
            <button 
              onClick={fetchAdvertisements}
              style={{
                background: 'rgb(179, 0, 0)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
              onMouseOver={(e) => e.target.style.background = '#990000'}
              onMouseOut={(e) => e.target.style.background = 'rgb(179, 0, 0)'}
            >
              Thử lại
            </button>
          </div>
        )}
        
        <div className="courses-grid">
          {displayCourses.map((course, index) => {
            // Check if this is API data or fallback data
            const isApiData = course._id && course.title && course.content;
            
            return (
              <div 
                className="course-card" 
                key={course._id || index} 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  background: 'white',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                }}
              >
                {/* Phần 1: Ảnh */}
                <div className="course-image-section" style={{
                  height: '250px',
                  overflow: 'hidden',
                  borderTopLeftRadius: '15px',
                  borderTopRightRadius: '15px',
                  position: 'relative'
                }}>
                  {isApiData && course.images && course.images.length > 0 ? (
                    <img 
                      src={course.images[0].thumbnailUrl || course.images[0].url} 
                      alt={course.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgb(179, 0, 0)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    >
                      {course.title?.charAt(0) || 'K'}
                    </div>
                  )}
                </div>

                {/* Phần 2: Thông tin - Ngày, Tên, Nội dung */}
                <div className="course-info-section" style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  backgroundColor: 'white'
                }}>
                  {/* 1. Ngày */}
                  <div className="course-date" style={{
                    marginBottom: '15px'
                  }}>
                    {isApiData ? (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <FaCalendar style={{ color: 'rgb(179, 0, 0)' }} />
                        <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: '#666',
                        fontSize: '14px'
                      }}>
                        <FaClock style={{ color: 'rgb(179, 0, 0)' }} />
                        <span>Thời lượng: {course.duration || 'Liên hệ'}</span>
                      </div>
                    )}
                  </div>

                  {/* 2. Tên */}
                  <div className="course-title" style={{
                    marginBottom: '15px'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      color: '#333',
                      lineHeight: '1.3'
                    }}>
                      {course.title}
                    </h3>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(179, 0, 0, 0.1)',
                      color: 'rgb(179, 0, 0)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '8px'
                    }}>
                      <FaGraduationCap />
                      {isApiData ? 'Quảng cáo' : (course.level || 'Khóa học')}
                </span>
              </div>

                  {/* 3. Nội dung */}
                  <div className="course-content" style={{
                    flex: 1,
                    lineHeight: '1.6',
                    color: '#555'
                  }}>
                    {isApiData ? (
                      <div>
                        {course.content}
              </div>
                    ) : (
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {(course.features || []).map((feature, idx) => (
                          <li key={idx} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '12px',
                            fontSize: '14px'
                          }}>
                            <FaCheck style={{ 
                              color: 'rgb(179, 0, 0)', 
                              marginRight: '8px',
                              marginTop: '2px',
                              flexShrink: 0
                            }} />
                    {feature}
                  </li>
                ))}
              </ul>
                    )}
                  </div>

                  {/* Price for fallback data */}
                  {!isApiData && course.price && (
                    <div style={{
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee'
                    }}>
                      <p style={{
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'rgb(179, 0, 0)',
                        margin: 0
                      }}>
                        {course.price}
                      </p>
                    </div>
                  )}
                </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Courses; 