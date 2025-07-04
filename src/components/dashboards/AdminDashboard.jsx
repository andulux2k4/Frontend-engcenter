import React, { useState, useEffect } from 'react'
import '../Dashboard.css'
import '../../styles/dashboard/admin.css';
import { FiUser, FiLogOut, FiEdit, FiTrash2, FiEye, FiUsers, FiPhone, FiMail, FiLock, FiSave, FiX, FiBook, FiCalendar, FiClock, FiMapPin, FiBarChart2, FiFileText, FiCheckCircle, FiPlus, FiHome } from 'react-icons/fi'
import { MdOutlineApps } from 'react-icons/md';
import { BiMoney } from 'react-icons/bi'
import { HiAcademicCap } from 'react-icons/hi'
import { RiDashboardLine } from 'react-icons/ri'
import { MdNotifications, MdCampaign, MdPayment } from 'react-icons/md'
import apiService from '../../services/api'
import { useNavigate } from 'react-router-dom';
import ProfileModal from './components/modals/ProfileModal';
import NotificationModal from './components/modals/NotificationModal';

// Reusable Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  limit, 
  onPageChange, 
  loading = false,
  itemName = 'items'
}) => {
  if (totalPages <= 1) return null;

  const startItem = ((currentPage - 1) * limit) + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      borderRadius: '0 0 0.5rem 0.5rem',
      marginTop: '1rem'
    }}>
      <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemName}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
            color: currentPage === 1 ? '#9ca3af' : '#374151',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Trước
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: currentPage === pageNum ? '#3b82f6' : 'white',
                color: currentPage === pageNum ? 'white' : '#374151',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                minWidth: '2.5rem'
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          style={{
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
            color: currentPage === totalPages ? '#9ca3af' : '#374151',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

function AdminDashboard({ user, onLogout, onGoHome }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddUserForm, setShowAddUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('all')
  const [showClassDetail, setShowClassDetail] = useState(false)
  const [showEditClass, setShowEditClass] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [editClassData, setEditClassData] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showNewClassModal, setShowNewClassModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [users, setUsers] = useState([])
  const [newClass, setNewClass] = useState({
    name: '',
    year: new Date().getFullYear(),
    grade: '',
    startDate: '',
    endDate: '',
    feePerLesson: '',
    teacherId: '',
    daysOfLessonInWeek: []
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    passwordBeforeHash: '',
    phone: '',
    role: 'Student',
    gender: '',
    address: '',
    parentId: '',
    classIds: [],
    studentIds: [],
    canViewTeacher: false,
  })
  const [tuitionList, setTuitionList] = useState([
    { id: 1, student: 'Alice Brown', parent: 'Mrs. Brown', class: 'IELTS Advanced', sessions: 20, amount: 5000000, paid: 5000000, date: '2024-03-15', status: 'Đã duyệt', proofImage: '' },
    { id: 2, student: 'Bob Wilson', parent: 'Mr. Wilson', class: 'TOEIC Preparation', sessions: 18, amount: 5000000, paid: 0, date: '2024-03-14', status: 'Chờ duyệt', proofImage: '' },
    { id: 3, student: 'Charlie Davis', parent: 'Mr. Davis', class: 'TOEIC Basic', sessions: 15, amount: 4000000, paid: 2000000, date: '2024-03-13', status: 'Chờ duyệt', proofImage: '' },
    { id: 4, student: 'Diana Evans', parent: 'Mrs. Evans', class: 'IELTS Foundation', sessions: 22, amount: 6000000, paid: 6000000, date: '2024-03-12', status: 'Đã duyệt', proofImage: '' },
    { id: 5, student: 'Edward Foster', parent: 'Mr. Foster', class: 'Conversation Club', sessions: 16, amount: 3500000, paid: 0, date: '2024-03-11', status: 'Chờ duyệt', proofImage: '' },
    { id: 6, student: 'Fiona Green', parent: 'Mrs. Green', class: 'Writing Skills', sessions: 19, amount: 4800000, paid: 4800000, date: '2024-03-10', status: 'Đã duyệt', proofImage: '' },
    { id: 7, student: 'George Harris', parent: 'Mr. Harris', class: 'Reading Comprehension', sessions: 17, amount: 4200000, paid: 2100000, date: '2024-03-09', status: 'Chờ duyệt', proofImage: '' },
    { id: 8, student: 'Helen Johnson', parent: 'Mrs. Johnson', class: 'Listening Practice', sessions: 21, amount: 5500000, paid: 0, date: '2024-03-08', status: 'Chờ duyệt', proofImage: '' },
    { id: 9, student: 'Ian King', parent: 'Mr. King', class: 'Speaking Club', sessions: 14, amount: 3800000, paid: 3800000, date: '2024-03-07', status: 'Đã duyệt', proofImage: '' },
    { id: 10, student: 'Julia Lee', parent: 'Mrs. Lee', class: 'Business English', sessions: 23, amount: 6500000, paid: 3250000, date: '2024-03-06', status: 'Chờ duyệt', proofImage: '' },
    { id: 11, student: 'Kevin Miller', parent: 'Mr. Miller', class: 'Academic Writing', sessions: 18, amount: 5200000, paid: 0, date: '2024-03-05', status: 'Chờ duyệt', proofImage: '' },
    { id: 12, student: 'Laura Nelson', parent: 'Mrs. Nelson', class: 'IELTS Advanced', sessions: 20, amount: 5000000, paid: 5000000, date: '2024-03-04', status: 'Đã duyệt', proofImage: '' },
    { id: 13, student: 'Mark Owens', parent: 'Mr. Owens', class: 'TOEIC Preparation', sessions: 16, amount: 4500000, paid: 2250000, date: '2024-03-03', status: 'Chờ duyệt', proofImage: '' },
    { id: 14, student: 'Nancy Parker', parent: 'Mrs. Parker', class: 'Grammar Advanced', sessions: 19, amount: 4800000, paid: 0, date: '2024-03-02', status: 'Chờ duyệt', proofImage: '' },
    { id: 15, student: 'Oliver Quinn', parent: 'Mr. Quinn', class: 'Conversation Club', sessions: 15, amount: 3500000, paid: 3500000, date: '2024-03-01', status: 'Đã duyệt', proofImage: '' }
  ]);
  const [salaryList, setSalaryList] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@tttenglish.edu.vn',
      phone: '0912345678',
      sessions: 18,
      wage: 350000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john@tttenglish.edu.vn',
      phone: '0923456789',
      sessions: 15,
      wage: 320000,
      paidAmount: 4800000,
      period: '03/2024',
    },
    {
      id: 3,
      name: 'Mary Wilson',
      email: 'mary@tttenglish.edu.vn',
      phone: '0934567890',
      sessions: 20,
      wage: 340000,
      paidAmount: 3400000,
      period: '03/2024',
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david@tttenglish.edu.vn',
      phone: '0945678901',
      sessions: 16,
      wage: 330000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 5,
      name: 'Emma Davis',
      email: 'emma@tttenglish.edu.vn',
      phone: '0956789012',
      sessions: 22,
      wage: 360000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 6,
      name: 'Michael Johnson',
      email: 'michael@tttenglish.edu.vn',
      phone: '0967890123',
      sessions: 14,
      wage: 310000,
      paidAmount: 4340000,
      period: '03/2024',
    },
    {
      id: 7,
      name: 'Lisa Anderson',
      email: 'lisa@tttenglish.edu.vn',
      phone: '0978901234',
      sessions: 19,
      wage: 345000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 8,
      name: 'Robert Wilson',
      email: 'robert@tttenglish.edu.vn',
      phone: '0989012345',
      sessions: 17,
      wage: 325000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 9,
      name: 'Jennifer Lee',
      email: 'jennifer@tttenglish.edu.vn',
      phone: '0990123456',
      sessions: 21,
      wage: 355000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 10,
      name: 'Thomas Chen',
      email: 'thomas@tttenglish.edu.vn',
      phone: '0901234567',
      sessions: 13,
      wage: 300000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 11,
      name: 'Amanda White',
      email: 'amanda@tttenglish.edu.vn',
      phone: '0912345679',
      sessions: 20,
      wage: 350000,
      paidAmount: 0,
      period: '03/2024',
    },
    {
      id: 12,
      name: 'Christopher Taylor',
      email: 'christopher@tttenglish.edu.vn',
      phone: '0923456780',
      sessions: 18,
      wage: 340000,
      paidAmount: 0,
      period: '03/2024',
    }
  ]);
  const [availableTeachers, setAvailableTeachers] = useState([])
  const [availableStudents, setAvailableStudents] = useState([])
  const [showTeacherSelect, setShowTeacherSelect] = useState(false)
  const [showStudentSelect, setShowStudentSelect] = useState(false)
  const [selectedClassForAssignment, setSelectedClassForAssignment] = useState(null)
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Lịch học mới cho lớp IELTS Advanced',
      content: 'Lớp IELTS Advanced sẽ bắt đầu từ 01/04/2024. Vui lòng kiểm tra lịch học chi tiết.',
      target: 'Học sinh',
      type: 'event',
      method: 'Web',
      date: '20/03/2024',
    },
    {
      id: 2,
      title: 'Thông báo đóng học phí tháng 3',
      content: 'Học viên vui lòng hoàn thành học phí tháng 3 trước ngày 25/03/2024.',
      target: 'Học sinh',
      type: 'payment reminder',
      method: 'Email',
      date: '18/03/2024',
    },
    {
      id: 3,
      title: 'Khai giảng lớp TOEIC mới',
      content: 'Lớp TOEIC Preparation sẽ khai giảng vào 15/04/2024. Đăng ký ngay!',
      target: 'Tất cả',
      type: 'event',
      method: 'Both',
      date: '17/03/2024',
    },
    {
      id: 4,
      title: 'Thông báo nghỉ lễ 30/4',
      content: 'Trung tâm sẽ nghỉ lễ từ 30/04 đến 02/05/2024. Các lớp học sẽ tạm dừng trong thời gian này.',
      target: 'Tất cả',
      type: 'holiday',
      method: 'Both',
      date: '16/03/2024',
    },
    {
      id: 5,
      title: 'Kết quả thi thử IELTS tháng 3',
      content: 'Kết quả thi thử IELTS tháng 3 đã có. Vui lòng liên hệ văn phòng để nhận kết quả.',
      target: 'Học sinh',
      type: 'result',
      method: 'Email',
      date: '15/03/2024',
    },
    {
      id: 6,
      title: 'Thông báo thay đổi lịch học',
      content: 'Lớp TOEIC Basic sẽ thay đổi lịch học từ thứ 2,4,6 sang thứ 3,5,7 từ tuần tới.',
      target: 'Học sinh',
      type: 'schedule',
      method: 'Web',
      date: '14/03/2024',
    },
    {
      id: 7,
      title: 'Ưu đãi học phí tháng 4',
      content: 'Giảm 10% học phí cho học viên đăng ký mới trong tháng 4/2024.',
      target: 'Tất cả',
      type: 'promotion',
      method: 'Both',
      date: '13/03/2024',
    },
    {
      id: 8,
      title: 'Thông báo bảo trì hệ thống',
      content: 'Hệ thống quản lý sẽ bảo trì từ 22h00 đến 06h00 ngày mai. Vui lòng thông cảm.',
      target: 'Tất cả',
      type: 'maintenance',
      method: 'Web',
      date: '12/03/2024',
    },
    {
      id: 9,
      title: 'Khai giảng lớp Speaking Club',
      content: 'Lớp Speaking Club mới sẽ khai giảng vào 20/04/2024. Đăng ký ngay để cải thiện kỹ năng nói!',
      target: 'Học sinh',
      type: 'event',
      method: 'Email',
      date: '11/03/2024',
    },
    {
      id: 10,
      title: 'Thông báo đóng học phí tháng 4',
      content: 'Học viên vui lòng hoàn thành học phí tháng 4 trước ngày 25/04/2024.',
      target: 'Học sinh',
      type: 'payment reminder',
      method: 'Email',
      date: '10/03/2024',
    },
    {
      id: 11,
      title: 'Workshop Writing Skills',
      content: 'Workshop Writing Skills sẽ diễn ra vào chủ nhật 28/04/2024. Đăng ký tham gia miễn phí!',
      target: 'Học sinh',
      type: 'workshop',
      method: 'Both',
      date: '09/03/2024',
    },
    {
      id: 12,
      title: 'Thông báo nghỉ học cô Sarah',
      content: 'Cô Sarah sẽ nghỉ học ngày mai (15/03). Lớp IELTS Advanced sẽ được dạy bù vào thứ 7.',
      target: 'Học sinh',
      type: 'schedule',
      method: 'Web',
      date: '08/03/2024',
    }
  ]);
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    content: '',
    target: '',
    type: '',
    method: 'Web',
  });
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryModalData, setSalaryModalData] = useState({teacher: null, amount: ''});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [salaryMonth, setSalaryMonth] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [tuitionStatusFilter, setTuitionStatusFilter] = useState('all');
  const [tuitionSearch, setTuitionSearch] = useState('');
  const [showDetailTuitionModal, setShowDetailTuitionModal] = useState(false);
  const [detailTuitionData, setDetailTuitionData] = useState(null);
  const [showAddTuitionModal, setShowAddTuitionModal] = useState(false);
  const [newTuitionData, setNewTuitionData] = useState({student:'',parent:'',class:'',sessions:'',amount:'',paid:'',date:'',status:'Chờ duyệt',proofImage:''});
  const [advertisements, setAdvertisements] = useState([
    { 
      id: 1, 
      title: 'Khai giảng lớp IELTS Advanced', 
      content: 'Lớp IELTS Advanced mới sẽ khai giảng vào tháng 4/2024. Đăng ký ngay để nhận ưu đãi 20% học phí!',
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=IELTS+Advanced']
    },
    { 
      id: 2, 
      title: 'Ưu đãi học phí tháng 3', 
      content: 'Giảm 15% học phí cho tất cả các khóa học trong tháng 3/2024. Áp dụng cho học viên mới.',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Discount+March']
    },
    { 
      id: 3, 
      title: 'Lớp TOEIC cơ bản', 
      content: 'Lớp TOEIC cơ bản dành cho người mới bắt đầu. Cam kết đạt 500+ điểm sau 3 tháng.',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      status: 'Đã ngừng',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=TOEIC+Basic']
    },
    { 
      id: 4, 
      title: 'Workshop Speaking Skills', 
      content: 'Workshop Speaking Skills miễn phí dành cho tất cả học viên. Tham gia để cải thiện kỹ năng nói!',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Speaking+Workshop']
    },
    { 
      id: 5, 
      title: 'Khóa học Business English', 
      content: 'Khóa học Business English dành cho người đi làm. Học tiếng Anh thương mại hiệu quả.',
      startDate: '2024-03-10',
      endDate: '2024-05-10',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Business+English']
    },
    { 
      id: 6, 
      title: 'Lớp Grammar Advanced', 
      content: 'Lớp Grammar Advanced giúp học viên nắm vững ngữ pháp tiếng Anh nâng cao.',
      startDate: '2024-02-20',
      endDate: '2024-04-20',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Grammar+Advanced']
    },
    { 
      id: 7, 
      title: 'Khóa học Writing Skills', 
      content: 'Khóa học Writing Skills giúp học viên viết tiếng Anh chuyên nghiệp và hiệu quả.',
      startDate: '2024-03-05',
      endDate: '2024-05-05',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Writing+Skills']
    },
    { 
      id: 8, 
      title: 'Lớp Reading Comprehension', 
      content: 'Lớp Reading Comprehension giúp học viên đọc hiểu tiếng Anh nhanh và chính xác.',
      startDate: '2024-03-12',
      endDate: '2024-05-12',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Reading+Skills']
    },
    { 
      id: 9, 
      title: 'Khóa học Listening Practice', 
      content: 'Khóa học Listening Practice giúp học viên luyện nghe tiếng Anh hiệu quả.',
      startDate: '2024-03-08',
      endDate: '2024-05-08',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Listening+Practice']
    },
    { 
      id: 10, 
      title: 'Lớp Conversation Club', 
      content: 'Lớp Conversation Club giúp học viên thực hành giao tiếp tiếng Anh tự nhiên.',
      startDate: '2024-03-20',
      endDate: '2024-05-20',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Conversation+Club']
    },
    { 
      id: 11, 
      title: 'Khóa học Academic Writing', 
      content: 'Khóa học Academic Writing dành cho học viên muốn viết luận văn tiếng Anh.',
      startDate: '2024-03-25',
      endDate: '2024-05-25',
      status: 'Hoạt động',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=Academic+Writing']
    },
    { 
      id: 12, 
      title: 'Lớp TOEIC Advanced', 
      content: 'Lớp TOEIC Advanced giúp học viên đạt điểm cao trong kỳ thi TOEIC.',
      startDate: '2024-02-10',
      endDate: '2024-04-10',
      status: 'Đã ngừng',
      images: ['https://via.placeholder.com/300x200/ff0000/ffffff?text=TOEIC+Advanced']
    }
  ]);
  const [showAddAdvertisement, setShowAddAdvertisement] = useState(false);
  const [showEditAdvertisement, setShowEditAdvertisement] = useState(false);
  const [editingAdvertisement, setEditingAdvertisement] = useState(null);
  const [advertisementForm, setAdvertisementForm] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    images: []
  });
  const [showDetailAdvertisement, setShowDetailAdvertisement] = useState(false);
  const [detailAdvertisement, setDetailAdvertisement] = useState(null);
  const [tuitionPagination, setTuitionPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTuitions: 0,
    limit: 10
  });
  const [salaryPagination, setSalaryPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSalaries: 0,
    limit: 10
  });
  const [notificationsPagination, setNotificationsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    limit: 10
  });
  const [advertisementsPagination, setAdvertisementsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAdvertisements: 0,
    limit: 10
  });
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: 'IELTS Advanced',
      year: 2024,
      grade: 12,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Sarah Johnson',
      teacherEmail: 'sarah@tttenglish.edu.vn',
      currentStudents: 15,
      maxStudents: 20,
      feePerLesson: 500000,
      schedule: { startDate: '2024-01-15', endDate: '2024-06-15', daysOfLessonInWeek: [2, 4, 6] },
      studentList: []
    },
    {
      id: 2,
      className: 'TOEIC Preparation',
      year: 2024,
      grade: 11,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'John Smith',
      teacherEmail: 'john@tttenglish.edu.vn',
      currentStudents: 12,
      maxStudents: 18,
      feePerLesson: 450000,
      schedule: { startDate: '2024-02-01', endDate: '2024-07-01', daysOfLessonInWeek: [3, 5] },
      studentList: []
    },
    {
      id: 3,
      className: 'TOEIC Basic',
      year: 2024,
      grade: 10,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Mary Wilson',
      teacherEmail: 'mary@tttenglish.edu.vn',
      currentStudents: 18,
      maxStudents: 20,
      feePerLesson: 400000,
      schedule: { startDate: '2024-01-20', endDate: '2024-06-20', daysOfLessonInWeek: [2, 4] },
      studentList: []
    },
    {
      id: 4,
      className: 'IELTS Foundation',
      year: 2024,
      grade: 9,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'David Brown',
      teacherEmail: 'david@tttenglish.edu.vn',
      currentStudents: 14,
      maxStudents: 16,
      feePerLesson: 380000,
      schedule: { startDate: '2024-02-10', endDate: '2024-07-10', daysOfLessonInWeek: [3, 6] },
      studentList: []
    },
    {
      id: 5,
      className: 'Conversation Club',
      year: 2024,
      grade: 8,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Emma Davis',
      teacherEmail: 'emma@tttenglish.edu.vn',
      currentStudents: 20,
      maxStudents: 25,
      feePerLesson: 300000,
      schedule: { startDate: '2024-01-25', endDate: '2024-06-25', daysOfLessonInWeek: [5, 7] },
      studentList: []
    },
    {
      id: 6,
      className: 'Grammar Advanced',
      year: 2024,
      grade: 12,
      isAvailable: false,
      status: 'Đã kết thúc',
      teacherName: 'Michael Johnson',
      teacherEmail: 'michael@tttenglish.edu.vn',
      currentStudents: 16,
      maxStudents: 18,
      feePerLesson: 420000,
      schedule: { startDate: '2023-09-01', endDate: '2024-01-15', daysOfLessonInWeek: [2, 4] },
      studentList: []
    },
    {
      id: 7,
      className: 'Writing Skills',
      year: 2024,
      grade: 11,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Lisa Anderson',
      teacherEmail: 'lisa@tttenglish.edu.vn',
      currentStudents: 13,
      maxStudents: 15,
      feePerLesson: 480000,
      schedule: { startDate: '2024-02-15', endDate: '2024-07-15', daysOfLessonInWeek: [3, 5] },
      studentList: []
    },
    {
      id: 8,
      className: 'Reading Comprehension',
      year: 2024,
      grade: 10,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Robert Wilson',
      teacherEmail: 'robert@tttenglish.edu.vn',
      currentStudents: 17,
      maxStudents: 20,
      feePerLesson: 350000,
      schedule: { startDate: '2024-01-30', endDate: '2024-06-30', daysOfLessonInWeek: [2, 6] },
      studentList: []
    },
    {
      id: 9,
      className: 'Listening Practice',
      year: 2024,
      grade: 9,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Jennifer Lee',
      teacherEmail: 'jennifer@tttenglish.edu.vn',
      currentStudents: 19,
      maxStudents: 22,
      feePerLesson: 320000,
      schedule: { startDate: '2024-02-05', endDate: '2024-07-05', daysOfLessonInWeek: [4, 7] },
      studentList: []
    },
    {
      id: 10,
      className: 'Speaking Club',
      year: 2024,
      grade: 8,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Thomas Chen',
      teacherEmail: 'thomas@tttenglish.edu.vn',
      currentStudents: 21,
      maxStudents: 25,
      feePerLesson: 280000,
      schedule: { startDate: '2024-01-10', endDate: '2024-06-10', daysOfLessonInWeek: [5, 6] },
      studentList: []
    },
    {
      id: 11,
      className: 'Business English',
      year: 2024,
      grade: 12,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Amanda White',
      teacherEmail: 'amanda@tttenglish.edu.vn',
      currentStudents: 11,
      maxStudents: 15,
      feePerLesson: 550000,
      schedule: { startDate: '2024-02-20', endDate: '2024-07-20', daysOfLessonInWeek: [2, 5] },
      studentList: []
    },
    {
      id: 12,
      className: 'Academic Writing',
      year: 2024,
      grade: 11,
      isAvailable: true,
      status: 'Đang học',
      teacherName: 'Christopher Taylor',
      teacherEmail: 'christopher@tttenglish.edu.vn',
      currentStudents: 14,
      maxStudents: 16,
      feePerLesson: 520000,
      schedule: { startDate: '2024-01-05', endDate: '2024-06-05', daysOfLessonInWeek: [3, 6] },
      studentList: []
    }
  ]);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  })
  const [classesPagination, setClassesPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClasses: 0,
    limit: 10
  });

  const filteredTuitionList = tuitionList.filter(t =>
    (tuitionStatusFilter === 'all' || t.status === tuitionStatusFilter) &&
    (t.student.toLowerCase().includes(tuitionSearch.toLowerCase()) || t.class.toLowerCase().includes(tuitionSearch.toLowerCase()))
  );
  const totalPaid = tuitionList.reduce((sum, t) => sum + (t.paid || 0), 0);
  const totalUnpaid = tuitionList.reduce((sum, t) => sum + (t.amount - (t.paid || 0)), 0);

  // Pagination calculation functions
  const getPaginatedData = (data, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return data.slice(startIndex, endIndex);
  };

  const updatePagination = (setPaginationFunc, totalItems, currentPage = 1) => {
    const totalPages = Math.ceil(totalItems / 10);
    setPaginationFunc(prev => {
      // Only update if values actually changed
      if (prev.totalItems === totalItems && prev.totalPages === Math.max(1, totalPages)) {
        return prev;
      }
      return {
        ...prev,
        currentPage,
        totalPages: Math.max(1, totalPages),
        totalItems
      };
    });
  };

  // Paginated data
  const paginatedClasses = getPaginatedData(classes, classesPagination);
  const paginatedTuitions = getPaginatedData(filteredTuitionList, tuitionPagination);
  const paginatedNotifications = getPaginatedData(notifications, notificationsPagination);
  const paginatedAdvertisements = getPaginatedData(advertisements, advertisementsPagination);
  const paginatedSalaries = getPaginatedData(salaryList, salaryPagination);

  function handleApproveTuition(id) {
    setTuitionList(list => list.map(t => t.id === id ? { ...t, status: 'Đã duyệt', paid: t.amount } : t));
  }
  function handleRejectTuition(id) {
    if(window.confirm('Bạn có chắc muốn từ chối khoản học phí này?'))
      setTuitionList(list => list.map(t => t.id === id ? { ...t, status: 'Từ chối' } : t));
  }
  function handleAddTuition() {
    setNewTuitionData({student:'',parent:'',class:'',sessions:'',amount:'',paid:'',date:'',status:'Chờ duyệt',proofImage:''});
    setShowAddTuitionModal(true);
  }
  function handleRowClick(tuition, e) {
    // Không mở modal khi click vào nút thao tác
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setDetailTuitionData(tuition);
    setShowDetailTuitionModal(true);
  }
  function handleProofImageChange(e, setter) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setter(prev => ({...prev, proofImage: ev.target.result}));
      reader.readAsDataURL(file);
    }
  }

  // --- QUẢNG CÁO FUNCTIONS ---
  function handleAddAdvertisement() {
    setAdvertisementForm({
      title: '',
      content: '',
      startDate: '',
      endDate: '',
      images: []
    });
    setShowAddAdvertisement(true);
  }

  function handleEditAdvertisement(ad) {
    setEditingAdvertisement(ad);
    setAdvertisementForm({
      title: ad.title,
      content: ad.content,
      startDate: ad.startDate,
      endDate: ad.endDate,
      images: [...ad.images]
    });
    setShowEditAdvertisement(true);
  }

  function handleDeleteAdvertisement(id) {
    if (window.confirm('Bạn có chắc muốn xóa quảng cáo này?')) {
      setAdvertisements(list => list.filter(ad => ad.id !== id));
    }
  }

  function handleAdvertisementSubmit(e) {
    e.preventDefault();
    const newAd = {
      id: editingAdvertisement ? editingAdvertisement.id : Date.now(),
      title: advertisementForm.title,
      content: advertisementForm.content,
      startDate: advertisementForm.startDate,
      endDate: advertisementForm.endDate,
      status: 'Hoạt động',
      images: advertisementForm.images
    };

    if (editingAdvertisement) {
      setAdvertisements(list => list.map(ad => ad.id === editingAdvertisement.id ? newAd : ad));
      setShowEditAdvertisement(false);
      setEditingAdvertisement(null);
    } else {
      setAdvertisements(list => [newAd, ...list]);
      setShowAddAdvertisement(false);
    }

    setAdvertisementForm({
      title: '',
      content: '',
      startDate: '',
      endDate: '',
      images: []
    });
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files);
    const newImages = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        newImages.push(ev.target.result);
        if (newImages.length === files.length) {
          setAdvertisementForm(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function handleRemoveImage(index) {
    setAdvertisementForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }

  function handleToggleAdvertisementStatus(id) {
    setAdvertisements(list => list.map(ad => 
      ad.id === id ? { ...ad, status: ad.status === 'Hoạt động' ? 'Đã ngừng' : 'Hoạt động' } : ad
    ));
  }

  // Đổi tên hàm click quảng cáo để tránh trùng
  function handleAdRowClick(advertisement, e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
    setDetailAdvertisement(advertisement);
    setShowDetailAdvertisement(true);
  }

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'classes') {
      loadClasses()
    } else {
      // Clear error when switching away from data tabs
      setError('')
    }
  }, [activeTab, pagination.currentPage, selectedRole])

  // Reset pagination to page 1 when switching tabs
  useEffect(() => {
    setClassesPagination(prev => ({ ...prev, currentPage: 1 }));
    setTuitionPagination(prev => ({ ...prev, currentPage: 1 }));
    setSalaryPagination(prev => ({ ...prev, currentPage: 1 }));
    setNotificationsPagination(prev => ({ ...prev, currentPage: 1 }));
    setAdvertisementsPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [activeTab]);

  // Update pagination when data changes
  useEffect(() => {
    updatePagination(setClassesPagination, classes.length, 1);
  }, [classes.length]);

  useEffect(() => {
    updatePagination(setTuitionPagination, filteredTuitionList.length, 1);
  }, [filteredTuitionList.length]);

  useEffect(() => {
    updatePagination(setNotificationsPagination, notifications.length, 1);
  }, [notifications.length]);

  useEffect(() => {
    updatePagination(setAdvertisementsPagination, advertisements.length, 1);
  }, [advertisements.length]);

  useEffect(() => {
    updatePagination(setSalaryPagination, salaryList.length, 1);
  }, [salaryList.length]);

  const loadUsers = async () => {
    if (!user?.token) return
    
    setLoading(true)
    setError('')
    
    try {
      const filters = {}
      if (selectedRole !== 'all') {
        filters.role = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
      }
      
      const response = await apiService.getUsers(
        user.token, 
        pagination.currentPage, 
        pagination.limit, 
        filters
      )
      
      // Backend returns: {msg, data, pagination} instead of {success, users, pagination}
      if (response.data && Array.isArray(response.data)) {
        // Map the API response to match the UI structure
        const mappedUsers = response.data.map(user => ({
          id: user._id || user.id,
          name: user.name || user.userId?.name || 'Chưa có tên',
          email: user.email || user.userId?.email || 'Chưa có email',
          phone: user.phoneNumber || user.phone || user.userId?.phoneNumber || 'Chưa có',
          role: (user.role || 'unknown').toLowerCase(),
          status: user.isActive ? 'Đang hoạt động' : 'Tạm nghỉ',
          gender: user.gender || '',
          address: user.address || '',
          // Role-specific data
          parentId: user.parentId || null,
          classId: user.classId || null,
          childId: user.childId || [],
          canSeeTeacher: user.canSeeTeacher || false,
          wagePerLesson: user.wagePerLesson || 0
        }))
        
        setUsers(mappedUsers)
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            totalPages: response.pagination.totalPages || 1,
            totalUsers: response.pagination.totalItems || response.data.length
          }))
        }
      } else {
        setError(response.msg || 'Không thể tải danh sách người dùng')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const loadClasses = async () => {
    if (!user?.token) return
    
    setLoading(true)
    setError('')
    
    try {
      const filters = {}
      // Add filters if needed
      
      const response = await apiService.getClasses(user.token, 1, 100, filters)
      
      // Backend returns: {msg, data, pagination} instead of {success, classes}
      if (response.data && Array.isArray(response.data)) {
        // Map the API response to match the UI structure
        const mappedClasses = response.data.map(cls => ({
          id: cls._id || cls.id,
          className: cls.className || cls.name || 'Chưa có tên lớp',
          year: cls.year || new Date().getFullYear(),
          grade: cls.grade || 1,
          isAvailable: cls.isAvailable !== false,
          status: cls.isAvailable ? 'Đang học' : 'Đã kết thúc',
          teacherName: cls.teacherId?.name || cls.teacherId?.userId?.name || 'Chưa phân công',
          teacherEmail: cls.teacherId?.email || cls.teacherId?.userId?.email || '',
          currentStudents: cls.studentList?.length || 0,
          maxStudents: cls.maxStudents || 20,
          feePerLesson: cls.feePerLesson || 0,
          schedule: cls.schedule || {},
          studentList: cls.studentList || []
        }))
        
        setClasses(mappedClasses)
      } else {
        setError(response.msg || 'Không thể tải danh sách lớp học')
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Load available teachers for class assignment
  const loadAvailableTeachers = async (excludeClassId = null) => {
    if (!user?.token) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.getAvailableTeachers(user.token, excludeClassId)
      
      // Backend returns: {msg, data} instead of {success, teachers}
      if (response.data && Array.isArray(response.data)) {
        const mappedTeachers = response.data.map(teacher => ({
          _id: teacher._id || teacher.id,
          userId: {
            name: teacher.name || teacher.userId?.name || 'Chưa có tên',
            email: teacher.email || teacher.userId?.email || 'Chưa có email',
            phoneNumber: teacher.phoneNumber || teacher.phone || teacher.userId?.phoneNumber || ''
          },
          specialization: teacher.specialization || 'Chưa có chuyên môn',
          experience: teacher.experience || 0,
          currentClasses: teacher.currentClasses || []
        }))
        setAvailableTeachers(mappedTeachers)
      } else {
        setError(response.msg || 'Không thể tải danh sách giáo viên khả dụng')
      }
    } catch (error) {
      console.error('Error loading available teachers:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Load available students for class assignment
  const loadAvailableStudents = async (excludeClassId = null) => {
    if (!user?.token) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await apiService.getAvailableStudents(user.token, excludeClassId)
      
      // Backend returns: {msg, data} instead of {success, students}
      if (response.data && Array.isArray(response.data)) {
        const mappedStudents = response.data.map(student => ({
          _id: student._id || student.id,
          userId: {
            name: student.name || student.userId?.name || 'Chưa có tên',
            email: student.email || student.userId?.email || 'Chưa có email',
            phoneNumber: student.phoneNumber || student.phone || student.userId?.phoneNumber || ''
          },
          currentClasses: student.currentClasses || [],
          parentId: student.parentId || null
        }))
        setAvailableStudents(mappedStudents)
      } else {
        setError(response.msg || 'Không thể tải danh sách học sinh khả dụng')
      }
    } catch (error) {
      console.error('Error loading available students:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Handle teacher assignment to class
  const handleAssignTeacher = async (classId, teacherId) => {
    if (!user?.token) return
    
    setLoading(true)
    
    try {
      const response = await apiService.updateClass(user.token, classId, {
        teacherId: teacherId
      })
      
      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes('thành công')) {
        // Reload classes list
        loadClasses()
        setShowTeacherSelect(false)
        setSelectedClassForAssignment(null)
      } else {
        setError(response.msg || 'Không thể phân công giáo viên')
      }
    } catch (error) {
      console.error('Error assigning teacher:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Handle student enrollment to class
  const handleEnrollStudent = async (classId, studentId) => {
    if (!user?.token) return
    
    setLoading(true)
    
    try {
      const response = await apiService.updateClass(user.token, classId, {
        studentList: studentId
      })
      
      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes('thành công')) {
        // Reload classes list
        loadClasses()
        setShowStudentSelect(false)
        setSelectedClassForAssignment(null)
      } else {
        setError(response.msg || 'Không thể thêm học sinh vào lớp')
      }
    } catch (error) {
      console.error('Error enrolling student:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const mockData = {
    stats: {
      totalStudents: 150,
      totalTeachers: 12,
      activeClasses: 15,
      revenue: '45.000.000'
    },
    users: [
      // Giáo viên mẫu
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@tttenglish.edu.vn',
        phone: '0912345678',
        role: 'teacher',
        status: 'Đang hoạt động'
      },
      {
        id: 2,
        name: 'John Smith',
        email: 'john@tttenglish.edu.vn',
        phone: '0923456789',
        role: 'teacher',
        status: 'Đang hoạt động'
      },
      {
        id: 3,
        name: 'Mary Wilson',
        email: 'mary@tttenglish.edu.vn',
        phone: '0934567890',
        role: 'teacher',
        status: 'Đang hoạt động'
      },
      // Học viên mẫu
      {
        id: 4,
        name: 'Nguyễn Văn An',
        email: 'student1@gmail.com',
        phone: '0945678901',
        role: 'student',
        status: 'Đang học'
      },
      {
        id: 5,
        name: 'Trần Thị Bình',
        email: 'student2@gmail.com',
        phone: '0956789012',
        role: 'student',
        status: 'Đang học'
      },
      {
        id: 6,
        name: 'Lê Hoàng Nam',
        email: 'student3@gmail.com',
        phone: '0967890123',
        role: 'student',
        status: 'Đang học'
      },
      {
        id: 7,
        name: 'Phạm Thu Hà',
        email: 'student4@gmail.com',
        phone: '0978901234',
        role: 'student',
        status: 'Tạm nghỉ'
      },
      // Phụ huynh mẫu
      {
        id: 8,
        name: 'Nguyễn Văn Phụ',
        email: 'parent1@gmail.com',
        phone: '0989012345',
        role: 'parent',
        status: 'Đang hoạt động'
      },
      {
        id: 9,
        name: 'Trần Văn Huynh',
        email: 'parent2@gmail.com',
        phone: '0990123456',
        role: 'parent',
        status: 'Đang hoạt động'
      },
      {
        id: 10,
        name: 'Lê Thị Mai',
        email: 'parent3@gmail.com',
        phone: '0901234567',
        role: 'parent',
        status: 'Đang hoạt động'
      }
    ],
    classes: [
      {
        id: 1,
        name: 'IELTS Advanced',
        teacher: 'Sarah Johnson',
        teacherInfo: {
          email: 'sarah@tttenglish.edu.vn',
          phone: '0912345678',
          experience: '5 năm',
          specialty: 'IELTS'
        },
        maxStudents: 20,
        currentStudents: 15,
        students: [
          {
            id: 1,
            name: 'Nguyễn Văn An',
            attendance: '90%',
            progress: 'Tốt',
            lastAttendance: '18/03/2024'
          },
          {
            id: 2,
            name: 'Trần Thị Bình',
            attendance: '85%',
            progress: 'Khá',
            lastAttendance: '18/03/2024'
          },
          {
            id: 3,
            name: 'Lê Hoàng Nam',
            attendance: '95%',
            progress: 'Xuất sắc',
            lastAttendance: '18/03/2024'
          }
        ],
        schedule: 'Thứ 2,4,6 - 18:00-20:00',
        room: 'Phòng 101',
        status: 'Đang học',
        startDate: '01/03/2024',
        endDate: '30/06/2024',
        courseFee: '15.000.000',
        description: 'Khóa học IELTS nâng cao, mục tiêu band điểm 7.0+',
        materials: [
          'Oxford IELTS Preparation',
          'Cambridge IELTS 15-16-17',
          'Tài liệu bổ trợ từ giáo viên'
        ],
        nextLesson: {
          date: '20/03/2024',
          topic: 'Academic Writing Task 2',
          preparation: 'Ôn tập các dạng essay thường gặp'
        }
      },
      {
        id: 2,
        name: 'TOEIC Preparation',
        teacher: 'John Smith',
        teacherInfo: {
          email: 'john@tttenglish.edu.vn',
          phone: '0923456789',
          experience: '3 năm',
          specialty: 'TOEIC'
        },
        maxStudents: 15,
        currentStudents: 12,
        students: [
          {
            id: 4,
            name: 'Phạm Thu Hà',
            attendance: '88%',
            progress: 'Khá',
            lastAttendance: '19/03/2024'
          },
          {
            id: 5,
            name: 'Đỗ Văn Minh',
            attendance: '92%',
            progress: 'Tốt',
            lastAttendance: '19/03/2024'
          }
        ],
        schedule: 'Thứ 3,5 - 17:30-19:30',
        room: 'Phòng 203',
        status: 'Đang học',
        startDate: '15/03/2024',
        endDate: '15/06/2024',
        courseFee: '12.000.000',
        description: 'Khóa học TOEIC từ 500 đến 750+',
        materials: [
          'ETS TOEIC 2023',
          'TOEIC Practice Tests',
          'Tài liệu bổ trợ từ giáo viên'
        ],
        nextLesson: {
          date: '21/03/2024',
          topic: 'Part 7: Reading Comprehension',
          preparation: 'Làm bài tập Reading Practice Test 05'
        }
      }
    ],
    payments: [
      {
        id: 1,
        student: 'Alice Brown',
        amount: '5.000.000',
        date: '15/03/2024',
        course: 'IELTS Advanced',
        status: 'Đã thanh toán'
      },
      {
        id: 2,
        student: 'Bob Wilson',
        amount: '5.000.000',
        date: '14/03/2024',
        course: 'TOEIC Preparation',
        status: 'Chưa thanh toán'
      }
    ]
  }

  const filteredUsers = users // Users are already filtered by the API call

  const handleAddUser = () => {
    setFormData({
      name: '',
      email: '',
      passwordBeforeHash: '',
      phone: '',
      role: 'Student',
      gender: '',
      address: '',
      parentId: '',
      classIds: [],
      studentIds: [],
      canViewTeacher: false,
    })
    setEditingUser(null)
    setError('') // Clear any previous errors
    setShowAddUserForm(true)
  }

  // Fetch detailed user info for editing
  const handleEditUser = async (userSummary) => {
    if (!user?.token) return;
    
    setLoading(true);
    setEditingUser(userSummary); // Set tạm thời để hiển thị modal
    setShowAddUserForm(true);
    
    try {
      // Gọi API để lấy thông tin chi tiết của user
      const response = await apiService.getUserById(user.token, userSummary.id);
      
      if (response.success && response.data) {
        // Cập nhật form data với thông tin chi tiết
        setFormData({
          id: response.data.id,
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          role: response.data.role || '',
          gender: response.data.gender || '',
          address: response.data.address || '',
          passwordBeforeHash: '', // Không lấy password từ API
          classIds: response.data.classIds || [],
          studentIds: response.data.studentIds || [],
          parentId: response.data.parentId || '',
          canViewTeacher: response.data.canViewTeacher
        });
        setEditingUser(response.data);
      } else {
        setError('Không thể lấy thông tin người dùng');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Lỗi khi lấy thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
      return;
    }

    setLoading(true);
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      setError("Không tìm thấy người dùng để xóa.");
      setLoading(false);
      return;
    }

    try {
      // Try to delete using the user's role first, then fallback to general endpoint
      const response = await apiService.deleteUser(user.token, userId, userToDelete.role);
      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes('thành công')) {
        loadUsers(); // Refresh the user list
      } else {
        setError(response.msg || 'Không thể xóa người dùng')
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return;

    setLoading(true);
    try {
      let response;
      
      if (editingUser) {
        // Cập nhật user
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          gender: formData.gender,
          address: formData.address,
          classIds: formData.classIds,
          studentIds: formData.studentIds,
          parentId: formData.parentId,
          canViewTeacher: formData.canViewTeacher
        };

        // Chỉ thêm password nếu người dùng nhập mới
        if (formData.passwordBeforeHash) {
          updateData.passwordBeforeHash = formData.passwordBeforeHash;
        }

        response = await apiService.updateUser(user.token, editingUser.id, updateData);
      } else {
        // Tạo user mới
        response = await apiService.createUser(user.token, formData);
      }

      if (response.success) {
        setShowAddUserForm(false);
        setEditingUser(null);
        // Reset form
        setFormData({
          name: '',
          email: '',
          passwordBeforeHash: '',
          phone: '',
          role: 'Student',
          gender: '',
          address: '',
          parentId: '',
          classIds: [],
          studentIds: [],
          canViewTeacher: false,
        });
        // Reload danh sách users
        loadUsers();
      } else {
        setError(response.message || 'Không thể lưu thông tin người dùng');
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Lỗi khi lưu thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'canViewTeacher' && type === 'radio') {
      setFormData(prev => ({
        ...prev,
        canViewTeacher: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  const handleViewClassDetail = (classItem) => {
    setSelectedClass(classItem)
    setShowClassDetail(true)
  }

  const handleEditClass = async (classItem) => {
    if (!user?.token) return;

    setShowEditClass(true);
    setSelectedClass(classItem);
    setLoading(true);
    setError('');
    setEditClassData(null); // Clear previous data while loading

    try {
        // The API docs point to GET /v1/api/classes/:classId. 
        // We assume a corresponding method exists in apiService.
        const response = await apiService.getClassById(user.token, classItem.id);

        if (response.success && response.class) {
            const fetchedClass = response.class;
            
            // The form's data structure differs from the API response.
            // We need to transform the data to match the form's fields.
            const formattedData = {
                id: fetchedClass._id,
                name: fetchedClass.className || '',
                status: fetchedClass.isAvailable ? 'Đang học' : 'Đã kết thúc',
                startDate: fetchedClass.schedule?.startDate ? new Date(fetchedClass.schedule.startDate).toLocaleDateString('vi-VN') : '',
                endDate: fetchedClass.schedule?.endDate ? new Date(fetchedClass.schedule.endDate).toLocaleDateString('vi-VN') : '',
                courseFee: fetchedClass.feePerLesson?.toString() || '0',
                description: fetchedClass.description || 'Chưa có mô tả chi tiết.',
                teacher: fetchedClass.teacherId?.name || 'Chưa phân công',
                teacherInfo: {
                    email: fetchedClass.teacherId?.email || '',
                    phone: fetchedClass.teacherId?.phoneNumber || '',
                    experience: fetchedClass.teacherId?.experience || '',
                    specialty: fetchedClass.teacherId?.specialty || ''
                },
                schedule: fetchedClass.schedule?.daysOfLessonInWeek?.join(', ') || '',
                room: fetchedClass.room || 'Chưa có phòng',
                students: fetchedClass.studentList || [],
                currentStudents: fetchedClass.studentList?.length || 0,
                maxStudents: fetchedClass.maxStudents || 20,
            };
            setEditClassData(formattedData);
        } else {
            throw new Error(response.message || "Không thể tải chi tiết lớp học.");
        }
    } catch (err) {
        console.error('Lỗi khi tải chi tiết lớp học:', err);
        setError(`Lỗi: ${err.message}. Hiển thị thông tin tóm tắt.`);
        // Fallback to summary data from the list if the API fails
        setEditClassData({
            ...classItem, // Use the summary data
            name: classItem.className, // Ensure name is mapped correctly
            teacherInfo: classItem.teacherInfo ? { ...classItem.teacherInfo } : {},
            students: classItem.students || []
        });
    } finally {
        setLoading(false);
    }
  };

  const handleEditClassChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setEditClassData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setEditClassData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleAddStudentToClass = () => {
    // setShowAddStudent(true)
  }

  const handleRemoveStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này khỏi lớp?')) {
      setEditClassData(prev => ({
        ...prev,
        students: prev.students.filter(student => student.id !== studentId),
        currentStudents: prev.currentStudents - 1
      }))
    }
  }

  // Dummy implementation for saving student changes in class edit modal
  // const handleSaveStudentChanges = (studentId) => {
  //   // You can implement API call here to save student changes if needed
  //   // For now, just show a notification or log
  //   alert('Đã lưu thay đổi cho học viên!');
  // }

  const handleSaveClass = () => {
    // Trong thực tế sẽ gọi API để lưu thông tin
    console.log('Lưu thông tin lớp:', editClassData)
    setShowEditClass(false)
  }

  const handleCreateClass = async () => {
    if (!user?.token) return

    setLoading(true)

    try {
      // Function to convert YYYY-MM-DD to MM/DD/YYYY format
      const formatDateForAPI = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        return `${month}/${day}/${year}`
      }

      // Transform newClass data to match API format
      const classData = {
        className: newClass.name,
        year: parseInt(newClass.year) || new Date().getFullYear(),
        grade: parseInt(newClass.grade) || 1,
        isAvailable: true,
        feePerLesson: parseInt(newClass.feePerLesson) || 0,
        schedule: {
          startDate: formatDateForAPI(newClass.startDate),
          endDate: formatDateForAPI(newClass.endDate),
          daysOfLessonInWeek: newClass.daysOfLessonInWeek || []
        },
        teacherId: newClass.teacherId || null,
        studentList: []
      }

      const response = await apiService.createClass(user.token, classData)

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes('thành công')) {
        setShowNewClassModal(false)
        setNewClass({
          name: '',
          year: new Date().getFullYear(),
          grade: '',
          startDate: '',
          endDate: '',
          feePerLesson: '',
          teacherId: '',
          daysOfLessonInWeek: []
        })
        // Reload classes list
        loadClasses()
      } else {
        setError(response.msg || 'Không thể tạo lớp học')
      }
    } catch (error) {
      console.error('Error creating class:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Load available teachers for new class creation
  const loadTeachersForNewClass = async () => {
    if (!user?.token) return
    
    try {
      const response = await apiService.getAvailableTeachers(user.token)
      
      // Backend returns: {msg, data} instead of {success, teachers}
      if (response.data && response.data.length > 0) {
        setAvailableTeachers(response.data)
        console.log('✅ Loaded teachers for new class:', response.data.length)
      } else {
        console.log('⚠️ No teachers found')
        setAvailableTeachers([])
      }
    } catch (error) {
      console.error('Error loading teachers for new class:', error)
      setAvailableTeachers([])
    }
  }

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) return
    if (!user?.token) return

    setLoading(true)

    try {
      const response = await apiService.deleteClass(user.token, classId)
      
      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes('thành công')) {
        // Reload classes list
        loadClasses()
      } else {
        setError(response.msg || 'Không thể xóa lớp học')
      }
    } catch (error) {
      console.error('Error deleting class:', error)
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // Load data for form selects
  const loadFormData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
        const [parentsRes, studentsRes, classesRes] = await Promise.all([
            apiService.getUsers(user.token, 1, 1000, { role: 'Parent' }),
            apiService.getUsers(user.token, 1, 1000, { role: 'Student' }),
            apiService.getClasses(user.token, 1, 1000, {})
        ]);

        // Backend returns: {msg, data, pagination} instead of {success, users/classes}
        if (parentsRes.data) {
          const mappedParents = parentsRes.data.map(parent => ({
            id: parent._id || parent.id,
            name: parent.name || parent.userId?.name || 'Chưa có tên',
            email: parent.email || parent.userId?.email || 'Chưa có email'
          }));
          setParents(mappedParents);
        }
        
        if (studentsRes.data) {
          const mappedStudents = studentsRes.data.map(student => ({
            id: student._id || student.id,
            name: student.name || student.userId?.name || 'Chưa có tên',
            email: student.email || student.userId?.email || 'Chưa có email'
          }));
          setStudents(mappedStudents);
        }
        
        if (classesRes.data) {
          const mappedClasses = classesRes.data.map(cls => ({
            id: cls._id || cls.id,
            className: cls.className || cls.name || 'Chưa có tên lớp'
          }));
          setAllClasses(mappedClasses);
        }

    } catch (err) {
        console.error("Failed to load form data", err);
        setError("Không thể tải dữ liệu cho form.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (showAddUserForm) {
        loadFormData();
    }
  }, [showAddUserForm]);

  const handleStudentSelect = (studentId) => {
    if (studentId && !formData.studentIds.includes(studentId)) {
        setFormData(prev => ({
            ...prev,
            studentIds: [...prev.studentIds, studentId]
        }));
    }
  };

  const handleRemoveStudentFromParent = (studentId) => {
    setFormData(prev => ({
        ...prev,
        studentIds: prev.studentIds.filter(id => id !== studentId)
    }));
  };

  const handleClassSelect = (classId) => {
    if (classId && !formData.classIds.includes(classId)) {
        setFormData(prev => ({
            ...prev,
            classIds: [...prev.classIds, classId]
        }));
    }
  };

  const handleRemoveClass = (classId) => {
    setFormData(prev => ({
        ...prev,
        classIds: prev.classIds.filter(id => id !== classId)
    }));
  };

  const handleGoHome = () => {
    navigate('/');
    if (onGoHome) onGoHome();
  };

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header">
        <h1>
          <FiUser className="icon" />
          Quản trị viên
        </h1>
        <div className="user-info">
          <span>Xin chào, {user?.name}</span>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <RiDashboardLine className="icon" />
              Tổng quan
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FiUsers className="icon"  />
              Quản lý Users
            </button>
            <button
              className={`nav-item ${activeTab === 'classes' ? 'active' : ''}`}
              onClick={() => setActiveTab('classes')}
            >
              <HiAcademicCap className="icon" />
              Lớp học
            </button>
        
            <button
              className={`nav-item ${activeTab === 'tuition' ? 'active' : ''}`}
              onClick={() => setActiveTab('tuition')}
            >
              <MdPayment className="icon" />
              Học phí
            </button>
            <button
              className={`nav-item ${activeTab === 'salary' ? 'active' : ''}`}
              onClick={() => setActiveTab('salary')}
            >
              <BiMoney className="icon" />
              Lương giáo viên
            </button>
            {/* New sidebar items */}
            <button
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <MdNotifications className="icon" />
              Thông báo
            </button>
            <button
              className={`nav-item ${activeTab === 'advertisements' ? 'active' : ''}`}
              onClick={() => setActiveTab('advertisements')}
            >
              <MdCampaign className="icon" />
              Quảng cáo
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
              onClick={() => onLogout()}
            >
              <FiLogOut className="icon" />
              Đăng xuất
            </button>
          </div>
        </aside>

        <main className="main-content">
          {activeTab === 'overview' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-chart-pie"></i>
                  Tổng quan hệ thống
                </h2>
              </div>
              <div className="card-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 cột mỗi hàng, nếu muốn 1 hàng thì dùng repeat(6, 1fr)
                gap: '1.5rem',
                padding: '0.5rem 0'
              }}>
                
                <div className="card" style={{
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
                    <h3>
                      <FiUsers className="icon" style={{ color: '#b30000' }} />
                      Tổng số học viên
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>{mockData.stats.totalStudents}</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Học viên đang theo học</p>
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
                    <h3>
                      <FiUsers className="icon" style={{ color: '#b30000' }} />
                      Tổng số giáo viên
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>{mockData.stats.totalTeachers}</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Giáo viên đang giảng dạy</p>
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
                    <h3>
                      <HiAcademicCap className="icon" style={{ color: '#b30000' }} />
                      Lớp học đang hoạt động
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2.5rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>{mockData.stats.activeClasses}</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Lớp học đang diễn ra</p>
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
                    <h3>
                      <BiMoney className="icon" style={{ color: '#b30000' }} />
                      Doanh thu tháng
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>{mockData.stats.revenue} VNĐ</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Tổng thu tháng 3/2024</p>
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
                    <h3>
                      <FiBarChart2 className="icon" style={{ color: '#b30000' }} />
                      Tỷ lệ hoàn thành bài tập
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>92%</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Bài tập đã hoàn thành trong tháng</p>
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
                    <h3>
                      <FiFileText className="icon" style={{ color: '#b30000' }} />
                      Số lượng tài liệu
                    </h3>
                    <p className="stat" style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#b30000',
                      margin: '1rem 0',
                      textAlign: 'center'
                    }}>38</p>
                    <p style={{
                      textAlign: 'center',
                      color: '#666',
                      fontSize: '0.9rem',
                      margin: '0'
                    }}>Tài liệu học tập hiện có</p>
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
          )}

          {activeTab === 'users' && (
            <section>
              <div className="section-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 className="section-title" style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  <FiUsers style={{ marginRight: '0.75rem', color: '#3b82f6' }} />
                  Quản lý Users
                </h2>
                <div className="section-actions">
                  <button className="btn btn-primary" onClick={handleAddUser} style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <FiUser style={{ fontSize: '1rem' }} />
                    Thêm User mới
                  </button>
                </div>
              </div>

              <div className="filter-section" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiUsers style={{ color: '#6b7280' }} />
                  <label htmlFor="roleFilter" style={{ 
                    fontWeight: '500', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Lọc theo vai trò:
                  </label>
                </div>
                <select
                  id="roleFilter"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="role-filter"
                  disabled={loading}
                  style={{
                    padding: '0.5rem 0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '0.875rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1
                  }}
                >
                  <option value="all">Tất cả</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="student">Học viên</option>
                  <option value="parent">Phụ huynh</option>
                </select>
                
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Hiển thị {pagination.limit} kết quả
                  </span>
                </div>
              </div>

              {error && (
                <div className="error-message" style={{
                  padding: '1rem',
                  backgroundColor: '#fed7d7',
                  color: '#c53030',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              {loading && (
                <div className="loading-message" style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#4a5568'
                }}>
                  Đang tải dữ liệu...
                </div>
              )}

              {showAddUserForm && (
                <div className="modal">
                  <div className="modal-content">
                      <h3>
                        <FiEdit className="icon" />
                        {editingUser ? `Chỉnh sửa User: ${editingUser.name || ''}` : 'Thêm User mới'}
                      </h3>
                      {loading && editingUser ? (
                        <div className="loading-message" style={{padding: '3rem 0'}}>Đang tải thông tin...</div>
                      ) : error ? (
                        <div className="error-message">{error}</div>
                      ) : (
                        <form onSubmit={handleFormSubmit}>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiUser className="icon" />
                              <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập họ và tên"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiMail className="icon" />
                              <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ email"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiLock className="icon" />
                              <input
                                id="passwordBeforeHash"
                                type="password"
                                name="passwordBeforeHash"
                                value={formData.passwordBeforeHash}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                                minLength="8"
                                {...(editingUser ? {} : { required: true })}
                              />
                            </div>
                            {editingUser && (
                              <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Để trống nếu không muốn thay đổi mật khẩu
                              </small>
                            )}
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiPhone className="icon" />
                              <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiUsers className="icon" />
                              <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                              >
                                <option value="Student">Học viên</option>
                                <option value="Teacher">Giáo viên</option>
                                <option value="Parent">Phụ huynh</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiUser className="icon" />
                              <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                              </select>
                            </div>
                          </div>
                          <div className="form-group">
                            <div className="input-with-icon">
                              <FiMapPin className="icon" />
                              <input
                                id="address"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ"
                              />
                            </div>
                          </div>

                          {/* Conditional Fields */}
                          {formData.role === 'Student' && (
                            <>
                              <div className="form-group">
                                <div className="input-with-icon">
                                  <FiUser className="icon" />
                                  <select id="parentId" name="parentId" value={formData.parentId} onChange={handleInputChange} >
                                    <option value="">Chọn phụ huynh</option>
                                    {parents.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id.slice(-6)})</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="input-with-icon">
                                  <HiAcademicCap className="icon" />
                                  <select onChange={(e) => handleClassSelect(e.target.value)} value="">
                                    <option value="">Chọn lớp học để thêm</option>
                                    {allClasses.filter(c => !formData.classIds.includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                  <div className="multi-select-container">
                                      {formData.classIds.map(id => {
                                          const classItem = allClasses.find(c => c.id === id);
                                          return classItem ? (
                                              <div key={id} className="selected-item-badge">
                                                  <span>{classItem.className}</span>
                                                  <button type="button" onClick={() => handleRemoveClass(id)}>&times;</button>
                                              </div>
                                          ) : null;
                                      })}
                                  </div>
                              </div>
                            </>
                          )}

                          {formData.role === 'Parent' && (
                            <>
                              <div className="form-group">
                                <div className="input-with-icon">
                                  <FiUsers className="icon" />
                                  <select onChange={(e) => handleStudentSelect(e.target.value)} value="">
                                    <option value="">Chọn học viên để thêm</option>
                                    {students.filter(s => !formData.studentIds.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.name} (ID: {s.id.slice(-6)})</option>)}
                                  </select>
                                </div>
                              </div>
                              <div className="form-group">
                                <div className="multi-select-container">
                                  {formData.studentIds.map(id => {
                                    const student = students.find(s => s.id === id);
                                    return student ? (
                                      <div key={id} className="selected-item-badge">
                                        <span>{student.name}</span>
                                        <button type="button" onClick={() => handleRemoveStudentFromParent(id)}>&times;</button>
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                              <div className="form-group">
                                <label style={{marginBottom: 0, marginRight: '1.5rem'}}>Quyền xem giáo viên:</label>
                                <div className="radio-group radio-group-horizontal">
                                  <label>
                                    <input type="radio" name="canViewTeacher" value="true" checked={formData.canViewTeacher === true} onChange={handleInputChange} />
                                    Có
                                  </label>
                                  <label>
                                    <input type="radio" name="canViewTeacher" value="false" checked={formData.canViewTeacher === false} onChange={handleInputChange} />
                                    Không
                                  </label>
                                </div>
                              </div>
                            </>
                          )}

                          {formData.role === 'Teacher' && (
                            <>
                               <div className="form-group">
                                 <div className="input-with-icon">
                                   <HiAcademicCap className="icon" />
                                   <select onChange={(e) => handleClassSelect(e.target.value)} value="">
                                     <option value="">Chọn lớp dạy để thêm</option>
                                     {allClasses.filter(c => !formData.classIds.includes(c.id)).map(c => <option key={c.id} value={c.id}>{c.className}</option>)}
                                   </select>
                                 </div>
                               </div>
                               <div className="form-group">
                                   <div className="multi-select-container">
                                       {formData.classIds.map(id => {
                                           const classItem = allClasses.find(c => c.id === id);
                                           return classItem ? (
                                               <div key={id} className="selected-item-badge">
                                                   <span>{classItem.className}</span>
                                                   <button type="button" onClick={() => handleRemoveClass(id)}>&times;</button>
                                               </div>
                                           ) : null;
                                       })}
                                   </div>
                               </div>
                             </>
                          )}

                          
                                                <div className="form-actions" style={{display: 'flex', justifyContent: 'center', gap: '0.75rem'}}>
                            <button 
                              type="submit" 
                              className="btn btn-primary"
                              style={{
                                minWidth: '130px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                              }}
                            >
                              <FiSave style={{fontSize: '1rem', flexShrink: 0}} />
                              <span>
                                {editingUser ? 'Cập nhật' : 'Thêm mới'}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => {
                                setShowAddUserForm(false)
                                setEditingUser(null)
                              }}
                              style={{
                                width: '130px',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.4rem',
                              }}
                            >
                              <FiX style={{fontSize: '1rem', flexShrink: 0}} />
                              <span style={{flex: 1, textAlign: 'center'}}>
                                Hủy Bỏ
                              </span>
                            </button>
                          </div>
                      </form>
                      )}
                  </div>
                </div>
              )}

              {!loading && (
                <div className="table-container" style={{
                  overflowX: 'auto',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  backgroundColor: 'white',
                  minHeight: '400px',
                  height: 'auto',
                  maxHeight: 'none'
                }}>
                  <table className="data-table" style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.875rem',
                    height: 'auto',
                    minHeight: '300px'
                  }}>
                  <thead>
                      <tr style={{
                        backgroundColor: '#f8fafc',
                        borderBottom: '2px solid #e2e8f0'
                      }}>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '200px',
                          width: '15%'
                        }}>Họ và tên</th>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '180px',
                          width: '19%'
                        }}>Email</th>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '120px',
                          width: '15%'
                        }}>Số điện thoại</th>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '100px',
                          width: '12.5%'
                        }}>Vai trò</th>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '100px',
                          width: '12.2%'
                        }}>Trạng thái</th>
                        <th style={{
                          padding: '1.25rem 1rem',
                          textAlign: 'center',
                          fontWeight: '600',
                          color: '#374151',
                          borderBottom: '1px solid #e5e7eb',
                          minWidth: '150px',
                          width: '16%'
                        }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                          <td colSpan="6" style={{ 
                            textAlign: 'center', 
                            padding: '4rem 1rem', 
                            color: '#6b7280',
                            fontSize: '1rem'
                          }}>
                          {error ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Không có người dùng nào'}
                        </td>
                      </tr>
                    ) : (
                        filteredUsers.map((user, index) => (
                          <tr key={user.id} style={{
                            backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                            borderBottom: '1px solid #f3f4f6',
                            transition: 'background-color 0.2s ease',
                            minHeight: '80px',
                            height: 'auto'
                          }}>
                            <td style={{
                              padding: '1.25rem 1rem',
                              fontWeight: '500',
                              color: '#111827',
                              verticalAlign: 'middle'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '2.5rem',
                                  height: '2.5rem',
                                  borderRadius: '50%',
                                  backgroundColor: '#3b82f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.875rem',
                                  fontWeight: '600',
                                  flexShrink: 0
                                }}>
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  minWidth: 0,
                                  flex: 1
                                }}>
                                  <span style={{ 
                                    fontWeight: '600',
                                    color: '#111827',
                                    fontSize: '0.95rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    {user.name}
                                  </span>
                                  <span style={{ 
                                    fontSize: '0.75rem',
                                    color: '#6b7280',
                                    marginTop: '0.125rem'
                                  }}>
                                    ID: {user.id?.slice(-8) || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td style={{
                              padding: '1.25rem 1rem',
                              color: '#374151',
                              verticalAlign: 'middle'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiMail style={{ fontSize: '1rem', color: '#6b7280', flexShrink: 0 }} />
                                <span style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {user.email}
                                </span>
                              </div>
                            </td>
                            <td style={{
                              padding: '1.25rem 1rem',
                              color: '#374151',
                              verticalAlign: 'middle'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiPhone style={{ fontSize: '1rem', color: '#6b7280', flexShrink: 0 }} />
                                <span style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {user.phone || 'Chưa có'}
                                </span>
                              </div>
                            </td>
                            <td style={{
                              padding: '1.25rem 1rem',
                              verticalAlign: 'middle'
                            }}>
                              <span style={{
                                padding: '0.375rem 0.875rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                display: 'inline-block',
                                whiteSpace: 'nowrap',
                                ...(user.role === 'teacher' && {
                                  backgroundColor: '#dbeafe',
                                  color: '#1e40af'
                                }),
                                ...(user.role === 'student' && {
                                  backgroundColor: '#dcfce7',
                                  color: '#166534'
                                }),
                                ...(user.role === 'parent' && {
                                  backgroundColor: '#fef3c7',
                                  color: '#92400e'
                                }),
                                ...(user.role === 'admin' && {
                                  backgroundColor: '#f3e8ff',
                                  color: '#7c3aed'
                                })
                              }}>
                            {user.role === 'teacher' && 'Giáo viên'}
                            {user.role === 'student' && 'Học viên'}
                            {user.role === 'parent' && 'Phụ huynh'}
                            {user.role === 'admin' && 'Quản trị viên'}
                              </span>
                          </td>
                            <td style={{
                              padding: '1.25rem 1rem',
                              verticalAlign: 'middle'
                            }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.375rem 0.875rem',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                whiteSpace: 'nowrap'
                              }}>
                                <div style={{
                                  width: '0.5rem',
                                  height: '0.5rem',
                                  borderRadius: '50%',
                                  backgroundColor: '#22c55e'
                                }}></div>
                              {user.status}
                            </span>
                          </td>
                            <td style={{
                              padding: '1.25rem 1rem',
                              textAlign: 'center',
                              verticalAlign: 'middle'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                gap: '0.5rem', 
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                              }}>
                              <button
                                className="btn btn-secondary"
                                onClick={() => handleEditUser(user)}
                                disabled={loading}
                                  style={{
                                    padding: '0.625rem 0.875rem',
                                    fontSize: '0.75rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: loading ? 0.5 : 1,
                                    fontWeight: '500',
                                    minWidth: '70px'
                                  }}
                                >
                                  <FiEdit style={{ fontSize: '0.875rem' }} />
                                Sửa
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={loading}
                                  style={{
                                    padding: '0.625rem 0.875rem',
                                    fontSize: '0.75rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    backgroundColor: '#fef2f2',
                                    color: '#dc2626',
                                    border: '1px solid #fecaca',
                                    borderRadius: '0.375rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    opacity: loading ? 0.5 : 1,
                                    fontWeight: '500',
                                    minWidth: '70px'
                                  }}
                                >
                                  <FiTrash2 style={{ fontSize: '0.875rem' }} />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>
              )}

              {/* Pagination Controls */}
              {!loading && filteredUsers.length > 0 && pagination.totalPages > 1 && (
                <Pagination 
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalUsers}
                  limit={pagination.limit}
                  onPageChange={setPagination}
                />
              )}
            </section>
          )}

          {activeTab === 'classes' && (
            <section>
              <div className="section-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.75rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb'
              }}>
                <h2 className="section-title" style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  <FiBook style={{ marginRight: '0.75rem', color: '#3b82f6' }} />
                  Quản lý lớp học
                </h2>
                <div className="section-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setShowNewClassModal(true)}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      opacity: loading ? 0.5 : 1
                    }}
                  >
                    <FiPlus style={{ fontSize: '1rem' }} />
                    Tạo lớp mới
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message" style={{
                  padding: '1rem',
                  backgroundColor: '#fed7d7',
                  color: '#c53030',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem'
                }}>
                  {error}
                </div>
              )}

              {loading && (
                <div className="loading-message" style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#4a5568'
                }}>
                  Đang tải dữ liệu...
                </div>
              )}

              {!loading && (
                <div className="card-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1.5rem',
                  padding: '0.5rem 0'
                }}>
                  {classes.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '3rem', 
                      color: '#6b7280',
                      gridColumn: '1 / -1',
                      backgroundColor: 'white',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}>
                      <FiBook style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }} />
                      <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>
                      {error ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Chưa có lớp học nào'}
                      </h3>
                      <p style={{ color: '#6b7280' }}>
                        {error ? 'Vui lòng thử lại sau' : 'Hãy tạo lớp học đầu tiên để bắt đầu'}
                      </p>
                    </div>
                  ) : (
                    paginatedClasses.map(classItem => (
                      <div key={classItem.id} className="card" style={{
                        backgroundColor: 'white',
                        borderRadius: '0.75rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #e5e7eb',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}>
                        <div className="card-header" style={{
                          padding: '1.5rem 1.5rem 1rem 1.5rem',
                          borderBottom: '1px solid #f3f4f6',
                          backgroundColor: '#f8fafc'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h3 style={{
                              margin: 0,
                              fontSize: '1.25rem',
                              fontWeight: '600',
                              color: '#111827',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              <FiBook style={{ color: '#3b82f6' }} />
                            {classItem.className}
                          </h3>
                            <span style={{
                              padding: '0.25rem 0.75rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              ...(classItem.isAvailable ? {
                                backgroundColor: '#dcfce7',
                                color: '#166534'
                              } : {
                                backgroundColor: '#fef3c7',
                                color: '#92400e'
                              })
                            }}>
                              {classItem.status}
                            </span>
                          </div>
                          <p style={{
                            margin: 0,
                            color: '#6b7280',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <HiAcademicCap style={{ fontSize: '1rem' }} />
                            Lớp {classItem.grade} - Năm học {classItem.year}
                          </p>
                        </div>
                        
                        <div className="card-content" style={{
                          padding: '1.5rem'
                        }}>
                          <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <FiUser style={{ color: '#6b7280', fontSize: '1rem' }} />
                              <span style={{ color: '#374151', fontWeight: '500' }}>Giáo viên:</span>
                              <span style={{ color: '#6b7280' }}>{classItem.teacherName}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <FiUsers style={{ color: '#6b7280', fontSize: '1rem' }} />
                              <span style={{ color: '#374151', fontWeight: '500' }}>Học viên:</span>
                              <span style={{ color: '#6b7280' }}>
                                {classItem.currentStudents}/{classItem.maxStudents}
                              </span>
                              <div style={{
                                flex: 1,
                                height: '0.5rem',
                                backgroundColor: '#e5e7eb',
                                borderRadius: '9999px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  height: '100%',
                                  backgroundColor: '#3b82f6',
                                  width: `${(classItem.currentStudents / classItem.maxStudents) * 100}%`,
                                  transition: 'width 0.3s ease'
                                }}></div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <BiMoney style={{ color: '#6b7280', fontSize: '1rem' }} />
                              <span style={{ color: '#374151', fontWeight: '500' }}>Học phí/buổi:</span>
                              <span style={{ color: '#059669', fontWeight: '600' }}>
                                {classItem.feePerLesson?.toLocaleString()} VNĐ
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="card-actions" style={{
                          padding: '1rem 1.5rem',
                          borderTop: '1px solid #f3f4f6',
                          backgroundColor: '#f9fafb',
                          display: 'flex',
                          gap: '0.5rem',
                          justifyContent: 'center',
                          flexWrap: 'wrap'
                        }}>
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleViewClassDetail(classItem)}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: loading ? 0.5 : 1
                            }}
                          >
                            <FiEye style={{ fontSize: '0.875rem' }} />
                            Chi tiết
                          </button>
                          
                          <button 
                            className="btn btn-secondary"
                            onClick={() => handleEditClass(classItem)}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#eff6ff',
                              color: '#1d4ed8',
                              border: '1px solid #bfdbfe',
                              borderRadius: '0.375rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: loading ? 0.5 : 1
                            }}
                          >
                            <FiEdit style={{ fontSize: '0.875rem' }} />
                            Sửa
                          </button>
                          
                          <button 
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedClassForAssignment(classItem)
                              loadAvailableTeachers(classItem.id)
                              setShowTeacherSelect(true)
                            }}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#e6f3ff',
                              color: '#0066cc',
                              border: '1px solid #b3d9ff',
                              borderRadius: '0.375rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: loading ? 0.5 : 1
                            }}
                            title="Phân công giáo viên"
                          >
                            <FiUser style={{ fontSize: '0.875rem' }} />
                            <span style={{ fontSize: '0.75rem' }}>GV</span>
                          </button>
                          
                          <button 
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedClassForAssignment(classItem)
                              loadAvailableStudents(classItem.id)
                              setShowStudentSelect(true)
                            }}
                            disabled={loading}
                            style={{
                              padding: '0.5rem 0.75rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              backgroundColor: '#f0fff4',
                              color: '#38a169',
                              border: '1px solid #9ae6b4',
                              borderRadius: '0.375rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: loading ? 0.5 : 1
                            }}
                            title="Thêm học sinh"
                          >
                            <FiUsers style={{ fontSize: '0.875rem' }} />
                            <span style={{ fontSize: '0.75rem' }}>HS</span>
                          </button>
                          
                          <button 
                            className="action-icon delete"
                            onClick={() => handleDeleteClass(classItem.id)}
                            disabled={loading}
                            title="Xóa"
                            style={{ 
                              padding: '0.5rem',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fecaca',
                              borderRadius: '0.375rem',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease',
                              opacity: loading ? 0.5 : 1,
                              minWidth: '2.5rem',
                              minHeight: '2.5rem'
                            }}
                          >
                            <FiTrash2 style={{ fontSize: '0.875rem' }}/>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Pagination for Classes */}
              {!loading && classes.length > 0 && classesPagination.totalPages > 1 && (
                <Pagination 
                  currentPage={classesPagination.currentPage}
                  totalPages={classesPagination.totalPages}
                  totalItems={classesPagination.totalClasses}
                  limit={classesPagination.limit}
                  onPageChange={(newPage) => setClassesPagination(prev => ({ ...prev, currentPage: newPage }))}
                  loading={loading}
                  itemName="lớp học"
                />
              )}

              {showClassDetail && selectedClass && (
                <div className="modal">
                  <div className="modal-content class-detail">
                    <h3>
                      <i className="fas fa-edit"></i>
                      Chi tiết lớp học: {selectedClass.name}
                    </h3>
                    
                    <div className="class-edit-form">
                      <div className="form-section">
                        <h4>
                          <i className="fas fa-info-circle"></i>
                          Thông tin chung
                        </h4>
                        <div className="form-group">
                          <label>Tên lớp:</label>
                          <input
                            type="text"
                            value={selectedClass?.className || ''}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Năm học:</label>
                          <input
                            type="text"
                            value={selectedClass?.year || ''}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Khối lớp:</label>
                          <input
                            type="text"
                            value={`Lớp ${selectedClass?.grade || ''}`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Học phí/buổi:</label>
                          <input
                            type="text"
                            value={`${selectedClass?.feePerLesson?.toLocaleString() || 0} VNĐ`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Trạng thái:</label>
                          <input
                            type="text"
                            value={selectedClass?.status || 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-section">
                        <h4>
                          <i className="fas fa-chalkboard-teacher"></i>
                          Thông tin giáo viên
                        </h4>
                        <div className="form-group">
                          <label>Giáo viên:</label>
                          <input
                            type="text"
                            value={selectedClass?.teacherName || 'Chưa phân công'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            type="email"
                            value={selectedClass?.teacherEmail || 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Số điện thoại:</label>
                          <input
                            type="text"
                            value={selectedClass?.teacherInfo?.phone || 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Kinh nghiệm:</label>
                          <input
                            type="text"
                            value={selectedClass?.teacherInfo?.experience || 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Chuyên môn:</label>
                          <input
                            type="text"
                            value={selectedClass?.teacherInfo?.specialty || 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-section">
                        <h4>
                          <i className="fas fa-calendar-alt"></i>
                          Lịch học
                        </h4>
                        <div className="form-group">
                          <label>Ngày bắt đầu:</label>
                          <input
                            type="text"
                            value={selectedClass?.schedule?.startDate ? new Date(selectedClass.schedule.startDate).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Ngày kết thúc:</label>
                          <input
                            type="text"
                            value={selectedClass?.schedule?.endDate ? new Date(selectedClass.schedule.endDate).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Thứ học:</label>
                          <input
                            type="text"
                            value={selectedClass?.schedule?.daysOfLessonInWeek ? selectedClass.schedule.daysOfLessonInWeek.map(day => {
                              const dayNames = {
                                0: 'Chủ nhật',
                                1: 'Thứ 2',
                                2: 'Thứ 3',
                                3: 'Thứ 4',
                                4: 'Thứ 5',
                                5: 'Thứ 6',
                                6: 'Thứ 7'
                              };
                              return dayNames[day];
                            }).join(', ') : 'Chưa có thông tin'}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-section full-width">
                        <div className="section-header">
                          <h4>
                            <i className="fas fa-users"></i>
                            Danh sách học viên ({selectedClass?.currentStudents || 0}/{selectedClass?.maxStudents || 20})
                          </h4>
                        </div>
                        <div className="table-container">
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Họ và tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedClass?.studentList?.length > 0 ? (
                                selectedClass.studentList.map(student => (
                                  <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>
                                      <span className={`status-badge ${student.isActive ? 'success' : 'warning'}`}>
                                        {student.isActive ? 'Đang học' : 'Tạm nghỉ'}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                    Chưa có học viên nào trong lớp
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowClassDetail(false)}
                      >
                        <i className="fas fa-times"></i>
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showEditClass && (
                <div className="modal">
                  <div className="modal-content class-detail">
                    <h3>
                      <i className="fas fa-edit"></i>
                      Chỉnh sửa lớp học: {selectedClass?.className}
                    </h3>
                    
                    {loading ? (
                      <div className="loading-message" style={{padding: '3rem 0'}}>Đang tải thông tin lớp học...</div>
                    ) : error ? (
                      <div className="error-message">{error}</div>
                    ) : editClassData ? (
                      <>
                        <div className="class-edit-form">
                          <div className="form-section">
                            <h4>
                              <i className="fas fa-info-circle"></i>
                              Thông tin chung
                            </h4>
                            <div className="form-group">
                              <label>Tên lớp:</label>
                              <input
                                type="text"
                                name="name"
                                value={editClassData.name}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Trạng thái:</label>
                              <select
                                name="status"
                                value={editClassData.status}
                                onChange={handleEditClassChange}
                              >
                                <option value="Đang học">Đang học</option>
                                <option value="Chưa bắt đầu">Chưa bắt đầu</option>
                                <option value="Đã kết thúc">Đã kết thúc</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label>Ngày bắt đầu:</label>
                              <input
                                type="text"
                                name="startDate"
                                value={editClassData.startDate}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Ngày kết thúc:</label>
                              <input
                                type="text"
                                name="endDate"
                                value={editClassData.endDate}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Học phí:</label>
                              <input
                                type="text"
                                name="courseFee"
                                value={editClassData.courseFee}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Mô tả:</label>
                              <textarea
                                name="description"
                                value={editClassData.description}
                                onChange={handleEditClassChange}
                              />
                            </div>
                          </div>

                          <div className="form-section">
                            <h4>
                              <i className="fas fa-chalkboard-teacher"></i>
                              Thông tin giáo viên
                            </h4>
                            <div className="form-group">
                              <label>Giáo viên:</label>
                              <input
                                type="text"
                                name="teacher"
                                value={editClassData.teacher}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Email:</label>
                              <input
                                type="email"
                                name="teacherInfo.email"
                                value={editClassData.teacherInfo.email}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Số điện thoại:</label>
                              <input
                                type="text"
                                name="teacherInfo.phone"
                                value={editClassData.teacherInfo.phone}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Kinh nghiệm:</label>
                              <input
                                type="text"
                                name="teacherInfo.experience"
                                value={editClassData.teacherInfo.experience}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Chuyên môn:</label>
                              <input
                                type="text"
                                name="teacherInfo.specialty"
                                value={editClassData.teacherInfo.specialty}
                                onChange={handleEditClassChange}
                              />
                            </div>
                          </div>

                          <div className="form-section">
                            <h4>
                              <i className="fas fa-calendar-alt"></i>
                              Lịch học
                            </h4>
                            <div className="form-group">
                              <label>Lịch học:</label>
                              <input
                                type="text"
                                name="schedule"
                                value={editClassData.schedule}
                                onChange={handleEditClassChange}
                              />
                            </div>
                            <div className="form-group">
                              <label>Phòng học:</label>
                              <input
                                type="text"
                                name="room"
                                value={editClassData.room}
                                onChange={handleEditClassChange}
                              />
                            </div>
                          </div>

                          <div className="form-section full-width">
                            <div className="section-header">
                              <h4>
                                <i className="fas fa-users"></i>
                                Danh sách học viên ({editClassData.currentStudents}/{editClassData.maxStudents})
                              </h4>
                              <button 
                                className="btn btn-primary"
                                onClick={handleAddStudentToClass}
                              >
                                <i className="fas fa-user-plus"></i>
                                Thêm học viên
                              </button>
                            </div>
                            <div className="table-container">
                              <table className="data-table">
                                <thead>
                                  <tr>
                                    <th>Họ và tên</th>
                                    <th>Chuyên cần</th>
                                    <th>Tiến độ</th>
                                    <th>Buổi học gần nhất</th>
                                    <th>Thao tác</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {editClassData?.students?.length > 0 ? (
                                    editClassData.students.map(student => (
                                      <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>
                                          <input
                                            type="text"
                                            value={student.attendance}
                                            onChange={(e) => {
                                              const newStudents = editClassData.students.map(s => 
                                                s.id === student.id ? {...s, attendance: e.target.value} : s
                                              )
                                              setEditClassData(prev => ({...prev, students: newStudents}))
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <select
                                            value={student.progress}
                                            onChange={(e) => {
                                              const newStudents = editClassData.students.map(s => 
                                                s.id === student.id ? {...s, progress: e.target.value} : s
                                              )
                                              setEditClassData(prev => ({...prev, students: newStudents}))
                                            }}
                                          >
                                            <option value="Xuất sắc">Xuất sắc</option>
                                            <option value="Tốt">Tốt</option>
                                            <option value="Khá">Khá</option>
                                            <option value="Trung bình">Trung bình</option>
                                            <option value="Cần cải thiện">Cần cải thiện</option>
                                          </select>
                                        </td>
                                        <td>{student.lastAttendance}</td>
                                        <td>
                                          <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                              className="action-icon save"
                                              // onClick={() => handleSaveStudentChanges(student.id)}
                                              title="Lưu"
                                              style={{ 
                                                color: '#38a169',
                                                background: 'white',
                                                padding: '4px',
                                                fontSize: '0.875rem'
                                              }}
                                            >
                                              <FiSave className="icon" style={{ fontSize: '1.2rem' }}/>
                                            </button>
                                            <button
                                              className="action-icon delete"
                                              onClick={() => handleRemoveStudent(student.id)}
                                              title="Xóa"
                                              style={{ 
                                                color: '#e53e3e',
                                                background: 'white',
                                                padding: '4px',
                                                fontSize: '0.875rem'
                                              }}
                                            >
                                              <FiTrash2 className="icon" style={{ fontSize: '1.2rem' }}/>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                        Chưa có học viên nào trong lớp
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        <div className="form-actions">
                          <button 
                            className="btn btn-primary"
                            onClick={handleSaveClass}
                          >
                            <i className="fas fa-save"></i>
                            Lưu thay đổi
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowEditClass(false)}
                          >
                            <i className="fas fa-times"></i>
                            Hủy
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* New Class Modal */}
              {showNewClassModal && (
                <div className="modal">
                  <div className="modal-content">
                    <h3>
                      <FiPlus className="icon" />
                      Tạo lớp học mới
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateClass(); }}>
                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiBook className="icon" />
                          <input
                            type="text"
                            id="className"
                            value={newClass.name}
                            onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                            placeholder="Ví dụ: 3A1, 4B2"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiCalendar className="icon" />
                          <input
                            type="number"
                            id="year"
                            value={newClass.year}
                            onChange={(e) => setNewClass({...newClass, year: parseInt(e.target.value)})}
                            min="2020"
                            max="2030"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <HiAcademicCap className="icon" />
                          <select
                            id="grade"
                            value={newClass.grade}
                            onChange={(e) => setNewClass({...newClass, grade: parseInt(e.target.value)})}
                            required
                          >
                            <option value="">Chọn khối lớp</option>
                            <option value="1">Lớp 1</option>
                            <option value="2">Lớp 2</option>
                            <option value="3">Lớp 3</option>
                            <option value="4">Lớp 4</option>
                            <option value="5">Lớp 5</option>
                            <option value="6">Lớp 6</option>
                            <option value="7">Lớp 7</option>
                            <option value="8">Lớp 8</option>
                            <option value="9">Lớp 9</option>
                            <option value="10">Lớp 10</option>
                            <option value="11">Lớp 11</option>
                            <option value="12">Lớp 12</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <BiMoney className="icon" />
                          <input
                            type="number"
                            id="feePerLesson"
                            value={newClass.feePerLesson}
                            onChange={(e) => setNewClass({...newClass, feePerLesson: parseInt(e.target.value)})}
                            min="0"
                            placeholder="Ví dụ: 100000"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiCalendar className="icon" />
                          <input
                            type="date"
                            id="startDate"
                            value={newClass.startDate}
                            onChange={(e) => setNewClass({...newClass, startDate: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiCalendar className="icon" />
                          <input
                            type="date"
                            id="endDate"
                            value={newClass.endDate}
                            onChange={(e) => setNewClass({...newClass, endDate: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {[
                            { value: 1, label: 'Chủ nhật' },
                            { value: 2, label: 'Thứ 2' },
                            { value: 3, label: 'Thứ 3' },
                            { value: 4, label: 'Thứ 4' },
                            { value: 5, label: 'Thứ 5' },
                            { value: 6, label: 'Thứ 6' },
                            { value: 7, label: 'Thứ 7' }
                          ].map(day => (
                            <label key={day.value} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <input
                                type="checkbox"
                                checked={newClass.daysOfLessonInWeek.includes(day.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewClass({
                                      ...newClass,
                                      daysOfLessonInWeek: [...newClass.daysOfLessonInWeek, day.value]
                                    });
                                  } else {
                                    setNewClass({
                                      ...newClass,
                                      daysOfLessonInWeek: newClass.daysOfLessonInWeek.filter(d => d !== day.value)
                                    });
                                  }
                                }}
                              />
                              <span style={{ fontSize: '0.875rem' }}>{day.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiUser className="icon" />
                          <select
                            id="teacherId"
                            value={newClass.teacherId}
                            onChange={(e) => setNewClass({...newClass, teacherId: e.target.value})}
                            onFocus={() => loadTeachersForNewClass()}
                          >
                            <option value="">Chọn giáo viên (để trống nếu chưa phân công)</option>
                            {availableTeachers.map(teacher => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.userId?.name || 'Chưa có tên'} - {teacher.specialization || 'Chưa có chuyên môn'}
                              </option>
                            ))}
                          </select>
                        </div>
                        <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                          Có thể để trống và phân công giáo viên sau
                        </small>
                      </div>

                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setShowNewClassModal(false)}
                          disabled={loading}
                        >
                          <FiX className="icon" />
                          Hủy
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          <FiSave className="icon" />
                          {loading ? 'Đang tạo...' : 'Tạo lớp'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

        
          {activeTab === 'tuition' && (
            <section>
              <div className="section-header" style={{justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <h2 className="section-title">
                  <MdPayment className="icon" />
                  Quản lý Học phí
                </h2>
                <button className="btn btn-primary" style={{background:'#b30000'}} onClick={handleAddTuition}>Thêm khoản học phí</button>
              </div>
              {/* Bộ lọc và tìm kiếm */}
              <div style={{display:'flex',gap:'1.5rem',alignItems:'center',marginBottom:'1.5rem',background:'#fff',padding:'1rem 1.5rem',borderRadius:10,boxShadow:'0 1px 3px #0001',border:'1px solid #eee'}}>
                <div>
                  <label style={{fontWeight:600,color:'#b30000',marginRight:8}}>Trạng thái:</label>
                  <select value={tuitionStatusFilter} onChange={e=>setTuitionStatusFilter(e.target.value)} style={{padding:'0.4rem 1.2rem',borderRadius:6,border:'1px solid #ddd'}}>
                    <option value="all">Tất cả</option>
                    <option value="Chờ duyệt">Chờ duyệt</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                    <option value="Từ chối">Từ chối</option>
                  </select>
                </div>
                <div style={{flex:1}}>
                  <input type="text" placeholder="Tìm kiếm học viên..." value={tuitionSearch} onChange={e=>setTuitionSearch(e.target.value)} style={{width:'100%',padding:'0.4rem 1.2rem',borderRadius:6,border:'1px solid #ddd'}}/>
                </div>
                <div style={{fontWeight:600,color:'#b30000',fontSize:'1.1rem'}}>
                  Tổng thu: {totalPaid.toLocaleString()} VNĐ
                </div>
                <div style={{fontWeight:600,color:'#92400e',fontSize:'1.1rem'}}>
                  Chưa thu: {totalUnpaid.toLocaleString()} VNĐ
                </div>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Học viên</th>
                      <th>Lớp</th>
                      <th>Số buổi</th>
                      <th>Tổng tiền</th>
                      <th>Đã đóng</th>
                      <th style={{width: '10%'}}>Ngày</th>
                      <th style={{width: '15%'}}>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTuitionList.length === 0 ? (
                      <tr><td colSpan="8" style={{textAlign:'center',padding:'2rem',color:'#b30000'}}>Không có dữ liệu</td></tr>
                    ) : paginatedTuitions.map(tuition => (
                      <tr key={tuition.id} style={{cursor:'pointer'}} onClick={e=>handleRowClick(tuition, e)}>
                        <td>{tuition.student}</td>
                        <td>{tuition.class}</td>
                        <td style={{textAlign:'center'}}>{tuition.sessions}</td>
                        <td style={{color:'#b30000',fontWeight:600}}>{tuition.amount?.toLocaleString()} VNĐ</td>
                        <td style={{color:'#166534',fontWeight:600}}>{(tuition.paid||0).toLocaleString()} VNĐ</td>
                        <td>{tuition.date}</td>
                        <td>
                          <span className={`status-badge ${tuition.status === 'Đã duyệt' ? 'success' : tuition.status === 'Từ chối' ? 'danger' : 'warning'}`}
                            style={{
                              backgroundColor: tuition.status === 'Đã duyệt' ? '#dcfce7' : tuition.status === 'Từ chối' ? '#ffeaea' : '#fef3c7',
                              color: tuition.status === 'Đã duyệt' ? '#166534' : tuition.status === 'Từ chối' ? '#b30000' : '#92400e',
                              border: tuition.status === 'Đã duyệt' ? '1px solid #16a34a' : tuition.status === 'Từ chối' ? '1px solid #b30000' : '1px solid #f59e42',
                              fontWeight: 600
                            }}
                          >
                            {tuition.status}
                          </span>
                        </td>
                        <td style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                          {tuition.status === 'Chờ duyệt' && (
                            <button className="btn btn-primary" style={{background:'#b30000',color:'#fff',borderRadius:8,fontWeight:600}}
                              onClick={e=>{e.stopPropagation();handleApproveTuition(tuition.id);}}
                            >Phê duyệt</button>
                          )}
                          {tuition.status === 'Chờ duyệt' && (
                            <button className="btn btn-danger" style={{background:'#ffeaea',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600}}
                              onClick={e=>{e.stopPropagation();handleRejectTuition(tuition.id);}}
                            >Từ chối</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Tuitions */}
              {!loading && filteredTuitionList.length > 0 && tuitionPagination.totalPages > 1 && (
                <Pagination 
                  currentPage={tuitionPagination.currentPage}
                  totalPages={tuitionPagination.totalPages}
                  totalItems={tuitionPagination.totalTuitions}
                  limit={tuitionPagination.limit}
                  onPageChange={(newPage) => setTuitionPagination(prev => ({ ...prev, currentPage: newPage }))}
                  loading={loading}
                  itemName="khoản học phí"
                />
              )}

              {/* Modal chi tiết học phí */}
              {showDetailTuitionModal && detailTuitionData && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:420}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>Chi tiết khoản học phí</h3>
                    <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,background:'#fff5f5',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 8px #b3000022',marginBottom:'1.2rem'}}>
                      <tbody>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Tên học viên</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.student}</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Tên phụ huynh</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.parent}</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Tên lớp</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.class}</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Số buổi học</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.sessions}</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Tổng số tiền</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.amount?.toLocaleString()} VNĐ</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Tiền đã đóng</td><td style={{padding:'0.7rem',textAlign:'right'}}>{(detailTuitionData.paid||0).toLocaleString()} VNĐ</td></tr>
                        <tr><td style={{fontWeight:600,color:'#b30000',padding:'0.7rem'}}>Ảnh minh chứng</td><td style={{padding:'0.7rem',textAlign:'right'}}>{detailTuitionData.proofImage ? <img src={detailTuitionData.proofImage} alt="minh chứng" style={{maxWidth:120,maxHeight:80,borderRadius:8}}/> : <span style={{color:'#888'}}>Chưa có</span>}</td></tr>
                      </tbody>
                    </table>
                    <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                      <button className="btn btn-secondary" onClick={()=>setShowDetailTuitionModal(false)}>Đóng</button>
                    </div>
                  </div>
                </div>
              )}
              {/* Modal thêm học phí */}
              {showAddTuitionModal && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:400}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>Thêm khoản học phí</h3>
                    <form onSubmit={e=>{
                      e.preventDefault();
                      setTuitionList(list => [
                        {...newTuitionData, id: Date.now(), amount: Number(newTuitionData.amount), paid: Number(newTuitionData.paid)||0},
                        ...list
                      ]);
                      setShowAddTuitionModal(false);
                    }}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Học viên</label>
                        <input type="text" required value={newTuitionData.student} onChange={e=>setNewTuitionData(d=>({...d,student:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Phụ huynh</label>
                        <input type="text" required value={newTuitionData.parent} onChange={e=>setNewTuitionData(d=>({...d,parent:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Lớp</label>
                        <input type="text" required value={newTuitionData.class} onChange={e=>setNewTuitionData(d=>({...d,class:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Số buổi</label>
                        <input type="number" min={0} required value={newTuitionData.sessions} onChange={e=>setNewTuitionData(d=>({...d,sessions:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Tổng tiền</label>
                        <input type="number" min={0} required value={newTuitionData.amount} onChange={e=>setNewTuitionData(d=>({...d,amount:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Đã đóng</label>
                        <input type="number" min={0} value={newTuitionData.paid} onChange={e=>setNewTuitionData(d=>({...d,paid:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Ngày</label>
                        <input type="date" required value={newTuitionData.date} onChange={e=>setNewTuitionData(d=>({...d,date:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Ảnh minh chứng</label>
                        <input type="file" accept="image/*" onChange={e=>handleProofImageChange(e, setNewTuitionData)} style={{flex:1,minWidth:0}}/>
                        {newTuitionData.proofImage && <img src={newTuitionData.proofImage} alt="minh chứng" style={{maxWidth:60,maxHeight:40,marginLeft:8,borderRadius:6}}/>}
                      </div>
                      <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowAddTuitionModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary" style={{background:'#b30000'}}>Thêm</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          {activeTab === 'salary' && (
            <section className="salary-section">
              <div className="section-header" style={{justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <h2 className="section-title">
                  <BiMoney className="icon" />
                  Thanh toán lương giáo viên
                </h2>
                <button className="btn btn-primary" style={{background:'#b30000'}} onClick={()=>setShowMonthModal(true)}>Tính lương</button>
              </div>
              <div className="table-container">
                <table className="data-table">
                <thead>
                  <tr>
                    <th>Họ và tên</th>
                    <th>Số buổi dạy</th>
                    <th>Lương/buổi</th>
                    <th><b>Tổng lương</b></th>
                    <th><b>Thời gian</b></th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSalaries.map(teacher => {
                    const total = teacher.sessions * teacher.wage;
                    let status = 'Chưa trả';
                    if (teacher.paidAmount >= total) status = 'Trả hết';
                    else if (teacher.paidAmount > 0) status = 'Còn thiếu';
                    return (
                      <tr key={teacher.id} style={{cursor:'pointer'}} onClick={e=>{
                        // Đừng mở modal khi click vào nút thao tác
                        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                        setDetailData(teacher);
                        setShowDetailModal(true);
                      }}>
                        <td style={{fontWeight:600,color:'#b30000'}}>{teacher.name}</td>
                        <td style={{textAlign:'center'}}>{teacher.sessions}</td>
                        <td style={{color:'#b30000',fontWeight:500}}>{teacher.wage.toLocaleString()} VNĐ</td>
                        <td style={{color:'#b30000',fontWeight:500}}>{total.toLocaleString()} VNĐ</td>
                        <td style={{color:'#374151',fontWeight:500}}>{teacher.period || ''}</td>
                        <td>
                          <span className={`status-badge ${status === 'Trả hết' ? 'success' : status === 'Còn thiếu' ? 'warning' : ''}`}
                            style={{
                              backgroundColor: status === 'Trả hết' ? '#dcfce7' : status === 'Còn thiếu' ? '#fef3c7' : '#ffeaea',
                              color: status === 'Trả hết' ? '#166534' : status === 'Còn thiếu' ? '#92400e' : '#b30000',
                              border: status === 'Trả hết' ? '1px solid #16a34a' : status === 'Còn thiếu' ? '1px solid #f59e42' : '1px solid #b30000',
                              fontWeight: 600
                            }}
                          >
                            {status}
                        </span>
                      </td>
                        <td style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                          {status === 'Trả hết' ? (
                            <button className="btn btn-secondary" style={{background:'#f3f4f6',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600,cursor:'not-allowed',opacity:0.7}} disabled>Đã trả hết</button>
                          ) : (
                            <button className="btn btn-primary" style={{background:'#b30000',color:'#fff',borderRadius:8,fontWeight:600}}
                              onClick={e=>{
                                e.stopPropagation();
                                setShowSalaryModal(true);
                                setSalaryModalData({teacher, amount: total - teacher.paidAmount});
                              }}
                            >
                              Thanh toán
                            </button>
                          )}
                          <button className="btn btn-secondary" style={{background:'#fff',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600}}
                            onClick={e=>{
                              e.stopPropagation();
                              setEditData({...teacher});
                              setShowEditModal(true);
                            }}
                          >Sửa</button>
                          <button className="btn btn-danger" style={{background:'#ffeaea',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600}}
                            onClick={e=>{
                              e.stopPropagation();
                              if(window.confirm('Bạn có chắc muốn xóa giáo viên này khỏi bảng lương?'))
                                setSalaryList(list=>list.filter(t=>t.id!==teacher.id));
                            }}
                          >Xóa</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              </div>

              {/* Pagination for Salaries */}
              {!loading && salaryList.length > 0 && salaryPagination.totalPages > 1 && (
                <Pagination 
                  currentPage={salaryPagination.currentPage}
                  totalPages={salaryPagination.totalPages}
                  totalItems={salaryPagination.totalSalaries}
                  limit={salaryPagination.limit}
                  onPageChange={(newPage) => setSalaryPagination(prev => ({ ...prev, currentPage: newPage }))}
                  loading={loading}
                  itemName="giáo viên"
                />
              )}

              {/* Modal chi tiết giáo viên */}
              {showDetailModal && detailData && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:420}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:8}}>
                      <BiMoney style={{fontSize:'1.5rem'}}/> Chi tiết lương giáo viên
                    </h3>
                    <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,background:'#fff5f5',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 8px #b3000022',marginBottom:'1.2rem'}}>
                      <tbody>
                        <tr>
                          <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',width:'40%',borderBottom:'1px solid #ffeaea'}}>Họ tên</td>
                        <td style={{padding:'0.7rem 0.7rem',textAlign:'right',fontWeight:500}}>{detailData.name}</td>
                      </tr>
                      <tr>
                        <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Email</td>
                        <td style={{padding:'0.7rem 0.7rem',textAlign:'right'}}>{detailData.email}</td>
                      </tr>
                      <tr>
                        <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Số điện thoại</td>
                      <td style={{padding:'0.7rem 0.7rem',textAlign:'right'}}>{detailData.phone}</td>
                    </tr>
                    <tr>
                      <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Số buổi dạy</td>
                    <td style={{padding:'0.7rem 0.7rem',textAlign:'right'}}>{detailData.sessions}</td>
                  </tr>
                  <tr>
                    <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Lương/buổi</td>
                  <td style={{padding:'0.7rem 0.7rem',textAlign:'right',color:'#b30000',fontWeight:600}}>{detailData.wage?.toLocaleString()} VNĐ</td>
                </tr>
                <tr>
                  <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Tổng lương</td>
                <td style={{padding:'0.7rem 0.7rem',textAlign:'right',color:'#b30000',fontWeight:700}}>{(detailData.sessions*detailData.wage)?.toLocaleString()} VNĐ</td>
              </tr>
              <tr>
                <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Đã trả</td>
              <td style={{padding:'0.7rem 0.7rem',textAlign:'right',color:'#166534',fontWeight:600}}>{detailData.paidAmount?.toLocaleString()} VNĐ</td>
            </tr>
            <tr>
              <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Thời gian</td>
            <td style={{padding:'0.7rem 0.7rem',textAlign:'right'}}>{detailData.period || ''}</td>
          </tr>
          <tr>
            <td style={{padding:'0.7rem 0.7rem',fontWeight:600,color:'#b30000'}}>Trạng thái</td>
          <td style={{padding:'0.7rem 0.7rem',textAlign:'right',fontWeight:700,color: detailData.paidAmount >= detailData.sessions*detailData.wage ? '#166534' : detailData.paidAmount > 0 ? '#92400e' : '#b30000'}}>
            {detailData.paidAmount >= detailData.sessions*detailData.wage ? 'Trả hết' : detailData.paidAmount > 0 ? 'Còn thiếu' : 'Chưa trả'}
          </td>
        </tr>
                      </tbody>
                    </table>
                    <div className="form-actions" style={{
                      display: 'flex',
                      gap: '0.7rem',
                      justifyContent: 'center',
                      marginTop: '0',
                      marginRight: '0',
                      marginLeft: '0',
                      marginBottom: '0',
                      padding: '0 0.5rem 0.5rem 0.5rem',
                      width: '100%',
                    }}>
                      <button
                        className="btn btn-secondary"
                        style={{
                          background: '#fff',
                          color: '#b30000',
                          border: '1px solid #b30000',
                          minWidth: 90,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: '0.5rem 1.2rem'
                        }}
                        onClick={() => {
                          setEditData({ ...detailData });
                          setShowEditModal(true);
                          setShowDetailModal(false);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{
                          minWidth: 90,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: '0.5rem 1.2rem'
                        }}
                        onClick={() => setShowDetailModal(false)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Modal tính lương theo tháng */}
              {showMonthModal && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:350}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>Tính lương theo tháng</h3>
                    <form onSubmit={e=>{
                      e.preventDefault();
                      setSalaryList(list => list.map(t => ({
                        ...t,
                        period: salaryMonth ? salaryMonth.split('-').reverse().join('/') : t.period
                      })));
                      setShowMonthModal(false);
                    }}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Tháng</label>
                        <input type="month" required value={salaryMonth} onChange={e=>setSalaryMonth(e.target.value)} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowMonthModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary" style={{background:'#b30000'}}>Tính lương</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Modal thanh toán lương */}
              {showSalaryModal && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:400}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>Thanh toán lương cho giáo viên</h3>
                    <div style={{marginBottom:'1.1rem',fontWeight:600}}>
                      Giáo viên: <span style={{color:'#b30000'}}>{salaryModalData.teacher?.name}</span>
                    </div>
                    <form onSubmit={e=>{
                      e.preventDefault();
                      setSalaryList(list => list.map(t => t.id === salaryModalData.teacher.id ? {...t, paidAmount: t.paidAmount + Number(salaryModalData.amount)} : t));
                      alert(`Đã thanh toán ${Number(salaryModalData.amount).toLocaleString()} VNĐ cho ${salaryModalData.teacher?.name}`);
                      setShowSalaryModal(false);
                    }}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Số tiền</label>
                        <input type="number" min={0} required value={salaryModalData.amount} onChange={e=>setSalaryModalData(d=>({...d,amount:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowSalaryModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary" style={{background:'#b30000'}}>Xác nhận</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Modal sửa thông tin giáo viên */}
              {showEditModal && editData && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:400}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>Sửa thông tin thanh toán</h3>
                    <form onSubmit={e=>{
                      e.preventDefault();
                      setSalaryList(list => list.map(t => t.id === editData.id ? {...t, ...editData} : t));
                      setShowEditModal(false);
                    }}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Tên</label>
                        <input type="text" required value={editData.name} onChange={e=>setEditData(d=>({...d,name:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Email</label>
                        <input type="email" required value={editData.email} onChange={e=>setEditData(d=>({...d,email:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Số điện thoại</label>
                        <input type="text" required value={editData.phone} onChange={e=>setEditData(d=>({...d,phone:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Số buổi</label>
                        <input type="number" min={0} required value={editData.sessions} onChange={e=>setEditData(d=>({...d,sessions:Number(e.target.value)}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Lương/buổi</label>
                        <input type="number" min={0} required value={editData.wage} onChange={e=>setEditData(d=>({...d,wage:Number(e.target.value)}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-actions" style={{display:'flex',justifyContent:'center',gap:'1rem'}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowEditModal(false)}>Hủy</button>
                        <button type="submit" className="btn btn-primary" style={{background:'#b30000'}}>Lưu</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          {activeTab === 'notifications' && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdNotifications className="icon" />
                  Quản lý Thông báo
                </h2>
                <div className="section-actions">
                  <button className="btn btn-primary" style={{background:'#b30000'}} onClick={()=>setShowAddNotification(true)}>
                    <FiPlus className="icon" /> Thêm Thông báo
                  </button>
              </div>
              </div>
              {/* Modal Thêm Thông báo */}
              {showAddNotification && (
                <div className="modal">
                  <div className="modal-content">
                    <h3 style={{color:'#b30000'}}><FiPlus className="icon"/>Thêm Thông báo mới</h3>
                    <form onSubmit={e=>{
                      e.preventDefault();
                      setNotifications(prev=>[
                        {
                          id: Date.now(),
                          title: notificationForm.title,
                          content: notificationForm.content,
                          target: notificationForm.target,
                          type: notificationForm.type,
                          method: notificationForm.method,
                          date: new Date().toLocaleDateString('vi-VN'),
                        },
                        ...prev
                      ]);
                      setShowAddNotification(false);
                      setNotificationForm({title:'',content:'',target:'',type:'',method:'Web'});
                    }}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Tiêu đề</label>
                        <input type="text" required value={notificationForm.title} onChange={e=>setNotificationForm(f=>({...f,title:e.target.value}))} style={{flex:1,minWidth:0}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:90,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap',marginTop:'0.3rem'}}>Nội dung</label>
                        <textarea required value={notificationForm.content} onChange={e=>setNotificationForm(f=>({...f,content:e.target.value}))} style={{flex:1,minWidth:0,minHeight:80}}/>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:110,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Đối tượng nhận</label>
                        <select required value={notificationForm.target} onChange={e=>setNotificationForm(f=>({...f,target:e.target.value}))} style={{flex:1,minWidth:0}}>
                          <option value="">Chọn đối tượng</option>
                          <option value="Học sinh">Học sinh</option>
                          <option value="Phụ huynh">Phụ huynh</option>
                          <option value="Giáo viên">Giáo viên</option>
                          <option value="Tất cả">Tất cả</option>
                        </select>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:110,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Loại thông báo</label>
                        <select required value={notificationForm.type} onChange={e=>setNotificationForm(f=>({...f,type:e.target.value}))} style={{flex:1,minWidth:0}}>
                          <option value="">Chọn loại</option>
                          <option value="general">General</option>
                          <option value="event">Event</option>
                          <option value="payment reminder">Payment Reminder</option>
                          <option value="class absence">Class Absence</option>
                        </select>
                      </div>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:110,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Phương thức gửi</label>
                        <div className="radio-group radio-group-horizontal" style={{flex:1,minWidth:0}}>
                          <label><input type="radio" name="method" value="Web" checked={notificationForm.method==='Web'} onChange={e=>setNotificationForm(f=>({...f,method:e.target.value}))}/>Web</label>
                          <label><input type="radio" name="method" value="Email" checked={notificationForm.method==='Email'} onChange={e=>setNotificationForm(f=>({...f,method:e.target.value}))}/>Email</label>
                          <label><input type="radio" name="method" value="Both" checked={notificationForm.method==='Both'} onChange={e=>setNotificationForm(f=>({...f,method:e.target.value}))}/>Cả hai</label>
                        </div>
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn btn-primary" style={{background:'#b30000'}}>Gửi thông báo</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>setShowAddNotification(false)}>Hủy</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Danh sách thông báo */}
              <div className="card-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1.5rem',
                marginTop: '0.5rem',
                alignItems: 'stretch',
                justifyItems: 'center',
              }}>
                {notifications.length === 0 ? (
                  <div style={{textAlign:'center',color:'#b30000',padding:'2rem'}}>Chưa có thông báo nào.</div>
                ) : paginatedNotifications.map(noti => (
                  <div key={noti.id} className="card notifications-card" style={{border:'1.5px solid #b30000', background:'#fff5f5', borderRadius:'1.1rem', position:'relative', boxShadow:'0 2px 12px rgba(179,0,0,0.07)', padding:'1.5rem 1.2rem 1.2rem 1.2rem', margin:'0 auto', maxWidth:440, minWidth:260, display:'flex', flexDirection:'column', gap:'0.7rem', transition:'box-shadow 0.2s, transform 0.2s'}}>
                    <div style={{display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.2rem'}}>
                      <div style={{background:'#b30000',color:'#fff',borderRadius:'50%',width:38,height:38,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',boxShadow:'0 2px 8px #b3000022'}}>
                        <MdNotifications/>
                      </div>
                      <h4 style={{color:'#b30000', fontWeight:700, fontSize:'1.13rem', margin:0, lineHeight:1.3, flex:1, wordBreak:'break-word'}}>{noti.title}</h4>
                      <button onClick={()=>setNotifications(list=>list.filter(n=>n.id!==noti.id))} title="Xóa" className="noti-delete-btn" style={{background:'#ffeaea',color:'#b30000',border:'1px solid #b30000',borderRadius:8,padding:'0.3rem 0.7rem',fontWeight:700,cursor:'pointer',fontSize:'1.1rem',transition:'background 0.15s, color 0.15s',marginLeft:'0.5rem'}}><FiTrash2/></button>
                    </div>
                    <div className="noti-content" style={{color:'#333', fontSize:'1.01rem', marginBottom:'0.2rem', lineHeight:1.5, paddingLeft:46}}>{noti.content}</div>
                    <div className="noti-meta" style={{display:'flex',gap:'0.6rem',flexWrap:'wrap',marginBottom:'0.2rem',paddingLeft:46}}>
                      <span className="noti-badge" style={{background:'#ffeaea',color:'#b30000',border:'1.5px solid #b30000',fontWeight:600,borderRadius:18,fontSize:'0.93rem',padding:'0.22rem 1.1rem',letterSpacing:'0.01em'}}>{noti.target}</span>
                      <span className="noti-badge type" style={{background:'#fef3c7',color:'#92400e',border:'1.5px solid #f59e42',fontWeight:600,borderRadius:18,fontSize:'0.93rem',padding:'0.22rem 1.1rem',letterSpacing:'0.01em'}}>{noti.type}</span>
                      <span className="noti-badge method" style={{background:'#f3f4f6',color:'#b30000',border:'1.5px solid #b30000',fontWeight:600,borderRadius:18,fontSize:'0.93rem',padding:'0.22rem 1.1rem',letterSpacing:'0.01em'}}>{noti.method}</span>
                    </div>
                    <div className="noti-date" style={{fontSize:'0.97rem', color:'#b30000', fontWeight:500, display:'flex', alignItems:'center', gap:'0.3rem',paddingLeft:46}}><i className="fas fa-calendar-alt" style={{marginRight:4}}></i> {noti.date}</div>
                  </div>
                ))}
              </div>

              {/* Pagination for Notifications */}
              {!loading && notifications.length > 0 && notificationsPagination.totalPages > 1 && (
                <Pagination 
                  currentPage={notificationsPagination.currentPage}
                  totalPages={notificationsPagination.totalPages}
                  totalItems={notificationsPagination.totalNotifications}
                  limit={notificationsPagination.limit}
                  onPageChange={(newPage) => setNotificationsPagination(prev => ({ ...prev, currentPage: newPage }))}
                  loading={loading}
                  itemName="thông báo"
                />
              )}
            </section>
          )}
          {activeTab === 'advertisements' && (
            <section>
              <div className="section-header" style={{justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                <h2 className="section-title">
                  <MdCampaign className="icon" />
                  Quản lý Quảng cáo
                </h2>
                <button className="btn btn-primary" style={{background:'#b30000'}} onClick={handleAddAdvertisement}>
                  <FiPlus className="icon" />
                  Thêm quảng cáo
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{width: '20%'}}>Tiêu đề</th>
                      <th style={{width: '15%'}}>Ngày bắt đầu</th>
                      <th style={{width: '15%'}}>Ngày kết thúc</th>
                      <th style={{width: '15%'}}>Trạng thái</th>
                      <th style={{width: '14%'}}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisements.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign:'center',padding:'2rem',color:'#b30000'}}>Chưa có quảng cáo nào</td></tr>
                    ) : paginatedAdvertisements.map(ad => (
                      <tr key={ad.id} style={{cursor:'pointer'}} onClick={e=>handleAdRowClick(ad, e)}>
                        <td style={{fontWeight:600,color:'#b30000'}}>{ad.title}</td>
                        <td>{new Date(ad.startDate).toLocaleDateString('vi-VN')}</td>
                        <td>{new Date(ad.endDate).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`status-badge ${ad.status === 'Hoạt động' ? 'success' : 'warning'}`}
                            style={{
                              backgroundColor: ad.status === 'Hoạt động' ? '#dcfce7' : '#ffeaea',
                              color: ad.status === 'Hoạt động' ? '#166534' : '#b30000',
                              border: ad.status === 'Hoạt động' ? '1px solid #16a34a' : '1px solid #b30000',
                              fontWeight: 600
                            }}
                          >
                            {ad.status}
                          </span>
                        </td>
                        <td style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
                          <button className="btn btn-secondary" style={{background:'#fff',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600}}
                            onClick={() => handleEditAdvertisement(ad)}
                          >Sửa</button>
                          <button className="btn btn-secondary" style={{background:'#fff',color:'#92400e',border:'1px solid #92400e',borderRadius:8,fontWeight:600}}
                            onClick={() => handleToggleAdvertisementStatus(ad.id)}
                          >
                            {ad.status === 'Hoạt động' ? 'Ngừng' : 'Kích hoạt'}
                          </button>
                          <button className="btn btn-danger" style={{background:'#ffeaea',color:'#b30000',border:'1px solid #b30000',borderRadius:8,fontWeight:600}}
                            onClick={() => handleDeleteAdvertisement(ad.id)}
                          >Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Advertisements */}
              {!loading && advertisements.length > 0 && advertisementsPagination.totalPages > 1 && (
                <Pagination 
                  currentPage={advertisementsPagination.currentPage}
                  totalPages={advertisementsPagination.totalPages}
                  totalItems={advertisementsPagination.totalAdvertisements}
                  limit={advertisementsPagination.limit}
                  onPageChange={(newPage) => setAdvertisementsPagination(prev => ({ ...prev, currentPage: newPage }))}
                  loading={loading}
                  itemName="quảng cáo"
                />
              )}

              {/* Modal thêm/sửa quảng cáo */}
              {(showAddAdvertisement || showEditAdvertisement) && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:600}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem'}}>
                      <MdCampaign className="icon" />
                      {editingAdvertisement ? 'Sửa quảng cáo' : 'Thêm quảng cáo mới'}
                    </h3>
                    <form onSubmit={handleAdvertisementSubmit}>
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:120,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Tiêu đề</label>
                        <input 
                          type="text" 
                          required 
                          value={advertisementForm.title} 
                          onChange={e=>setAdvertisementForm(prev=>({...prev,title:e.target.value}))} 
                          style={{flex:1,minWidth:0,padding:'0.5rem',borderRadius:6,border:'1px solid #ddd'}}
                        />
                      </div>
                      
                      <div className="form-group" style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:120,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap',marginTop:'0.3rem'}}>Nội dung</label>
                        <textarea 
                          required 
                          value={advertisementForm.content} 
                          onChange={e=>setAdvertisementForm(prev=>({...prev,content:e.target.value}))} 
                          style={{flex:1,minWidth:0,minHeight:100,padding:'0.5rem',borderRadius:6,border:'1px solid #ddd'}}
                          placeholder="Nhập nội dung quảng cáo..."
                        />
                      </div>
                      
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:120,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Ngày bắt đầu</label>
                        <input 
                          type="date" 
                          required 
                          value={advertisementForm.startDate} 
                          onChange={e=>setAdvertisementForm(prev=>({...prev,startDate:e.target.value}))} 
                          style={{flex:1,minWidth:0,padding:'0.5rem',borderRadius:6,border:'1px solid #ddd'}}
                        />
                      </div>
                      
                      <div className="form-group" style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:120,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap'}}>Ngày kết thúc</label>
                        <input 
                          type="date" 
                          required 
                          value={advertisementForm.endDate} 
                          onChange={e=>setAdvertisementForm(prev=>({...prev,endDate:e.target.value}))} 
                          style={{flex:1,minWidth:0,padding:'0.5rem',borderRadius:6,border:'1px solid #ddd'}}
                        />
                      </div>
                      
                      <div className="form-group" style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1.1rem'}}>
                        <label style={{minWidth:120,margin:0,color:'#b30000',fontWeight:600,fontSize:'1rem',whiteSpace:'nowrap',marginTop:'0.3rem'}}>Ảnh quảng cáo</label>
                        <div style={{flex:1,minWidth:0}}>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{padding:'0.5rem',borderRadius:6,border:'1px solid #ddd',width:'100%'}}
                          />
                          <small style={{color:'#666',fontSize:'0.875rem'}}>Có thể chọn nhiều ảnh</small>
                          
                          {advertisementForm.images.length > 0 && (
                            <div style={{marginTop:'1rem',display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))',gap:'0.5rem'}}>
                              {advertisementForm.images.map((image, index) => (
                                <div key={index} style={{position:'relative',borderRadius:8,overflow:'hidden',border:'2px solid #b30000'}}>
                                  <img 
                                    src={image} 
                                    alt={`Ảnh ${index + 1}`} 
                                    style={{width:'100%',height:100,objectFit:'cover'}}
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                      position:'absolute',
                                      top:4,
                                      right:4,
                                      background:'#b30000',
                                      color:'white',
                                      border:'none',
                                      borderRadius:'50%',
                                      width:24,
                                      height:24,
                                      cursor:'pointer',
                                      fontSize:'0.75rem'
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="form-actions" style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => {
                            setShowAddAdvertisement(false);
                            setShowEditAdvertisement(false);
                            setEditingAdvertisement(null);
                          }}
                        >
                          Hủy
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary" 
                          style={{background:'#b30000'}}
                        >
                          {editingAdvertisement ? 'Cập nhật' : 'Thêm quảng cáo'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              {/* Modal chi tiết quảng cáo */}
              {showDetailAdvertisement && detailAdvertisement && (
                <div className="modal">
                  <div className="modal-content" style={{maxWidth:700}}>
                    <h3 style={{color:'#b30000',marginBottom:'1.2rem',display:'flex',alignItems:'center',gap:8}}>
                      <MdCampaign style={{fontSize:'1.5rem'}}/> Chi tiết quảng cáo
                    </h3>
                    <div style={{marginBottom:'1.5rem'}}>
                      <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,background:'#fff5f5',borderRadius:12,overflow:'hidden',boxShadow:'0 2px 8px #b3000022'}}>
                        <tbody>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000',width:'25%',borderBottom:'1px solid #ffeaea'}}>Tiêu đề</td>
                            <td style={{padding:'0.8rem',textAlign:'left',fontWeight:500,borderBottom:'1px solid #ffeaea'}}>{detailAdvertisement.title}</td>
                          </tr>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Nội dung</td>
                            <td style={{padding:'0.8rem',textAlign:'left',borderBottom:'1px solid #ffeaea',whiteSpace:'pre-wrap',lineHeight:1.5}}>{detailAdvertisement.content}</td>
                          </tr>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Ngày bắt đầu</td>
                            <td style={{padding:'0.8rem',textAlign:'left',borderBottom:'1px solid #ffeaea'}}>{new Date(detailAdvertisement.startDate).toLocaleDateString('vi-VN')}</td>
                          </tr>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Ngày kết thúc</td>
                            <td style={{padding:'0.8rem',textAlign:'left',borderBottom:'1px solid #ffeaea'}}>{new Date(detailAdvertisement.endDate).toLocaleDateString('vi-VN')}</td>
                          </tr>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000',borderBottom:'1px solid #ffeaea'}}>Trạng thái</td>
                            <td style={{padding:'0.8rem',textAlign:'left',borderBottom:'1px solid #ffeaea'}}>
                              <span className={`status-badge ${detailAdvertisement.status === 'Hoạt động' ? 'success' : 'warning'}`}
                                style={{
                                  backgroundColor: detailAdvertisement.status === 'Hoạt động' ? '#dcfce7' : '#ffeaea',
                                  color: detailAdvertisement.status === 'Hoạt động' ? '#166534' : '#b30000',
                                  border: detailAdvertisement.status === 'Hoạt động' ? '1px solid #16a34a' : '1px solid #b30000',
                                  fontWeight: 600,
                                  padding: '0.3rem 0.8rem',
                                  borderRadius: 6
                                }}
                              >
                                {detailAdvertisement.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style={{padding:'0.8rem',fontWeight:600,color:'#b30000'}}>Ảnh quảng cáo</td>
                            <td style={{padding:'0.8rem',textAlign:'left'}}>
                              {detailAdvertisement.images && detailAdvertisement.images.length > 0 ? (
                                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',gap:'1rem'}}>
                                  {detailAdvertisement.images.map((image, index) => (
                                    <div key={index} style={{borderRadius:8,overflow:'hidden',border:'2px solid #b30000',boxShadow:'0 2px 8px rgba(179,0,0,0.2)'}}>
                                      <img 
                                        src={image} 
                                        alt={`Ảnh quảng cáo ${index + 1}`} 
                                        style={{width:'100%',height:150,objectFit:'cover'}}
                                      />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span style={{color:'#666',fontStyle:'italic'}}>Chưa có ảnh</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="form-actions" style={{display:'flex',justifyContent:'center',gap:'1rem'}}>
                      <button
                        className="btn btn-secondary"
                        style={{
                          background: '#fff',
                          color: '#b30000',
                          border: '1px solid #b30000',
                          minWidth: 90,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: '0.5rem 1.2rem'
                        }}
                        onClick={() => {
                          setEditingAdvertisement(detailAdvertisement);
                          setAdvertisementForm({
                            title: detailAdvertisement.title,
                            content: detailAdvertisement.content,
                            startDate: detailAdvertisement.startDate,
                            endDate: detailAdvertisement.endDate,
                            images: [...detailAdvertisement.images]
                          });
                          setShowEditAdvertisement(true);
                          setShowDetailAdvertisement(false);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{
                          minWidth: 90,
                          fontWeight: 600,
                          borderRadius: 8,
                          padding: '0.5rem 1.2rem'
                        }}
                        onClick={() => setShowDetailAdvertisement(false)}
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Teacher Selection Modal */}
      {showTeacherSelect && selectedClassForAssignment && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiUser className="icon" />
              Phân công giáo viên cho lớp: {selectedClassForAssignment.className}
            </h3>
            
            {loading && (
              <div className="loading-message" style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#4a5568'
              }}>
                Đang tải danh sách giáo viên...
              </div>
            )}

            {!loading && (
              <div className="teacher-list">
                {availableTeachers.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Không có giáo viên khả dụng để phân công
                  </div>
                ) : (
                  <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {availableTeachers.map(teacher => (
                      <div key={teacher._id} className="card" style={{ cursor: 'pointer' }}>
                        <div className="card-content">
                          <h4>{teacher.userId?.name || 'Chưa có tên'}</h4>
                          <p><strong>Email:</strong> {teacher.userId?.email || 'Chưa có email'}</p>
                          <p><strong>Chuyên môn:</strong> {teacher.specialization || 'Chưa có thông tin'}</p>
                          <p><strong>Kinh nghiệm:</strong> {teacher.experience || 0} năm</p>
                          <p><strong>Lớp hiện tại:</strong> {teacher.currentClasses?.length || 0} lớp</p>
                        </div>
                        <div className="card-actions" style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleAssignTeacher(selectedClassForAssignment.id, teacher._id)}
                            disabled={loading}
                          >
                            <FiUser className="icon" />
                            Phân công
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowTeacherSelect(false)
                  setSelectedClassForAssignment(null)
                }}
              >
                <FiX className="icon" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Selection Modal */}
      {showStudentSelect && selectedClassForAssignment && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiUsers className="icon" />
              Thêm học sinh vào lớp: {selectedClassForAssignment.className}
            </h3>
            
            {loading && (
              <div className="loading-message" style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#4a5568'
              }}>
                Đang tải danh sách học sinh...
              </div>
            )}

            {!loading && (
              <div className="student-list">
                {availableStudents.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    Không có học sinh khả dụng để thêm vào lớp
                  </div>
                ) : (
                  <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {availableStudents.map(student => (
                      <div key={student._id} className="card" style={{ cursor: 'pointer' }}>
                        <div className="card-content">
                          <h4>{student.userId?.name || 'Chưa có tên'}</h4>
                          <p><strong>Email:</strong> {student.userId?.email || 'Chưa có email'}</p>
                          <p><strong>Số điện thoại:</strong> {student.userId?.phoneNumber || 'Chưa có số điện thoại'}</p>
                          <p><strong>Lớp hiện tại:</strong> {student.currentClasses?.length || 0} lớp</p>
                          <p><strong>Phụ huynh:</strong> {student.parentId?.name || 'Chưa có thông tin'}</p>
                        </div>
                        <div className="card-actions" style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEnrollStudent(selectedClassForAssignment.id, student._id)}
                            disabled={loading}
                          >
                            <FiUsers className="icon" />
                            Thêm vào lớp
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowStudentSelect(false)
                  setSelectedClassForAssignment(null)
                }}
              >
                <FiX className="icon" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AdminDashboard 