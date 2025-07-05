import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import '../../styles/dashboard/student.css';
import { 
  FaUserGraduate, 
  FaChartLine, 
  FaBook, 
  FaCalendar,
  
} from 'react-icons/fa';
import { FiUser, FiHome, FiLogOut } from 'react-icons/fi';
import StudentBurgerIcon from '../common/StudentBurgerIcon';
import { useNavigate } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';

import StudentOverview from './components/StudentOverview';
import CoursesList from './components/CoursesList';
import ScheduleSection from './components/ScheduleSection';
import GradeReport from './components/GradeReport';
import ProfileModal from './components/modals/ProfileModal';
import NotificationModal from './components/modals/NotificationModal';

function StudentDashboard({ user, onLogout }) {
  // Log student info from API /students/:studentId (studentId == user.roleId) when logging in
  const [apiCourses, setApiCourses] = useState([]);
  const [apiStats, setApiStats] = useState(null);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    async function fetchStudentCourses() {
      try {
        const token = apiService.getToken && apiService.getToken();
        if (user && user.roleId) {
          const res = await apiService.getStudentById(token, user.roleId);
          console.log('getStudentById response:', res);
          let courses = [];
          let stats = null;
          if (res && res.data) {
            console.log('Student data:', res.data);
            console.log('Attendance info:', res.data.attendanceInfo);
            // Courses
            if (res.data.classId) {
              const classArr = Array.isArray(res.data.classId) ? res.data.classId : [res.data.classId];
              courses = classArr.map(cls => ({
                id: cls._id,
                name: cls.className ?? '-',
                year: cls.year ?? '-', // năm học
                age: cls.grade ?? '-', // độ tuổi
                schedule: cls.schedule ? formatSchedule(cls.schedule) : '-',
                status: cls.isAvailable === true ? 'Đang học' : (cls.isAvailable === false ? 'Đã kết thúc' : '-'), // trạng thái
                feePerLesson: cls.feePerLesson ?? '-',
                startDate: cls.schedule?.startDate ? new Date(cls.schedule.startDate).toLocaleDateString('vi-VN') : '-',
                endDate: cls.schedule?.endDate ? new Date(cls.schedule.endDate).toLocaleDateString('vi-VN') : '-',
                //giao viên
                teacher: cls.teacherId?.userId?.name || cls.teacherId?.name || '-',
                teacherId: cls.teacherId?.userId || cls.teacherId || null,
                email: cls.teacherId?.userId?.email || cls.teacherId?.email || '-',
                phone: cls.teacherId?.userId?.phoneNumber || cls.teacherId?.phoneNumber || '-',
              }));
            }
            // Stats
            if (res.data.attendanceInfo) {
              console.log('Processing attendance info:', res.data.attendanceInfo);
              stats = {
                totalCourses: Array.isArray(res.data.classId) ? res.data.classId.length : (res.data.classId ? 1 : 0),
                attendanceRate: res.data.attendanceInfo.attendanceRate ?? 0,
                attendedLessons: res.data.attendanceInfo.attendedLessons ?? 0,
                absentLessons: res.data.attendanceInfo.absentLessons ?? 0,
              };
              console.log('Final stats:', stats);
            } else {
              console.log('No attendance info found in response');
              console.log('Full response data:', res.data);
              // Tính toán từ dữ liệu thô nếu có
              let totalClasses = 0;
              let attendedCount = 0;
              let absentCount = 0;
              
              if (res.data.classId && Array.isArray(res.data.classId)) {
                res.data.classId.forEach(cls => {
                  if (cls.attendance && Array.isArray(cls.attendance)) {
                    cls.attendance.forEach(att => {
                      if (att.students && Array.isArray(att.students)) {
                        const studentAttendance = att.students.find(s => s.studentId === res.data._id);
                        if (studentAttendance) {
                          totalClasses++;
                          if (studentAttendance.isAbsent) {
                            absentCount++;
                          } else {
                            attendedCount++;
                          }
                        }
                      }
                    });
                  }
                });
              }
              
              stats = {
                totalCourses: Array.isArray(res.data.classId) ? res.data.classId.length : (res.data.classId ? 1 : 0),
                attendanceRate: totalClasses > 0 ? Math.round((attendedCount / totalClasses) * 100) : 0,
                attendedLessons: attendedCount,
                absentLessons: absentCount,
              };
              console.log('Calculated stats from raw data:', stats);
            }
          }
          setApiCourses(courses);
          setApiStats(stats);
        } else {
          console.warn('No user or user.roleId found for student info log');
        }
      } catch (err) {
        console.error('Error calling /students/:studentId (StudentDashboard):', err);
      }
    }
    // Helper to format schedule string
    function formatSchedule(schedule) {
      if (!schedule) return '';
      // Example: Thứ 2,4,6 (08/07/2025 - 10/10/2025)
      const daysMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const days = (schedule.daysOfLessonInWeek || []).map(d => daysMap[d] || '').filter(Boolean).join(', ');
      const start = schedule.startDate ? new Date(schedule.startDate).toLocaleDateString('vi-VN') : '';
      const end = schedule.endDate ? new Date(schedule.endDate).toLocaleDateString('vi-VN') : '';
      return days && start && end ? `${days} (${start} - ${end})` : '';
    }
    fetchStudentCourses();
  }, [user]);

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

  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

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
        nextLesson: 'Unit 7: Academic Writing',
        isAvailable: true
      },
      {
        id: 2,
        name: 'TOEIC Preparation',
        teacher: 'John Smith',
        schedule: 'Thứ 3,5 - 17:30-19:30',
        room: 'Phòng 203',
        progress: '60%',
        attendance: '95%',
        nextLesson: 'Unit 5: Listening Skills',
        isAvailable: false
      },
      {
        id: 3,
        name: 'Business English',
        teacher: 'Emily Davis',
        schedule: 'Thứ 2,3,5 - 19:00-21:00',
        room: 'Phòng 105',
        progress: '45%',
        attendance: '88%',
        nextLesson: 'Unit 3: Business Communication',
        isAvailable: true
      },
      {
        id: 4,
        name: 'Conversation Skills',
        teacher: 'Michael Brown',
        schedule: 'Thứ 4,6 - 16:00-18:00',
        room: 'Phòng 102',
        progress: '80%',
        attendance: '92%',
        nextLesson: 'Unit 6: Daily Conversations',
        isAvailable: true
      },
      {
        id: 5,
        name: 'Grammar Foundation',
        teacher: 'Lisa Wilson',
        schedule: 'Thứ 2,5 - 17:00-19:00',
        room: 'Phòng 104',
        progress: '30%',
        attendance: '85%',
        nextLesson: 'Unit 2: Past Tenses',
        isAvailable: false
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
    schedule: [
      {
        id: 1,
        course: 'IELTS Advanced',
        teacher: 'Sarah Johnson',
        room: 'Phòng 101',
        date: 'Thứ 2',
        dateFull: '2025-07-07',
        time: '18:00-20:00'
      },
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
        <button
          className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <FaCalendar style={{ marginRight: 6 }} />
          Lịch học
        </button>
      </nav>
      
      {/* Navigation menu ở góc dưới sidebar */}
      <div className="sidebar-bottom-nav">
          <button 
            className="nav-item"
            onClick={() => navigate('/')}
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
          onClick={() => onLogout()}
        >
          <FiLogOut className="icon" />
          Đăng xuất
        </button>
        
      </div>
    </aside>
  );
  // Lịch học dạng lịch tháng giống giáo viên, lấy từ API nếu có
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  // Tạo userClassMap để ánh xạ id lớp học với object lớp học từ user
  const userClassMap = {};
  if (user && user.classId) {
    const classArr = Array.isArray(user.classId) ? user.classId : [user.classId];
    classArr.forEach(cls => {
      userClassMap[cls._id || cls.id] = cls;
    });
  }
  const scheduleMap = {};
  const scheduleSource = apiCourses.length > 0 ? apiCourses : mockData.courses;
  scheduleSource.forEach(item => {
    if (item.schedule) {
      const match = item.schedule.match(/([T2-7, CN,Thứ\s]+)\s*\((\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})\)/);
      if (match) {
        let daysOfWeekStr = match[1].replace(/Thứ\s?/g, '').replace(/\s/g, '');
        daysOfWeekStr = daysOfWeekStr.replace('CN', '0');
        let daysOfWeek = daysOfWeekStr.split(',').map(d => {
          if (d === '0' || d === 'CN') return 0;
          if (d.startsWith('T')) return parseInt(d.slice(1));
          return parseInt(d);
        }).filter(d => !isNaN(d));
        const [d1, m1, y1] = match[2].split('/').map(Number);
        const [d2, m2, y2] = match[3].split('/').map(Number);
        const start = new Date(y1, m1 - 1, d1);
        const end = new Date(y2, m2 - 1, d2);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (daysOfWeek.includes(d.getDay())) {
            const key = d.toISOString().slice(0, 10);
            if (!scheduleMap[key]) scheduleMap[key] = [];
            // Lấy trạng thái từ item nếu có, nếu không lấy từ userClassMap
            let isAvailable = (typeof item.isAvailable !== 'undefined') ? item.isAvailable : (userClassMap[item.id]?.isAvailable);
            scheduleMap[key].push({
              id: item.id,
              course: item.name,
              teacher: item.teacher,
              isAvailable: isAvailable,
              // Có thể bổ sung thêm các trường khác nếu cần
            });
          }
        }
      }
    }
  });
  // Nếu không có lịch từ apiCourses, bổ sung từ mockData.schedule (giữ nguyên logic cũ)
  if (apiCourses.length === 0 && mockData.schedule) {
    mockData.schedule.forEach(item => {
      if (item.dateFull) {
        if (!scheduleMap[item.dateFull]) scheduleMap[item.dateFull] = [];
        scheduleMap[item.dateFull].push(item);
      }
    });
  }
  // Tạo mảng ngày cho lịch tháng
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const days = [];
  let prevDays = (firstDay.getDay() + 6) % 7;
  for (let i = prevDays; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: false,
      schedule: scheduleMap[d.toISOString().slice(0, 10)] || []
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    const key = dateObj.toISOString().slice(0, 10);
    days.push({
      date: dateObj,
      isCurrentMonth: true,
      isToday: dateObj.toDateString() === today.toDateString(),
      schedule: scheduleMap[key] || []
    });
  }
  while (days.length % 7 !== 0) {
    const d = new Date(year, month, daysInMonth + (days.length - daysInMonth) + 1);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: false,
      schedule: scheduleMap[d.toISOString().slice(0, 10)] || []
    });
  }
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };
  // Build calendarDays for ScheduleSection
  const calendarDays = days.map(day => ({
    fullDate: day.date,
    date: day.date.getDate(),
    isCurrentMonth: day.isCurrentMonth,
    isToday: day.isToday,
    hasSchedule: (day.schedule && day.schedule.length > 0),
    scheduleList: (day.schedule || []).map(item => ({
      id: item.id,
      class: item.course,
      time: item.time,
      room: item.room,
      teacher: item.teacher
    }))
  }));
  // Helper for selected date schedule
  const getSelectedDateSchedule = () => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().slice(0,10);
    return (scheduleMap[key] || []).map(item => ({
      id: item.id,
      class: item.course,
      teacher: item.teacher,
      status: (item.isAvail !== undefined)
        ? (item.isAvail === true ? 'Đang học' : (item.isAvail === false ? 'Đã kết thúc' : '-'))
        : (item.isAvail === true ? 'Đang học' : (item.isAvailable === false ? 'Đã kết thúc' : '-')),
    }));
  };



  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <StudentOverview stats={apiStats || mockData.stats} />;
      case 'courses':
        return <CoursesList courses={apiCourses.length > 0 ? apiCourses : mockData.courses} currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />;
      case 'schedule':
        return (
          <ScheduleSection
            calendarDays={calendarDays}
            currentMonth={currentMonth}
            monthNames={monthNames}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            selectedDate={selectedDate}
            onDateClick={day => day.isCurrentMonth && setSelectedDate(day.fullDate)}
            getSelectedDateSchedule={getSelectedDateSchedule}
            onCloseDateDetails={() => setSelectedDate(null)}
            userRole="student"
            apiData={{ apiCourses, apiStats, mockData, user, scheduleSource }}
          />
        );
      case 'grades':
        return <GradeReport grades={mockData.grades} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard student-dashboard">
      {renderHeader()}
      <div className="dashboard-content">
        {renderSidebar()}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
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
  );
}

export default StudentDashboard;