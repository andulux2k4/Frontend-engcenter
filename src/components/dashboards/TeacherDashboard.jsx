import React, { useState, useEffect } from 'react'
import apiService from '../../services/api'
import '../Dashboard.css'
import '../../styles/dashboard/teacher.css'
import { FiUser, FiLogOut, FiEdit, FiTrash2, FiEye, FiUsers, FiPhone, FiMail, FiLock, FiSave, FiX, FiBook, FiCalendar, FiClock, FiMapPin, FiBarChart2, FiFileText, FiCheckCircle, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi'
import { HiAcademicCap } from 'react-icons/hi'
import { BsGraphUp } from 'react-icons/bs'

function TeacherDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('classes')
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState({
    classes: [],
    students: [],
    schedule: {}
  })
  const [error, setError] = useState(null)

  // Fetch API data khi component mount và khi tab thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Test connection trước
        console.log('🧪 Kiểm tra kết nối server...')
        const isConnected = await apiService.testConnection()
        
        if (!isConnected) {
          console.warn('⚠️ Không thể kết nối server hoặc có CORS issue, sử dụng mock data')
          setError('Demo Mode: Đang hiển thị dữ liệu mẫu do CORS policy.')
          
          // Fallback to mock data
          if (activeTab === 'classes') {
            setApiData(prev => ({ ...prev, classes: getMockClasses() }))
          } else if (activeTab === 'schedule') {
            setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
          }
          setLoading(false)
          return
        }
        
        console.log('✅ Server connection OK, kiểm tra authentication...')
        
        // Kiểm tra đăng nhập
        const token = await apiService.ensureAuthentication()
        
        if (!token) {
          console.warn('⚠️ Không thể đăng nhập, sử dụng mock data')
          setError('Demo Mode: Không thể đăng nhập. Đang hiển thị dữ liệu mẫu.')
          
          // Fallback to mock data
          if (activeTab === 'classes') {
            setApiData(prev => ({ ...prev, classes: getMockClasses() }))
          } else if (activeTab === 'schedule') {
            setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
          }
          setLoading(false)
          return
        }

        console.log('✅ Token hợp lệ, tiếp tục gọi API...')

        if (activeTab === 'classes') {
          console.log('🔄 Đang lấy danh sách lớp học...')
          const response = await apiService.getTeacherClasses(token)
          
          if (response.success) {
            console.log('✅ Lấy lớp học thành công:', response.classes.length, 'lớp')
            console.log('📚 Classes data:', response.classes)
            setApiData(prev => ({ ...prev, classes: response.classes }))
            setError(null) // Clear any previous errors
          } else {
            console.warn('⚠️ API lỗi, fallback về mock data:', response.message)
            setError(`API Error: ${response.message}. Đang hiển thị dữ liệu mẫu.`)
            setApiData(prev => ({ ...prev, classes: getMockClasses() }))
          }
        } else if (activeTab === 'schedule') {
          console.log('🔄 Đang lấy lịch dạy...')
          const response = await apiService.getTeacherSchedule(token)
          
          if (response.success) {
            console.log('✅ Lấy lịch dạy thành công:', Object.keys(response.schedule).length, 'ngày có lịch')
            console.log('📅 Schedule data:', response.schedule)
            setApiData(prev => ({ ...prev, schedule: response.schedule }))
            setError(null) // Clear any previous errors
          } else {
            console.warn('⚠️ API lỗi, fallback về mock data:', response.message)
            setError(`API Error: ${response.message}. Đang hiển thị dữ liệu mẫu.`)
            setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
          }
        }
      } catch (error) {
        console.error('❌ Lỗi khi gọi API:', error)
        
        // Handle different types of errors
        if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
          setError('Demo Mode: CORS policy chặn kết nối. Đang hiển thị dữ liệu mẫu.')
        } else if (error.message.includes('403') || error.message.includes('401')) {
          setError('Demo Mode: Phiên đăng nhập không hợp lệ. Đang hiển thị dữ liệu mẫu.')
          apiService.removeToken()
        } else {
          setError('Demo Mode: Lỗi kết nối server. Đang hiển thị dữ liệu mẫu.')
        }
        
        // Always fallback to mock data on error
        if (activeTab === 'classes') {
          setApiData(prev => ({ ...prev, classes: getMockClasses() }))
        } else if (activeTab === 'schedule') {
          setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [activeTab])

  // Refresh schedule khi thay đổi tháng
  useEffect(() => {
    if (activeTab === 'schedule') {
      const fetchSchedule = async () => {
        const token = apiService.getToken()
        if (!token) {
          console.warn('⚠️ Không có token, sử dụng mock schedule')
          setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
          return
        }

        setLoading(true)
        try {
          const response = await apiService.getTeacherSchedule(token)
          if (response.success) {
            setApiData(prev => ({ ...prev, schedule: response.schedule }))
          } else {
            console.warn('⚠️ Lỗi API, fallback mock schedule:', response.message)
            setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
          }
        } catch (error) {
          console.error('❌ Lỗi khi lấy lịch:', error)
          setApiData(prev => ({ ...prev, schedule: getMockSchedule() }))
        } finally {
          setLoading(false)
        }
      }

      fetchSchedule()
    }
  }, [currentMonth, activeTab])

  // Mock data functions
  const getMockClasses = () => [
    {
      id: 'mock-1',
      className: 'IELTS Advanced',
      schedule: 'T2,T4,T6 - 18:00-20:00',
        room: 'Phòng 101',
        students: '15/20',
        level: 'Upper Intermediate',
      status: 'Đang dạy',
      isAvailable: true
    },
    {
      id: 'mock-2', 
      className: 'TOEIC Preparation',
      schedule: 'T3,T5,T7 - 17:30-19:30',
        room: 'Phòng 203',
        students: '12/15',
        level: 'Intermediate',
      status: 'Đang dạy',
      isAvailable: true
    }
  ]

  const getMockSchedule = () => {
    const schedule = {}
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Tạo mock schedule cho tháng hiện tại
    const mockSessions = [
      { day: 2, class: 'IELTS Advanced', time: '18:00-20:00', room: 'Phòng 101', topic: 'Speaking Practice' },
      { day: 3, class: 'TOEIC Preparation', time: '17:30-19:30', room: 'Phòng 203', topic: 'Reading Skills' },
      { day: 4, class: 'IELTS Advanced', time: '18:00-20:00', room: 'Phòng 101', topic: 'Writing Task 1' },
      { day: 5, class: 'TOEIC Preparation', time: '17:30-19:30', room: 'Phòng 203', topic: 'Listening Practice' },
      { day: 6, class: 'IELTS Advanced', time: '18:00-20:00', room: 'Phòng 101', topic: 'Grammar Review' },
      { day: 7, class: 'TOEIC Preparation', time: '17:30-19:30', room: 'Phòng 203', topic: 'Mock Test' }
    ]

    // Tạo lịch cho cả tháng
    for (let day = 1; day <= 31; day++) {
      const date = new Date(currentYear, currentMonth, day)
      if (date.getMonth() === currentMonth) { // Chỉ tạo cho tháng hiện tại
        const dayOfWeek = date.getDay() // 0=CN, 1=T2, ..., 6=T7
        
        const session = mockSessions.find(s => s.day === dayOfWeek)
        if (session) {
          const dateKey = date.toISOString().split('T')[0]
          schedule[dateKey] = [{
            id: `mock-${dateKey}`,
            class: session.class,
            time: session.time,
            room: session.room,
            topic: session.topic,
            studentCount: Math.floor(Math.random() * 15) + 10
          }]
        }
      }
    }
    
    return schedule
  }

  // Mock data fallback cho development
  const mockData = {
    students: [
      {
        id: 1,
        name: 'Nguyễn Văn A',
        class: 'IELTS Advanced',
        attendance: '90%',
        progress: 'Tốt',
        currentScore: 6.5
      },
      {
        id: 2,
        name: 'Trần Thị B',
        class: 'TOEIC Preparation',
        attendance: '85%',
        progress: 'Khá',
        currentScore: 650
      }
    ]
  }

  // Hàm tạo calendar tháng
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const today = new Date()
    
    // Ngày đầu tiên của tháng
    const firstDay = new Date(year, month, 1)
    // Ngày cuối cùng của tháng
    const lastDay = new Date(year, month + 1, 0)
    
    // Thứ của ngày đầu tiên (0 = Chủ nhật, 1 = Thứ 2, ...)
    const startDay = firstDay.getDay()
    const daysInMonth = lastDay.getDate()
    
    const days = []
    
    // Thêm các ngày của tháng trước để fill tuần đầu
    const prevMonth = new Date(year, month - 1, 0)
    const daysInPrevMonth = prevMonth.getDate()
    
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i)
      days.push({
        date: date.getDate(),
        fullDate: date,
        isCurrentMonth: false,
        isToday: false,
        hasSchedule: false
      })
    }
    
    // Thêm các ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dateKey = date.toISOString().split('T')[0]
      
      days.push({
        date: day,
        fullDate: date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasSchedule: apiData.schedule[dateKey] && apiData.schedule[dateKey].length > 0,
        scheduleCount: apiData.schedule[dateKey] ? apiData.schedule[dateKey].length : 0
      })
    }
    
    // Thêm các ngày của tháng sau để fill tuần cuối
    const remainingDays = 42 - days.length // 6 tuần * 7 ngày
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({
        date: day,
        fullDate: date,
        isCurrentMonth: false,
        isToday: false,
        hasSchedule: false
      })
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const handleDateClick = (day) => {
    if (day.hasSchedule) {
      setSelectedDate(day.fullDate)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
    setSelectedDate(null)
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
    setSelectedDate(null)
  }

  const getSelectedDateSchedule = () => {
    if (!selectedDate) return []
    const dateKey = selectedDate.toISOString().split('T')[0]
    return apiData.schedule[dateKey] || []
  }

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <FiLoader className="loading-spinner" />
      <span>Đang tải dữ liệu...</span>
    </div>
  )

  // Error component
  const ErrorMessage = ({ message, onRetry }) => (
    <div className="error-container">
      <p className="error-message">{message}</p>
      
      {message.includes('CORS policy') && (
        <div className="cors-help">
          <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#666' }}>
            💡 <strong>Để fix CORS issue:</strong><br/>
            1. Dừng dev server (Ctrl+C)<br/>
            2. Chạy lại: <code>npm run dev</code><br/>
            3. Vite proxy sẽ bypass CORS
          </p>
        </div>
      )}
      
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  )

  const handleLogout = () => {
    apiService.removeToken()
    window.location.href = '/login'
  }

  const formatSchedule = (schedule) => {
    if (!schedule) return 'Chưa có lịch học'
    return schedule
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { text: 'Đang hoạt động', className: 'status-active' },
      inactive: { text: 'Tạm nghỉ', className: 'status-inactive' },
      completed: { text: 'Đã hoàn thành', className: 'status-completed' }
    }
    
    const statusInfo = statusMap[status] || { text: 'Không xác định', className: 'status-unknown' }
    
    return <span className={`status-badge ${statusInfo.className}`}>{statusInfo.text}</span>
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>
          <FiUser className="icon" />
          Giáo viên
        </h1>
        <div className="user-info">
          <span>Xin chào, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            <FiLogOut className="icon" />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <HiAcademicCap className="icon" />
              Lớp học
            </button>
            <button 
              className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <FiCalendar className="icon" />
              Lịch dạy
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {activeTab === 'classes' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <HiAcademicCap className="icon" />
                  Lớp học của tôi
                </h2>
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage 
                  message={error} 
                  onRetry={() => window.location.reload()} 
                />
              ) : apiData.classes.length === 0 ? (
                <div className="no-data-container">
                  <p>Bạn chưa được phân công lớp học nào.</p>
                </div>
              ) : (
              <div className="card-grid">
                  {apiData.classes.map(classItem => (
                  <div key={classItem.id} className="card">
                    <div className="card-content">
                      <h3>
                        <FiBook className="icon" />
                          {classItem.className}
                      </h3>
                      <p>
                        <FiClock className="icon" />
                        <span>Lịch học:</span>
                          <span>{formatSchedule(classItem.schedule)}</span>
                      </p>
                      <p>
                        <FiMapPin className="icon" />
                        <span>Phòng:</span>
                        <span>{classItem.room}</span>
                      </p>
                      <p>
                        <FiUsers className="icon" />
                        <span>Học viên:</span>
                        <span>{classItem.students}</span>
                      </p>
                      <p>
                        <BsGraphUp className="icon" />
                        <span>Trình độ:</span>
                        <span>{classItem.level}</span>
                      </p>
                      <div className="status-container">
                          {getStatusBadge(classItem.status)}
                      </div>
                    </div>
                    <div className="action-buttons" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' ,padding: 0, marginTop: '0px'}}>
                      <button className="btn btn-secondary" style={{marginLeft: '55px'}}>
                        <FiEye className="icon" />
                        Chi tiết
                      </button>
                      <button className="btn btn-primary" style={{marginRight: '55px'}}>
                        <FiBook className="icon" />
                        Điểm danh
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </section>
          )}


          {activeTab === 'schedule' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <FiCalendar className="icon" />
                  Lịch dạy
                </h2>
                <div className="section-actions">
                  <button className="btn btn-primary">
                    <FiCalendar className="icon" />
                    Thêm lịch
                  </button>
                </div>
              </div>
              
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage 
                  message={error} 
                  onRetry={() => window.location.reload()} 
                />
              ) : (
                <div className="calendar-monthly-container">
                  {/* Calendar Header */}
                  <div className="calendar-monthly-header">
                    <button className="month-nav-btn" onClick={handlePrevMonth}>
                      <FiChevronLeft />
                    </button>
                    <h3 className="month-year">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <button className="month-nav-btn" onClick={handleNextMonth}>
                      <FiChevronRight />
                    </button>
                  </div>

                  {/* Days of week header */}
                  <div className="calendar-weekdays">
                    <div className="weekday">CN</div>
                    <div className="weekday">T2</div>
                    <div className="weekday">T3</div>
                    <div className="weekday">T4</div>
                    <div className="weekday">T5</div>
                    <div className="weekday">T6</div>
                    <div className="weekday">T7</div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="calendar-monthly-grid">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`calendar-monthly-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.hasSchedule ? 'has-schedule' : ''} ${selectedDate && selectedDate.toDateString() === day.fullDate.toDateString() ? 'selected' : ''}`}
                        onClick={() => handleDateClick(day)}
                      >
                        <span className="day-number">{day.date}</span>
                        {day.hasSchedule && day.isCurrentMonth && (
                          <div className="schedule-indicator">
                            <div className="schedule-dot"></div>
                            {day.scheduleCount > 1 && (
                              <span className="schedule-count">+{day.scheduleCount - 1}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Selected Date Details */}
                  {selectedDate && (
                    <div className="selected-date-details">
                      <div className="details-header">
                        <h4>
                          <FiCalendar className="icon" />
                          {selectedDate.toLocaleDateString('vi-VN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        <button 
                          className="close-details"
                          onClick={() => setSelectedDate(null)}
                        >
                          <FiX />
                        </button>
                      </div>
                      
                      <div className="details-content">
                        {getSelectedDateSchedule().map(session => (
                          <div key={session.id} className="detail-session">
                            <div className="session-header">
                              <div className="session-time">
                                <FiClock className="icon" />
                                {session.time}
                              </div>
                              <div className="session-class">
                        <FiBook className="icon" />
                        {session.class}
                              </div>
                            </div>
                            
                            <div className="session-details">
                              <div className="detail-item">
                        <FiMapPin className="icon" />
                                <span>Phòng học: {session.room}</span>
                              </div>
                              <div className="detail-item">
                        <FiFileText className="icon" />
                                <span>Chủ đề: {session.topic}</span>
                              </div>
                              <div className="detail-item">
                                <FiUsers className="icon" />
                                <span>Số học viên: {session.studentCount || 'N/A'}</span>
                              </div>
                    </div>
                            
                            <div className="session-actions">
                              <button className="btn btn-primary">
                        <FiBook className="icon" />
                                Vào lớp
                      </button>
                              <button className="btn btn-secondary">
                        <FiFileText className="icon" />
                                Tài liệu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default TeacherDashboard 