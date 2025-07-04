import { FiBook, FiClock, FiX, FiUser, FiHome, FiLogOut, FiBell } from 'react-icons/fi';
import ProfileModal from './components/modals/ProfileModal';
import NotificationModal from './components/modals/NotificationModal';
import { MdNotifications } from 'react-icons/md';

import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import '../Dashboard.css';
import '../../styles/dashboard/teacher.css';
import { FiLoader, FiBarChart2, FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import TeacherOverview from './components/TeacherOverview';
import ClassesList from './components/ClassesList';
import { HiAcademicCap } from 'react-icons/hi';
import ScheduleSection from './components/ScheduleSection';
import SalarySection from './components/SalarySection';

function TeacherDashboard({ user, onLogout, onGoHome }) {
  const [activeTab, setActiveTab] = useState('classes');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [apiData, setApiData] = useState({
    classes: [],
    students: [],
    schedule: {}
  })
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [selectedSalaryMonth, setSelectedSalaryMonth] = useState({month: 'all', year: 'all'})
  const [salaryPage, setSalaryPage] = useState(1);
  const salaryPerPage = 5;

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [myNotifications, setMyNotifications] = useState([]);
  const [loadingMyNotifications, setLoadingMyNotifications] = useState(false);

  // Fetch API data khi component mount và khi tab thay đổi
  useEffect(() => {
    // Log user info for debugging
    console.log('👤 User info after login:', user);
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Test connection trước
        console.log('🧪 Kiểm tra kết nối server...');
        const connectionResult = await apiService.testConnection();
        if (!connectionResult.success) {
          throw new Error('Không thể kết nối server: ' + (connectionResult.message || ''));
        }
        console.log('✅ Server connection OK, kiểm tra authentication...');

        // Lấy danh sách lớp dạy từ API (dùng teacherId)
        let classes = [];
        let schedule = {};

        // Log raw API data for debugging (move after res is defined)
        try {
          // Always use user.roleId as teacherId for API calls
          const teacherId = user?.roleId;
          if (!teacherId) {
            throw new Error('Không tìm thấy teacherId (user.roleId) trong thông tin người dùng.');
          }
          // Fix: Nếu user.roleData?.classId có dữ liệu, fetch từng classId nếu API trả về rỗng
          let res = await apiService.getTeacherClasses(apiService.getToken(), teacherId);
          console.log('📦 API lớp học trả về:', res);
          if (res && Array.isArray(res.data) && res.data.length === 0 && Array.isArray(user?.roleData?.classId) && user.roleData.classId.length > 0) {
            // Nếu API trả về rỗng nhưng user có classId, thử fetch từng classId
            const classDetails = [];
            const forbiddenClassIds = [];
            for (const classId of user.roleData.classId) {
              try {
                const classRes = await apiService.getClassById(apiService.getToken(), classId);
                if (classRes && classRes.data) classDetails.push(classRes.data);
              } catch (e) {
                // Nếu lỗi là 403, lưu lại classId bị cấm truy cập
                if (e && e.message && e.message.includes('403')) {
                  forbiddenClassIds.push(classId);
                }
                // Bỏ qua các lỗi khác
              }
            }
            classes = classDetails;
            // Nếu tất cả classId đều bị forbidden, báo lỗi rõ ràng
            if (classes.length === 0 && forbiddenClassIds.length === user.roleData.classId.length) {
              throw new Error('Bạn đã được phân công vào các lớp học nhưng không có quyền xem thông tin các lớp này.\n\nNguyên nhân có thể là do bạn chưa được cấp quyền truy cập vào các lớp này trên hệ thống.\n\nVui lòng liên hệ quản trị viên hoặc bộ phận kỹ thuật để được hỗ trợ cấp quyền truy cập.');
            } else if (forbiddenClassIds.length > 0) {
              setError('Một số lớp bạn được phân công không thể truy cập do thiếu quyền truy cập.\n\nDanh sách lớp không truy cập được: ' + forbiddenClassIds.join(', ') + '\n\nVui lòng liên hệ quản trị viên hoặc bộ phận kỹ thuật để được hỗ trợ.');
            }
          } else if (res && res.data && Array.isArray(res.data)) {
            // Log raw API data for debugging
            console.log('🟢 API lớp học trả về (raw):', res.data);
            classes = res.data;
            // Log class schedulePreview for each class
            classes.forEach(cls => {
            });
          } else {
            throw new Error('Dữ liệu lớp học trả về không hợp lệ.');
          }
          // Build schedule object from all classes
          for (const cls of classes) {
            if (cls.schedule && cls.schedule.daysOfLessonInWeek && cls.schedule.startDate && cls.schedule.endDate) {
              // Generate all dates for this class's schedule
              const start = new Date(cls.schedule.startDate);
              const end = new Date(cls.schedule.endDate);
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (cls.schedule.daysOfLessonInWeek.includes(d.getDay())) {
                  const dateKey = d.toISOString().split('T')[0];
                  if (!schedule[dateKey]) schedule[dateKey] = [];
                  schedule[dateKey].push({
                    id: cls.id,
                    class: cls.className,
                    time: cls.schedule.time || '',
                    room: cls.room || '',
                    topic: cls.schedule.topic || '',
                    studentCount: cls.students ? (Array.isArray(cls.students) ? cls.students.length : cls.students) : undefined
                  });
                }
              }
            }
          }
        } catch (err) {
          setError('Không thể lấy danh sách lớp học từ server. ' + (err && err.message ? err.message : ''));
          classes = [];
          schedule = {};
        }
        setApiData({
          classes: classes && classes.length > 0 ? classes : [],
          students: [],
          schedule: schedule || {},
        });
      } catch (error) {
        setError('Lỗi khi tải dữ liệu: ' + (error.message || error.toString()));
        setApiData({
          classes: [],
          students: [],
          schedule: {},
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, user]);

  // Khi đổi tháng ở tab schedule, không cần gọi lại API riêng, chỉ cần giữ schedule từ classes
  useEffect(() => {
    // No-op: schedule is always built from classes
  }, [currentMonth, activeTab, user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const token = apiService.getToken();
        const res = await apiService.getNotificationsForRole(token);
        if (res && res.data && Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (res && res.notifications && Array.isArray(res.notifications)) {
          setNotifications(res.notifications);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  // Fetch my notifications (notifications created by this user)
  useEffect(() => {
    const fetchMyNotifications = async () => {
      if (activeTab !== 'my-notifications') return;
      
      setLoadingMyNotifications(true);
      try {
        const token = apiService.getToken();
        const res = await apiService.getMyNotifications(token);
        console.log('📢 My notifications response:', res);
        
        if (res && res.data && Array.isArray(res.data)) {
          setMyNotifications(res.data);
        } else if (res && res.notifications && Array.isArray(res.notifications)) {
          setMyNotifications(res.notifications);
        } else {
          setMyNotifications([]);
        }
      } catch (e) {
        console.error('❌ Error fetching my notifications:', e);
        setMyNotifications([]);
      } finally {
        setLoadingMyNotifications(false);
      }
    };
    fetchMyNotifications();
  }, [activeTab]);

  // Hàm tạo calendar tháng, lấy dữ liệu lịch học từ các lớp
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const today = new Date();

    // Chuẩn bị map ngày -> danh sách lớp học có buổi học hôm đó
    const classScheduleMap = {};
    // Nếu có trường schedulePreview thì parse để lấy thứ/ngày dạy
    apiData.classes.forEach(cls => {
      if (cls.schedulePreview) {
        // Ví dụ: "T2, T4, T6 (11/8/2025 - 19/11/2025)"
        const match = cls.schedulePreview.match(/([T2-7, ]+)\s*\((\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})\)/);
        if (match) {
          const daysOfWeekStr = match[1].replace(/\s/g, ''); // "T2,T4,T6"
          const startDateStr = match[2];
          const endDateStr = match[3];
          // Chuyển "T2,T4,T6" thành mảng số thứ trong tuần (T2=1, ..., T7=6, CN=0)
          const dayMap = { 'CN': 0, 'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6 };
          const daysOfWeek = daysOfWeekStr.split(',').map(d => dayMap[d]).filter(d => d !== undefined);
          const [d1, m1, y1] = startDateStr.split('/').map(Number);
          const [d2, m2, y2] = endDateStr.split('/').map(Number);
          const start = new Date(y1, m1 - 1, d1);
          const end = new Date(y2, m2 - 1, d2);
          for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (daysOfWeek.includes(d.getDay())) {
              const dateKey = d.toISOString().split('T')[0];
              if (!classScheduleMap[dateKey]) classScheduleMap[dateKey] = [];
              classScheduleMap[dateKey].push({
                id: cls._id || cls.id,
                class: cls.className,
                time: cls.schedule && cls.schedule.time ? cls.schedule.time : '',
                room: cls.room || '',
                topic: cls.schedule && cls.schedule.topic ? cls.schedule.topic : '',
                studentCount: cls.studentCount || (cls.students ? (Array.isArray(cls.students) ? cls.students.length : cls.students) : undefined)
              });
            }
          }
        }
      } else if (cls.schedule && cls.schedule.daysOfLessonInWeek && cls.schedule.startDate && cls.schedule.endDate) {
        // Fallback: dùng schedule gốc nếu có
        const start = new Date(cls.schedule.startDate);
        const end = new Date(cls.schedule.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (cls.schedule.daysOfLessonInWeek.includes(d.getDay())) {
            const dateKey = d.toISOString().split('T')[0];
            if (!classScheduleMap[dateKey]) classScheduleMap[dateKey] = [];
            classScheduleMap[dateKey].push({
              id: cls._id || cls.id,
              class: cls.className,
              time: cls.schedule.time || '',
              room: cls.room || '',
              topic: cls.schedule.topic || '',
              studentCount: cls.studentCount || (cls.students ? (Array.isArray(cls.students) ? cls.students.length : cls.students) : undefined)
            });
          }
        }
      }
    });

    // Ngày đầu tiên của tháng
    const firstDay = new Date(year, month, 1);
    // Ngày cuối cùng của tháng
    const lastDay = new Date(year, month + 1, 0);
    // Thứ của ngày đầu tiên (0 = Chủ nhật, 1 = Thứ 2, ...)
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    // Thêm các ngày của tháng trước để fill tuần đầu
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      const dateKey = date.toISOString().split('T')[0];
      days.push({
        date: date.getDate(),
        fullDate: date,
        isCurrentMonth: false,
        isToday: false,
        hasSchedule: !!classScheduleMap[dateKey],
        scheduleCount: classScheduleMap[dateKey] ? classScheduleMap[dateKey].length : 0,
        scheduleList: classScheduleMap[dateKey] || []
      });
    }

    // Thêm các ngày của tháng hiện tại
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = date.toISOString().split('T')[0];
      days.push({
        date: day,
        fullDate: date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        hasSchedule: !!classScheduleMap[dateKey],
        scheduleCount: classScheduleMap[dateKey] ? classScheduleMap[dateKey].length : 0,
        scheduleList: classScheduleMap[dateKey] || []
      });
    }

    // Thêm các ngày của tháng sau để fill tuần cuối
    const remainingDays = 42 - days.length; // 6 tuần * 7 ngày
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateKey = date.toISOString().split('T')[0];
      days.push({
        date: day,
        fullDate: date,
        isCurrentMonth: false,
        isToday: false,
        hasSchedule: !!classScheduleMap[dateKey],
        scheduleCount: classScheduleMap[dateKey] ? classScheduleMap[dateKey].length : 0,
        scheduleList: classScheduleMap[dateKey] || []
      });
    }
    return days;
  };

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

  // Lấy danh sách lớp học có lịch học trong ngày được chọn
  const getSelectedDateSchedule = () => {
    if (!selectedDate) return [];
    // const dateKey = selectedDate.toISOString().split('T')[0];
    // Dùng lịch đã build từ generateCalendarDays
    const found = calendarDays.find(day => day.fullDate.toDateString() === selectedDate.toDateString());
    return found && found.scheduleList ? found.scheduleList : [];
  };

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

  // Sửa lỗi: Đăng xuất phải xóa token và reload về trang login
  const handleLogout = () => {
    apiService.removeToken();
    if (typeof onLogout === 'function') onLogout();
    window.location.href = '/login';
  };

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

  const handleGoHome = () => {
    navigate('/');
    if (onGoHome) onGoHome();
  };

  // Dữ liệu mẫu nhiều tháng:
  const salaryData = Array.from({length:18}, (_,i) => {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const soBuoiDay = 15 + (i%5);
    const luongMoiBuoi = 350000;
    const daNhan = i%3===0 ? soBuoiDay*luongMoiBuoi : Math.floor(soBuoiDay*luongMoiBuoi*0.6);
    const tongLuong = soBuoiDay * luongMoiBuoi;
    const conLai = tongLuong - daNhan;
    return {
      key: i,
      month: date.getMonth()+1,
      year: date.getFullYear(),
      soBuoiDay,
      luongMoiBuoi,
      daNhan,
      conLai,
      tongLuong,
      trangThai: conLai > 0 ? 'Chưa thanh toán hết' : 'Đã thanh toán đủ',
    };
  });

  // Component hiển thị danh sách thông báo đã tạo
  const MyNotificationsSection = ({ myNotifications, loading, error, onRetry }) => {
    if (loading) {
      return (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              <FiBell />
              Thông báo đã tạo
            </h2>
          </div>
          <div className="loading-container">
            <FiLoader className="loading-spinner" />
            <span>Đang tải danh sách thông báo...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">
              <FiBell />
              Thông báo đã tạo
            </h2>
          </div>
          <ErrorMessage message={error} onRetry={onRetry} />
        </div>
      );
    }

    const formatDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return dateString;
      }
    };

    const getNotificationTypeBadge = (type) => {
      const typeMap = {
        'General': { text: 'Thông báo chung', color: '#007bff' },
        'Emergency': { text: 'Khẩn cấp', color: '#dc3545' },
        'Schedule': { text: 'Lịch học', color: '#28a745' },
        'Event': { text: 'Sự kiện', color: '#ffc107' }
      };
      
      const typeInfo = typeMap[type] || { text: type || 'Khác', color: '#6c757d' };
      
      return (
        <span style={{
          background: typeInfo.color,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {typeInfo.text}
        </span>
      );
    };

    return (
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            <FiBell />
            Thông báo đã tạo
          </h2>
          <p className="section-subtitle">
            Danh sách các thông báo bạn đã tạo ({myNotifications.length})
          </p>
        </div>

        {myNotifications.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <FiBell size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              Chưa có thông báo nào được tạo
            </p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
              Các thông báo bạn tạo sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          <div className="notifications-grid">
            {myNotifications.map((notification, index) => (
              <div key={notification._id || notification.id || index} className="notification-card" style={{
                background: 'white',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: '#b30000',
                      fontSize: '1.1rem',
                      fontWeight: '600'
                    }}>
                      {notification.title || 'Không có tiêu đề'}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {getNotificationTypeBadge(notification.type)}
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#666',
                        background: '#f8f9fa',
                        padding: '2px 6px',
                        borderRadius: '3px'
                      }}>
                        {formatDate(notification.createdAt || notification.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    margin: 0, 
                    lineHeight: '1.5',
                    color: '#333'
                  }}>
                    {notification.content || notification.message || 'Không có nội dung'}
                  </p>
                </div>

                {notification.targetRoles && notification.targetRoles.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e9ecef' }}>
                    <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                      Gửi đến: 
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {notification.targetRoles.map((role, idx) => (
                        <span key={idx} style={{
                          background: '#e3f2fd',
                          color: '#1976d2',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '0.8rem'
                        }}>
                          {role === 'Student' ? 'Học viên' : 
                           role === 'Parent' ? 'Phụ huynh' : 
                           role === 'Teacher' ? 'Giáo viên' : 
                           role === 'Admin' ? 'Quản trị viên' : role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
 
  return (
    <div className="dashboard teacher-dashboard">
      <TeacherOverview
        user={user}
        showProfileModal={showProfileModal}
        setShowProfileModal={setShowProfileModal}
        onGoHome={handleGoHome}
        onLogout={handleLogout}
      />
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
            <button 
              className={`nav-item ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <FiBarChart2 className="icon" />
              Lương của tôi
            </button>
            <button 
              className={`nav-item ${activeTab === 'my-notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-notifications')}
            >
              <FiBell className="icon" />
              Thông báo đã tạo
            </button>
          </nav>
          
          {/* Navigation menu ở góc dưới sidebar */}
          <div className="sidebar-bottom-nav">
          <button 
              className="nav-item"
              onClick={() => handleGoHome()}
            >
              <FiHome className="icon" />
              Trang chủ
            </button>
            <button 
              className="nav-item"
              onClick={() => setShowProfileModal(true)}
            >
              <FiUser className="icon" />
              Hồ sơ
            </button>
            <button
              className="nav-item"
              style={{ position: 'relative' }}
              onClick={() => setShowNotificationModal(true)}
            >
              <MdNotifications className="icon" />
              Thông báo
              {notifications.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 8,
                  right: 12,
                  background: '#b30000',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.8rem',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}>{notifications.length}</span>
              )}
            </button>
            <button 
              className="nav-item"
              onClick={() => handleLogout()}
            >
              <FiLogOut className="icon" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === 'classes' && (
            <ClassesList
              classes={apiData.classes}
              loading={loading}
              error={error}
              onRetry={() => window.location.reload()}
              onShowClassDetail={classItem => { setSelectedClass(classItem); setShowClassDetail(true); }}
              showClassDetail={showClassDetail}
              selectedClass={selectedClass}
              onCloseClassDetail={() => setShowClassDetail(false)}
              getStatusBadge={getStatusBadge}
              formatSchedule={formatSchedule}
            />
          )}
          {activeTab === 'schedule' && (
            <ScheduleSection
              calendarDays={calendarDays}
              currentMonth={currentMonth}
              monthNames={monthNames}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              getSelectedDateSchedule={getSelectedDateSchedule}
              onCloseDateDetails={() => setSelectedDate(null)}
              loading={loading}
              error={error}
              onRetry={() => window.location.reload()}
              userRole="teacher"
              apiData={apiData}
            />
          )}
          {activeTab === 'salary' && (
            <SalarySection
              userData={user}
              selectedSalaryMonth={selectedSalaryMonth}
              setSelectedSalaryMonth={setSelectedSalaryMonth}
              salaryPage={salaryPage}
              setSalaryPage={setSalaryPage}
              salaryPerPage={salaryPerPage}
            />
          )}
          {activeTab === 'my-notifications' && (
            <MyNotificationsSection
              myNotifications={myNotifications}
              loading={loadingMyNotifications}
              error={error}
              onRetry={() => window.location.reload()}
            />
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      )}

      {/* Notification Modal */}
      <NotificationModal 
        isOpen={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)} 
        user={user}
      />
    </div>
  )
}

export default TeacherDashboard