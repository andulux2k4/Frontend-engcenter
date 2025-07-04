import React, { useState, useEffect } from "react";
import "../Dashboard.css";
import "../../styles/dashboard/admin.css";
import { FiUser, FiLogOut, FiMenu, FiUsers } from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import { MdNotifications, MdCampaign, MdPayment } from "react-icons/md";
import apiService from "../../services/api";
import Overview from "./components/Overview";
import UserManagement from "./components/UserManagement";
import ClassManagement from "./components/ClassManagement";
import TuitionManagement from "./components/TuitionManagement";
import SalaryManagement from "./components/SalaryManagement";
import NotificationsManagement from "./components/NotificationsManagement";
import AdvertisementsManagement from "./components/AdvertisementsManagement";
import TeacherSelectionModal from "./components/modals/TeacherSelectionModal";
import StudentSelectionModal from "./components/modals/StudentSelectionModal";
import UserDetailModal from "./components/modals/UserDetailModal";
import ClassFormModal from "./components/modals/ClassFormModal";
import UserFormModal from "./components/modals/UserFormModal";
import ClassDetailModal from "./components/modals/ClassDetailModal";

function AdminDashboard({ user, onLogout }) {
  console.log("🏢 AdminDashboard rendered with user:", user);

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassData, setEditClassData] = useState(null);

  // User detail modal states
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  // const [showAddStudent, setShowAddStudent] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwordBeforeHash: "",
    phone: "",
    role: "Student",
    gender: "",
    address: "",
    parentId: "",
    classIds: [],
    studentIds: [],
    canViewTeacher: false,
    wagePerLesson: 100000, // Thêm trường lương/buổi cho giáo viên
  });
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    name: "",
    year: new Date().getFullYear(),
    grade: "",
    startDate: "",
    endDate: "",
    feePerLesson: "",
    teacherId: "",
    daysOfLessonInWeek: [],
  });

  // Real data states
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });

  // User filters and search
  const [userFilters, setUserFilters] = useState({
    email: "",
    name: "",
    role: "",
    isActive: "",
    sort: "",
  });

  // Class filters and search
  const [classFilters, setClassFilters] = useState({
    summary: "true",
    year: "",
    grade: "",
    isAvailable: "",
    teacherId: "",
    sort: "",
  });
  const [classPagination, setClassPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalClasses: 0,
    limit: 10,
  });

  // Teachers for filter dropdown
  const [allTeachers, setAllTeachers] = useState([]);

  // New states for available teachers and students
  const [availableTeachers, setAvailableTeachers] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [showTeacherSelect, setShowTeacherSelect] = useState(false);
  const [showStudentSelect, setShowStudentSelect] = useState(false);
  const [selectedClassForAssignment, setSelectedClassForAssignment] =
    useState(null);

  // States for conditional form fields
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [formKey, setFormKey] = useState(0); // Force form re-render

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "classes") {
      loadClasses();
      loadAllTeachers(); // Load teachers for filter dropdown
    } else {
      // Clear error when switching away from data tabs
      setError("");
    }
  }, [
    activeTab,
    pagination.currentPage,
    selectedRole,
    userFilters,
    classPagination.currentPage,
    classFilters,
  ]);

  const loadUsers = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const filters = {};

      // Combine selectedRole with userFilters
      if (selectedRole !== "all") {
        filters.role =
          selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
      } else if (userFilters.role) {
        filters.role = userFilters.role;
      }

      // Add search and filter parameters
      if (userFilters.email.trim()) {
        filters.email = userFilters.email.trim();
      }
      if (userFilters.name.trim()) {
        filters.name = userFilters.name.trim();
      }
      if (userFilters.isActive !== "") {
        filters.isActive = userFilters.isActive;
      }
      if (userFilters.sort) {
        filters.sort = userFilters.sort;
      }

      const response = await apiService.getUsers(
        user.token,
        pagination.currentPage,
        pagination.limit,
        filters
      );

      // Backend returns: {msg, data, pagination} instead of {success, users, pagination}
      if (response.data && Array.isArray(response.data)) {
        console.log("📋 Raw user data from API:", response.data[0]); // Log first user to see structure

        // Map the API response to match the UI structure
        const mappedUsers = response.data.map((user) => {
          // Xác định roleId dựa trên vai trò người dùng
          let roleId = null;

          // Nếu API trả về trường roleId rõ ràng, ưu tiên sử dụng trước
          if (user.roleId) {
            roleId = user.roleId;
          }
          // Nếu không có roleId, xác định dựa trên vai trò
          else if (user.role) {
            if (user.role.toLowerCase() === "teacher") {
              // Nếu là giáo viên, tìm kiếm trong dữ liệu teacherId
              if (user.teacherId) {
                if (typeof user.teacherId === "object") {
                  roleId = user.teacherId._id;
                } else {
                  roleId = user.teacherId;
                }
              }
            } else if (user.role.toLowerCase() === "student") {
              // Nếu là học sinh, tìm kiếm trong dữ liệu studentId
              if (user.studentId) {
                if (typeof user.studentId === "object") {
                  roleId = user.studentId._id;
                } else {
                  roleId = user.studentId;
                }
              }
            } else if (user.role.toLowerCase() === "parent") {
              // Nếu là phụ huynh, tìm kiếm trong dữ liệu parentId
              if (user.parentId) {
                if (typeof user.parentId === "object") {
                  roleId = user.parentId._id;
                } else {
                  roleId = user.parentId;
                }
              }
            }
          }

          // Nếu vẫn chưa có roleId, đánh dấu là null - không sử dụng ID chính làm fallback nữa
          // vì điều này có thể gây ra lỗi khi gọi API

          console.log(
            `User ${user.name || user.userId?.name} (${
              user.role
            }) has roleId: ${roleId || "NOT_FOUND"}`
          );

          return {
            id: user._id || user.id,
            roleId: roleId, // Có thể null
            name: user.name || user.userId?.name || "Chưa có tên",
            email: user.email || user.userId?.email || "Chưa có email",
            phone:
              user.phoneNumber ||
              user.phone ||
              user.userId?.phoneNumber ||
              "Chưa có",
            role: (user.role || "unknown").toLowerCase(),
            status: user.isActive ? "Đang hoạt động" : "Ngừng hoạt động",
            gender: user.gender || "",
            address: user.address || "",
            // Role-specific data theo model
            parentId: user.parentId || null,
            classId: user.classId || [], // Teacher/Student có classId array
            childId: user.childId || [], // Parent có childId array
            canSeeTeacher: user.canSeeTeacher || false, // Parent có canSeeTeacher
            wagePerLesson: user.wagePerLesson || 0, // Teacher có wagePerLesson
          };
        });

        console.log("🔄 Mapped user data:", mappedUsers[0]); // Log mapped data

        setUsers(mappedUsers);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: response.pagination.totalPages || 1,
            totalUsers: response.pagination.totalItems || response.data.length,
          }));
        }
      } else {
        setError(response.msg || "Không thể tải danh sách người dùng");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const filters = {};

      // Set summary parameter - mặc định lấy thông tin cơ bản cho list view
      if (classFilters.summary !== "") {
        filters.summary = classFilters.summary;
      } else {
        filters.summary = "true"; // Default value for list view
      }

      // Add search and filter parameters
      if (classFilters.year) {
        filters.year = classFilters.year;
      }
      if (classFilters.grade) {
        filters.grade = classFilters.grade;
      }
      if (classFilters.isAvailable !== "") {
        filters.isAvailable = classFilters.isAvailable;
      }
      if (classFilters.teacherId) {
        filters.teacherId = classFilters.teacherId;
      }
      if (classFilters.sort) {
        filters.sort = classFilters.sort;
      }

      const response = await apiService.getClasses(
        user.token,
        classPagination.currentPage,
        classPagination.limit,
        filters
      );

      // Backend returns: {msg, data, pagination} instead of {success, classes}
      if (response.data && Array.isArray(response.data)) {
        // Map the API response to match the UI structure
        const mappedClasses = response.data.map((cls) => ({
          id: cls._id || cls.id,
          className: cls.className || cls.name || "Chưa có tên lớp",
          year: cls.year || new Date().getFullYear(),
          grade: cls.grade || 1,
          isAvailable: cls.isAvailable !== false,
          status: cls.isAvailable ? "Đang học" : "Đã kết thúc",
          teacherName:
            cls.teacherId?.name ||
            cls.teacherId?.userId?.name ||
            "Chưa phân công",
          teacherEmail:
            cls.teacherId?.email || cls.teacherId?.userId?.email || "",
          currentStudents: cls.studentList?.length || 0,
          maxStudents: cls.maxStudents || 20,
          feePerLesson: cls.feePerLesson || 0,
          schedule: cls.schedule || {},
          studentList: cls.studentList || [],
        }));

        setClasses(mappedClasses);

        // Update pagination for classes
        if (response.pagination) {
          setClassPagination((prev) => ({
            ...prev,
            totalPages: response.pagination.totalPages || 1,
            totalClasses:
              response.pagination.totalItems || response.data.length,
          }));
        }
      } else {
        setError(response.msg || "Không thể tải danh sách lớp học");
      }
    } catch (error) {
      console.error("Error loading classes:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load all teachers for filter dropdown
  const loadAllTeachers = async () => {
    if (!user?.token) return;

    try {
      const response = await apiService.getTeachers(user.token, 1, 100, {});
      if (response.data && Array.isArray(response.data)) {
        const mappedTeachers = response.data.map((teacher) => ({
          id: teacher._id || teacher.id,
          roleId: teacher._id || teacher.id,
          name: teacher.name || teacher.userId?.name || "Chưa có tên",
        }));
        setAllTeachers(mappedTeachers);
      }
    } catch (error) {
      console.error("Error loading teachers for filter:", error);
    }
  };

  // Load available teachers for class assignment
  const loadAvailableTeachers = async (excludeClassId = null) => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiService.getAvailableTeachers(
        user.token,
        excludeClassId
      );

      // Backend returns: {msg, data} instead of {success, teachers}
      if (response.data && Array.isArray(response.data)) {
        const mappedTeachers = response.data.map((teacher) => ({
          _id: teacher._id || teacher.id,
          userId: {
            name: teacher.name || teacher.userId?.name || "Chưa có tên",
            email: teacher.email || teacher.userId?.email || "Chưa có email",
            phoneNumber:
              teacher.phoneNumber ||
              teacher.phone ||
              teacher.userId?.phoneNumber ||
              "",
          },
          specialization: teacher.specialization || "Chưa có chuyên môn",
          experience: teacher.experience || 0,
          currentClasses: teacher.currentClasses || [],
        }));
        setAvailableTeachers(mappedTeachers);
      } else {
        setError(response.msg || "Không thể tải danh sách giáo viên khả dụng");
      }
    } catch (error) {
      console.error("Error loading available teachers:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load available students for class assignment
  const loadAvailableStudents = async (excludeClassId = null) => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiService.getAvailableStudents(
        user.token,
        excludeClassId
      );

      // Backend returns: {msg, data} instead of {success, students}
      if (response.data && Array.isArray(response.data)) {
        const mappedStudents = response.data.map((student) => ({
          _id: student._id || student.id,
          userId: {
            name: student.name || student.userId?.name || "Chưa có tên",
            email: student.email || student.userId?.email || "Chưa có email",
            phoneNumber:
              student.phoneNumber ||
              student.phone ||
              student.userId?.phoneNumber ||
              "",
          },
          currentClasses: student.currentClasses || [],
          parentId: student.parentId || null,
        }));
        setAvailableStudents(mappedStudents);
      } else {
        setError(response.msg || "Không thể tải danh sách học sinh khả dụng");
      }
    } catch (error) {
      console.error("Error loading available students:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle teacher assignment to class
  const handleAssignTeacher = async (classId, teacherId) => {
    if (!user?.token) return;

    setLoading(true);

    try {
      const response = await apiService.updateClass(user.token, classId, {
        teacherId: teacherId,
      });

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        // Reload classes list
        loadClasses();
        setShowTeacherSelect(false);
        setSelectedClassForAssignment(null);
      } else {
        setError(response.msg || "Không thể phân công giáo viên");
      }
    } catch (error) {
      console.error("Error assigning teacher:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle student enrollment to class
  const handleEnrollStudent = async (
    classId,
    studentId,
    discountPercentage = 0
  ) => {
    if (!user?.token) return;

    setLoading(true);

    try {
      const response = await apiService.enrollStudent(user.token, studentId, {
        classId: classId,
        discountPercentage: discountPercentage,
      });

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        // Reload classes list
        loadClasses();
        setShowStudentSelect(false);
        setSelectedClassForAssignment(null);
      } else {
        setError(response.msg || "Không thể thêm học sinh vào lớp");
      }
    } catch (error) {
      console.error("Error enrolling student:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const mockData = {
    stats: {
      totalStudents: 150,
      totalTeachers: 12,
      activeClasses: 15,
      revenue: "45.000.000",
    },
    users: [
      // Giáo viên mẫu
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah@tttenglish.edu.vn",
        phone: "0912345678",
        role: "teacher",
        status: "Đang hoạt động",
      },
      {
        id: 2,
        name: "John Smith",
        email: "john@tttenglish.edu.vn",
        phone: "0923456789",
        role: "teacher",
        status: "Đang hoạt động",
      },
      {
        id: 3,
        name: "Mary Wilson",
        email: "mary@tttenglish.edu.vn",
        phone: "0934567890",
        role: "teacher",
        status: "Đang hoạt động",
      },
      // Học sinh mẫu
      {
        id: 4,
        name: "Nguyễn Văn An",
        email: "student1@gmail.com",
        phone: "0945678901",
        role: "student",
        status: "Đang học",
      },
      {
        id: 5,
        name: "Trần Thị Bình",
        email: "student2@gmail.com",
        phone: "0956789012",
        role: "student",
        status: "Đang học",
      },
      {
        id: 6,
        name: "Lê Hoàng Nam",
        email: "student3@gmail.com",
        phone: "0967890123",
        role: "student",
        status: "Đang học",
      },
      {
        id: 7,
        name: "Phạm Thu Hà",
        email: "student4@gmail.com",
        phone: "0978901234",
        role: "student",
        status: "Ngừng hoạt động",
      },
      // Phụ huynh mẫu
      {
        id: 8,
        name: "Nguyễn Văn Phụ",
        email: "parent1@gmail.com",
        phone: "0989012345",
        role: "parent",
        status: "Đang hoạt động",
      },
      {
        id: 9,
        name: "Trần Văn Huynh",
        email: "parent2@gmail.com",
        phone: "0990123456",
        role: "parent",
        status: "Đang hoạt động",
      },
      {
        id: 10,
        name: "Lê Thị Mai",
        email: "parent3@gmail.com",
        phone: "0901234567",
        role: "parent",
        status: "Đang hoạt động",
      },
    ],
    classes: [
      {
        id: 1,
        name: "IELTS Advanced",
        teacher: "Sarah Johnson",
        teacherInfo: {
          email: "sarah@tttenglish.edu.vn",
          phone: "0912345678",
          experience: "5 năm",
          specialty: "IELTS",
        },
        maxStudents: 20,
        currentStudents: 15,
        students: [
          {
            id: 1,
            name: "Nguyễn Văn An",
            attendance: "90%",
            progress: "Tốt",
            lastAttendance: "18/03/2024",
          },
          {
            id: 2,
            name: "Trần Thị Bình",
            attendance: "85%",
            progress: "Khá",
            lastAttendance: "18/03/2024",
          },
          {
            id: 3,
            name: "Lê Hoàng Nam",
            attendance: "95%",
            progress: "Xuất sắc",
            lastAttendance: "18/03/2024",
          },
        ],
        schedule: "Thứ 2,4,6 - 18:00-20:00",
        room: "Phòng 101",
        status: "Đang học",
        startDate: "01/03/2024",
        endDate: "30/06/2024",
        courseFee: "15.000.000",
        description: "Khóa học IELTS nâng cao, mục tiêu band điểm 7.0+",
        materials: [
          "Oxford IELTS Preparation",
          "Cambridge IELTS 15-16-17",
          "Tài liệu bổ trợ từ giáo viên",
        ],
        nextLesson: {
          date: "20/03/2024",
          topic: "Academic Writing Task 2",
          preparation: "Ôn tập các dạng essay thường gặp",
        },
      },
      {
        id: 2,
        name: "TOEIC Preparation",
        teacher: "John Smith",
        teacherInfo: {
          email: "john@tttenglish.edu.vn",
          phone: "0923456789",
          experience: "3 năm",
          specialty: "TOEIC",
        },
        maxStudents: 15,
        currentStudents: 12,
        students: [
          {
            id: 4,
            name: "Phạm Thu Hà",
            attendance: "88%",
            progress: "Khá",
            lastAttendance: "19/03/2024",
          },
          {
            id: 5,
            name: "Đỗ Văn Minh",
            attendance: "92%",
            progress: "Tốt",
            lastAttendance: "19/03/2024",
          },
        ],
        schedule: "Thứ 3,5 - 17:30-19:30",
        room: "Phòng 203",
        status: "Đang học",
        startDate: "15/03/2024",
        endDate: "15/06/2024",
        courseFee: "12.000.000",
        description: "Khóa học TOEIC từ 500 đến 750+",
        materials: [
          "ETS TOEIC 2023",
          "TOEIC Practice Tests",
          "Tài liệu bổ trợ từ giáo viên",
        ],
        nextLesson: {
          date: "21/03/2024",
          topic: "Part 7: Reading Comprehension",
          preparation: "Làm bài tập Reading Practice Test 05",
        },
      },
    ],
    payments: [
      {
        id: 1,
        student: "Alice Brown",
        amount: "5.000.000",
        date: "15/03/2024",
        course: "IELTS Advanced",
        status: "Đã thanh toán",
      },
      {
        id: 2,
        student: "Bob Wilson",
        amount: "5.000.000",
        date: "14/03/2024",
        course: "TOEIC Preparation",
        status: "Chưa thanh toán",
      },
    ],
  };

  const filteredUsers = users; // Users are already filtered by the API call

  // Helper function to reset form data
  const resetFormData = () => {
    setFormData({
      name: "",
      email: "",
      passwordBeforeHash: "",
      phone: "",
      role: "Student",
      gender: "",
      address: "",
      parentId: "",
      classIds: [],
      studentIds: [],
      canViewTeacher: false,
      wagePerLesson: 100000, // Thêm trường lương/buổi cho giáo viên
    });
  };

  const handleAddUser = () => {
    resetFormData();
    setEditingUser(null);
    setError(""); // Clear any previous errors
    setFormKey((prev) => prev + 1); // Force form re-render
    setShowAddUserForm(true);
  };

  // Handle viewing user details
  const handleViewUserDetail = async (userSummary) => {
    if (!user?.token) return;

    console.log("🔍 Viewing user detail for user:", userSummary);
    setShowUserDetail(true);
    setUserDetailLoading(true);
    setSelectedUserDetail(null);
    setError("");

    try {
      // Lấy đúng roleId - đây là ID của bản ghi trong bảng tương ứng với role
      const roleId = userSummary.roleId;
      // User ID - là ID trong bảng users
      const userId = userSummary.id;

      console.log(
        `🔍 Role: ${userSummary.role}, UserID: ${userId}, RoleID: ${roleId}`
      );

      // Xác định nên sử dụng API endpoint nào
      let useRoleSpecificEndpoint = false;

      if (roleId) {
        // Chỉ sử dụng role-specific endpoint khi có roleId
        useRoleSpecificEndpoint = true;
      } else {
        console.warn(
          "⚠️ Missing roleId for user, will use general user endpoint"
        );
      }

      // Gọi API để lấy thông tin chi tiết của user
      const response = await apiService.getUserById(
        user.token,
        userId,
        useRoleSpecificEndpoint ? userSummary.role : null,
        roleId // Truyền roleId nếu có
      );

      if (response.success && response.data) {
        console.log("✅ User detail loaded successfully:", response.data);
        // Đảm bảo role được truyền đúng từ userSummary vào selectedUserDetail
        const userDetailWithRole = {
          ...response.data,
          originalRole: userSummary.role, // Lưu role gốc từ userSummary
          role: response.data.role || userSummary.role, // Ưu tiên role từ API, fallback về userSummary
        };
        setSelectedUserDetail(userDetailWithRole);
      } else {
        console.error("❌ Failed to load user details:", response);
        setError(
          response.message || "Không thể tải thông tin chi tiết người dùng"
        );
        // Fallback to summary data with role preserved
        setSelectedUserDetail({
          ...userSummary,
          originalRole: userSummary.role,
          role: userSummary.role,
        });
      }
    } catch (error) {
      console.error("❌ Error loading user details:", error);
      setError("Lỗi kết nối. Đang hiển thị thông tin cơ bản.");
      // Fallback to summary data with role preserved
      setSelectedUserDetail({
        ...userSummary,
        originalRole: userSummary.role,
        role: userSummary.role,
      });
    } finally {
      setUserDetailLoading(false);
    }
  };

  // Fetch detailed user info for editing
  const handleEditUser = async (userSummary) => {
    if (!user?.token) return;

    setLoading(true);
    setEditingUser(userSummary); // Set tạm thời để hiển thị modal
    setShowAddUserForm(true);

    try {
      // Lấy đúng roleId - đây là ID của bản ghi trong bảng tương ứng với role
      const roleId = userSummary.roleId;
      // User ID - là ID trong bảng users
      const userId = userSummary.id;

      console.log(
        `🔍 Edit user - Role: ${userSummary.role}, UserID: ${userId}, RoleID: ${roleId}`
      );

      // Always use role-specific endpoint since general /users endpoint doesn't exist
      let response;
      if (roleId && userSummary.role) {
        // Use role-specific endpoint with roleId
        response = await apiService.getUserById(
          user.token,
          roleId, // Use roleId for role-specific endpoints
          userSummary.role,
          roleId
        );
      } else {
        // If no roleId, we can't get detailed info - use summary data
        console.warn(
          "⚠️ Missing roleId for user, using summary data for editing"
        );
        response = {
          success: false,
          message: "Cannot retrieve user details. Using summary data.",
          data: null,
        };
      }

      if (response.success && response.data) {
        // Cập nhật form data với thông tin chi tiết từ API
        const userData = response.data;

        console.log("🔍 Raw userData from API for editing:", userData);
        console.log("🔍 User role:", userSummary.role);

        // Extract class IDs from various possible formats
        let classIds = [];

        // Cho Teacher và Student: kiểm tra trường classId (theo model)
        if (userData.classId && Array.isArray(userData.classId)) {
          classIds = userData.classId.map((cls) => {
            return cls._id || cls.id || cls;
          });
        } else if (
          userData.currentClasses &&
          Array.isArray(userData.currentClasses)
        ) {
          // Fallback cho trường hợp API trả về currentClasses
          classIds = userData.currentClasses.map((cls) => {
            return cls._id || cls.id || cls;
          });
        } else if (userData.classIds && Array.isArray(userData.classIds)) {
          // Fallback cho trường hợp API trả về classIds
          classIds = userData.classIds;
        } else if (userData.classId && typeof userData.classId === "string") {
          // Nếu classId là string đơn
          classIds = [userData.classId];
        }

        console.log("🔍 Debug classIds extraction:", {
          classId: userData.classId,
          currentClasses: userData.currentClasses,
          classIds: userData.classIds,
          extractedClassIds: classIds,
        });

        // Extract student IDs for parent role - theo model Parent có childId (array)
        let studentIds = [];

        // Theo model Parent: trường childId chứa array các Student ID
        if (userData.childId && Array.isArray(userData.childId)) {
          studentIds = userData.childId.map((child) => {
            return (
              child._id ||
              child.id ||
              child.userId?._id ||
              child.userId?.id ||
              child
            );
          });
        } else if (userData.children && Array.isArray(userData.children)) {
          // Fallback cho trường hợp API trả về children
          studentIds = userData.children.map((child) => {
            return (
              child._id ||
              child.id ||
              child.userId?._id ||
              child.userId?.id ||
              child
            );
          });
        } else if (userData.studentIds && Array.isArray(userData.studentIds)) {
          // Fallback cho trường hợp API trả về studentIds
          studentIds = userData.studentIds;
        }

        console.log("🔍 Debug studentIds extraction:", {
          childId: userData.childId,
          children: userData.children,
          studentIds: userData.studentIds,
          extractedStudentIds: studentIds,
        });

        // Extract parent ID for student role
        let parentId = "";
        if (userData.parentId) {
          parentId =
            userData.parentId._id || userData.parentId.id || userData.parentId;
        }

        setFormData({
          id: userData.id || userData._id || userSummary.id,
          name:
            userData.name || userData.userId?.name || userSummary.name || "",
          email:
            userData.email || userData.userId?.email || userSummary.email || "",
          phone:
            userData.phone ||
            userData.phoneNumber ||
            userData.userId?.phoneNumber ||
            userSummary.phone ||
            "",
          role:
            (userData.role || userSummary.role || "").charAt(0).toUpperCase() +
            (userData.role || userSummary.role || "").slice(1).toLowerCase(),
          gender: userData.gender || userSummary.gender || "",
          address: userData.address || userSummary.address || "",
          passwordBeforeHash: "", // Không lấy password từ API
          classIds: classIds,
          studentIds: studentIds,
          parentId: parentId,
          // Mapping dữ liệu vào formData theo UI format (thống nhất)
          canViewTeacher:
            userData.canViewTeacher || userData.canSeeTeacher || false, // UI dùng canViewTeacher, model dùng canSeeTeacher
          wagePerLesson: userData.wagePerLesson || 100000, // Teacher có wagePerLesson
        });

        // Preserve roleId from userSummary in editingUser
        setEditingUser({
          ...userData,
          roleId: userSummary.roleId,
          id: userSummary.id,
          name: userData.name || userData.userId?.name || userSummary.name,
        });
        setError(""); // Clear any previous errors

        console.log("📝 Form data loaded for editing:", {
          name: userData.name || userData.userId?.name || userSummary.name,
          role: userSummary.role,
          classIds: classIds,
          studentIds: studentIds,
          parentId: parentId,
          rawUserData: userData, // Thêm raw data để debug
          finalFormData: {
            classIds: classIds,
            studentIds: studentIds,
            parentId: parentId,
            canViewTeacher:
              userData.canViewTeacher || userData.canSeeTeacher || false,
            wagePerLesson: userData.wagePerLesson || 100000,
          },
        });
      } else {
        // Fallback to summary data if API fails
        console.warn("API failed, using summary data:", response.message);
        setFormData({
          id: userSummary.id,
          name: userSummary.name || "",
          email: userSummary.email || "",
          phone: userSummary.phone || "",
          role:
            (userSummary.role || "").charAt(0).toUpperCase() +
            (userSummary.role || "").slice(1).toLowerCase(),
          gender: userSummary.gender || "",
          address: userSummary.address || "",
          passwordBeforeHash: "",
          classIds: [],
          studentIds: [],
          parentId: "",
          canViewTeacher: false,
          wagePerLesson: 100000, // Thêm trường mặc định cho fallback
        });
        setEditingUser({
          ...userSummary,
          roleId: userSummary.roleId,
        });
        // Only show warning, not error, since we have fallback data
        console.log(
          "⚠️ Đang sử dụng thông tin cơ bản do API chi tiết không khả dụng. Có thể chỉnh sửa các trường cơ bản."
        );
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      // Fallback to summary data on error
      setFormData({
        id: userSummary.id,
        name: userSummary.name || "",
        email: userSummary.email || "",
        phone: userSummary.phone || "",
        role:
          (userSummary.role || "").charAt(0).toUpperCase() +
          (userSummary.role || "").slice(1).toLowerCase(),
        gender: userSummary.gender || "",
        address: userSummary.address || "",
        passwordBeforeHash: "",
        classIds: [],
        studentIds: [],
        parentId: "",
        canViewTeacher: false,
      });
      setEditingUser({
        ...userSummary,
        roleId: userSummary.roleId,
      });
      // Only show error if it's a real connection issue
      if (err.message.includes("fetch") || err.message.includes("network")) {
        setError("Lỗi kết nối mạng. Đang sử dụng thông tin cơ bản.");
      } else {
        console.log(
          "Đang sử dụng thông tin cơ bản do API chi tiết không khả dụng"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }

    setLoading(true);
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) {
      setError("Không tìm thấy người dùng để xóa.");
      setLoading(false);
      return;
    }

    try {
      console.log(
        `🗑️ Deleting user: ${userToDelete.fullName}, Role: ${userToDelete.role}, RoleID: ${userToDelete.roleId}`
      );

      // Use roleId (which is the ID in the role-specific table) for deletion
      const deleteId = userToDelete.roleId || userId; // Fallback to userId if roleId is not available

      // Delete using the user's role and correct ID
      const response = await apiService.deleteUser(
        user.token,
        deleteId, // Use roleId instead of userId
        userToDelete.role
      );

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        console.log("✅ User deleted successfully");
        loadUsers(); // Refresh the user list
      } else {
        console.error("❌ Delete failed:", response.msg);
        setError(response.msg || "Không thể xóa người dùng");
      }
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
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
          gender: formData.gender,
          address: formData.address,
        };

        // Convert phone -> phoneNumber để phù hợp với User model
        if (formData.phone) {
          updateData.phoneNumber = formData.phone;
          console.log("📱 Converting phone → phoneNumber:", formData.phone);
        }

        // Thêm các trường theo role và convert field names theo model
        if (formData.role === "Parent") {
          updateData.canSeeTeacher = formData.canViewTeacher; // Theo model Parent

          // Convert studentIds thành childId cho Parent
          if (formData.studentIds && formData.studentIds.length > 0) {
            const studentRoleIds = formData.studentIds.map((userId) => {
              const student = students.find((s) => s.id === userId);
              return student ? student.roleId : userId;
            });
            updateData.childId = studentRoleIds; // Theo model Parent: childId array
            console.log(
              "👶 Parent childId converted:",
              formData.studentIds,
              "→",
              studentRoleIds
            );
          }
        }

        if (formData.role === "Teacher") {
          updateData.wagePerLesson = formData.wagePerLesson; // Theo model Teacher

          // Convert classIds thành classId cho Teacher
          if (formData.classIds && formData.classIds.length > 0) {
            updateData.classId = formData.classIds; // Theo model Teacher: classId array
            console.log("🏫 Teacher classId converted:", formData.classIds);
          }
        }

        if (formData.role === "Student") {
          // Convert classIds thành classId cho Student
          if (formData.classIds && formData.classIds.length > 0) {
            updateData.classId = formData.classIds; // Theo model Student: classId array
            console.log("📚 Student classId converted:", formData.classIds);
          }

          // Convert parentId cho Student
          if (formData.parentId) {
            const parent = parents.find((p) => p.id === formData.parentId);
            updateData.parentId = parent ? parent.roleId : formData.parentId; // Theo model Student: parentId
            console.log(
              "👨‍👩‍👧‍👦 Student parentId converted:",
              formData.parentId,
              "→",
              updateData.parentId
            );
          }
        }

        // Chỉ thêm password nếu người dùng nhập mới
        if (formData.passwordBeforeHash) {
          updateData.passwordBeforeHash = formData.passwordBeforeHash;
        }

        console.log("🔧 Updating user with:", {
          userId: editingUser.id,
          role: formData.role,
          roleId: editingUser.roleId,
          updateData,
        });

        // Validate required data for update
        if (!formData.role || !editingUser.roleId) {
          console.error("❌ Missing required data for update:", {
            role: formData.role,
            roleId: editingUser.roleId,
          });
          setError("Thiếu thông tin cần thiết để cập nhật. Vui lòng thử lại.");
          return;
        }

        response = await apiService.updateUser(
          user.token,
          editingUser.id,
          updateData,
          formData.role, // Truyền role
          editingUser.roleId // Truyền roleId nếu có
        );
      } else {
        // Tạo user mới - cũng cần convert IDs
        const createData = { ...formData };

        // Convert phone -> phoneNumber để phù hợp với User model
        if (createData.phone) {
          createData.phoneNumber = createData.phone;
          delete createData.phone; // Xóa field cũ
          console.log("📱 Converting phone → phoneNumber:", formData.phone);
        }

        // Thêm các trường theo role cho user mới và convert field names theo model
        if (createData.role === "Parent") {
          createData.canSeeTeacher = createData.canViewTeacher; // Theo model Parent
          delete createData.canViewTeacher; // Xóa field không cần thiết

          // Convert studentIds thành childId cho Parent
          if (createData.studentIds && createData.studentIds.length > 0) {
            const studentRoleIds = createData.studentIds.map((userId) => {
              const student = students.find((s) => s.id === userId);
              return student ? student.roleId : userId;
            });
            createData.childId = studentRoleIds; // Theo model Parent: childId array
            delete createData.studentIds; // Xóa field cũ
            console.log(
              "👶 New Parent childId converted:",
              formData.studentIds,
              "→",
              studentRoleIds
            );
          }
        }

        if (createData.role === "Teacher") {
          createData.wagePerLesson = createData.wagePerLesson || 100000; // Theo model Teacher

          // Convert classIds thành classId cho Teacher
          if (createData.classIds && createData.classIds.length > 0) {
            createData.classId = createData.classIds; // Theo model Teacher: classId array
            delete createData.classIds; // Xóa field cũ
            console.log("🏫 New Teacher classId converted:", formData.classIds);
          }
        }

        if (createData.role === "Student") {
          // Convert classIds thành classId cho Student
          if (createData.classIds && createData.classIds.length > 0) {
            createData.classId = createData.classIds; // Theo model Student: classId array
            delete createData.classIds; // Xóa field cũ
            console.log("📚 New Student classId converted:", formData.classIds);
          }

          // Convert parentId cho Student
          if (createData.parentId) {
            const parent = parents.find((p) => p.id === createData.parentId);
            createData.parentId = parent ? parent.roleId : createData.parentId; // Theo model Student: parentId
            console.log(
              "👨‍👩‍👧‍👦 New Student parentId converted:",
              formData.parentId,
              "→",
              createData.parentId
            );
          }
        }

        console.log(
          `🆕 Creating new ${createData.role} with data:`,
          createData
        );
        response = await apiService.createUser(user.token, createData);
      }

      if (response.success) {
        setShowAddUserForm(false);
        setEditingUser(null);
        // Reset form
        setFormData({
          name: "",
          email: "",
          passwordBeforeHash: "",
          phone: "",
          role: "Student",
          gender: "",
          address: "",
          parentId: "",
          classIds: [],
          studentIds: [],
          canViewTeacher: false,
          wagePerLesson: 100000, // Reset về giá trị mặc định
        });
        // Reload danh sách users
        loadUsers();
      } else {
        setError(response.message || "Không thể lưu thông tin người dùng");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Lỗi khi lưu thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "canViewTeacher" && type === "radio") {
      setFormData((prev) => ({
        ...prev,
        canViewTeacher: value === "true",
      }));
    } else if (name === "role") {
      // When role changes, clear role-specific fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        // Clear parent selection if not a student
        parentId: value === "Student" ? prev.parentId : "",
        // Clear student IDs if not a parent
        studentIds: value === "Parent" ? prev.studentIds : [],
        // Clear wage if not a teacher
        wagePerLesson: value === "Teacher" ? prev.wagePerLesson : 100000,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleViewClassDetail = async (classId) => {
    setLoading(true);
    try {
      const response = await apiService.getClassById(user.token, classId);
      if (response.data) {
        const classData = response.data;
        console.log("Class data from API:", classData);

        // Extract the teacherId (for user details view)
        let teacherId = null;
        if (classData.teacherId) {
          if (typeof classData.teacherId === "object") {
            // If teacherId is an object with id/user info
            teacherId = {
              id: classData.teacherId._id || classData.teacherId.id,
              role: "teacher",
              roleId: classData.teacherId._id || classData.teacherId.id,
              name:
                classData.teacherId.name ||
                classData.teacherId.userId?.name ||
                "Unknown",
            };
          } else {
            // If teacherId is just a string ID
            teacherId = {
              id: classData.teacherId,
              role: "teacher",
              roleId: classData.teacherId,
            };
          }
        }

        // Process student list for detailed view
        const processedStudentList = (classData.studentList || []).map(
          (student) => {
            // Create student object with needed information for user details view
            const studentIdObj = {
              id:
                student._id ||
                student.id ||
                student.userId?._id ||
                student.userId?.id,
              role: "student",
              roleId: student._id || student.id,
              name: student.name || student.userId?.name || "Unknown",
            };

            return {
              id: student._id || student.id,
              name: student.name || student.userId?.name,
              email: student.email || student.userId?.email,
              phoneNumber: student.phoneNumber || student.userId?.phoneNumber,
              phone: student.phone || student.userId?.phone,
              discount: student.discount,
              idObj: studentIdObj, // Store the full object for user details view
            };
          }
        );

        // Map API response to UI model
        const mappedClass = {
          id: classData._id || classData.id,
          className: classData.className || classData.name || "Chưa có tên lớp",
          year: classData.year || new Date().getFullYear(),
          grade: classData.grade || 1,
          isAvailable: classData.isAvailable !== false,
          status: classData.isAvailable ? "Đang học" : "Đã kết thúc",
          teacherId: teacherId, // Store the teacher ID object for user details
          teacherName:
            classData.teacherId?.name ||
            classData.teacherId?.userId?.name ||
            "Chưa phân công",
          teacherEmail:
            classData.teacherId?.email ||
            classData.teacherId?.userId?.email ||
            "",
          teacherPhone:
            classData.teacherId?.phoneNumber ||
            classData.teacherId?.userId?.phoneNumber ||
            "",
          currentStudents: classData.studentList?.length || 0,
          maxStudents: classData.maxStudents || 20,
          feePerLesson: classData.feePerLesson || 0,
          schedule: classData.schedule || {},
          studentList: processedStudentList,
          startDate: classData.schedule?.startDate || classData.startDate || "",
          endDate: classData.schedule?.endDate || classData.endDate || "",
          daysOfLessonInWeek:
            classData.schedule?.daysOfLessonInWeek ||
            classData.daysOfLessonInWeek ||
            [],
          location: classData.location || "",
          attendanceStats: classData.attendanceStats || {
            total: 0,
            attended: 0,
            missed: 0,
          },
        };

        setSelectedClass(mappedClass);
        setShowClassDetail(true);
      } else {
        setError("Không thể tải thông tin lớp học");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClass = async (classItem) => {
    if (!user?.token) return;

    setShowEditClass(true);
    setSelectedClass(classItem);
    setLoading(true);
    setError("");
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
          name: fetchedClass.className || "",
          status: fetchedClass.isAvailable ? "Đang học" : "Đã kết thúc",
          startDate: fetchedClass.schedule?.startDate
            ? new Date(fetchedClass.schedule.startDate).toLocaleDateString(
                "vi-VN"
              )
            : "",
          endDate: fetchedClass.schedule?.endDate
            ? new Date(fetchedClass.schedule.endDate).toLocaleDateString(
                "vi-VN"
              )
            : "",
          courseFee: fetchedClass.feePerLesson?.toString() || "0",
          description: fetchedClass.description || "Chưa có mô tả chi tiết.",
          teacher: fetchedClass.teacherId?.name || "Chưa phân công",
          teacherInfo: {
            email: fetchedClass.teacherId?.email || "",
            phone: fetchedClass.teacherId?.phoneNumber || "",
            experience: fetchedClass.teacherId?.experience || "",
            specialty: fetchedClass.teacherId?.specialty || "",
          },
          schedule: fetchedClass.schedule?.daysOfLessonInWeek?.join(", ") || "",
          room: fetchedClass.room || "Chưa có phòng",
          students: fetchedClass.studentList || [],
          currentStudents: fetchedClass.studentList?.length || 0,
          maxStudents: fetchedClass.maxStudents || 20,
        };
        setEditClassData(formattedData);
      } else {
        throw new Error(response.message || "Không thể tải chi tiết lớp học.");
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết lớp học:", err);
      setError(`Lỗi: ${err.message}. Hiển thị thông tin tóm tắt.`);
      // Fallback to summary data from the list if the API fails
      setEditClassData({
        ...classItem, // Use the summary data
        name: classItem.className, // Ensure name is mapped correctly
        teacherInfo: classItem.teacherInfo ? { ...classItem.teacherInfo } : {},
        students: classItem.students || [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a class
  const handleClassEdit = async (classId) => {
    if (!user?.token) return;

    setLoading(true);

    try {
      const classToEdit = classes.find((c) => c.id === classId);
      if (!classToEdit) {
        setError("Không tìm thấy thông tin lớp học");
        return;
      }

      setSelectedClass(classToEdit);

      // Format dates for the edit form
      const formatDateForForm = (dateString) => {
        if (!dateString) return "";

        // Try to parse MM/DD/YYYY format
        let date;
        if (dateString.includes("/")) {
          const parts = dateString.split("/");
          date = new Date(
            parseInt(parts[2]),
            parseInt(parts[0]) - 1,
            parseInt(parts[1])
          );
        } else {
          date = new Date(dateString);
        }

        if (isNaN(date.getTime())) return "";

        return date.toISOString().split("T")[0];
      };

      setEditClassData({
        id: classToEdit.id,
        name: classToEdit.className,
        year: classToEdit.year.toString(),
        grade: classToEdit.grade.toString(),
        teacherId: classToEdit.teacherId || "",
        feePerLesson: classToEdit.feePerLesson.toString(),
        startDate: formatDateForForm(classToEdit.schedule?.startDate),
        endDate: formatDateForForm(classToEdit.schedule?.endDate),
        daysOfLessonInWeek: classToEdit.schedule?.daysOfLessonInWeek || [],
        isAvailable: classToEdit.isAvailable,
      });

      setShowEditClass(true);
    } catch (error) {
      console.error("Error preparing class edit:", error);
      setError("Lỗi khi chuẩn bị chỉnh sửa lớp học");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học này?")) return;
    if (!user?.token) return;

    setLoading(true);

    try {
      const response = await apiService.deleteClass(user.token, classId);

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        // Reload classes list
        loadClasses();
      } else {
        setError(response.msg || "Không thể xóa lớp học");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load data for form selects
  const loadFormData = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [parentsRes, studentsRes, classesRes] = await Promise.all([
        apiService.getUsers(user.token, 1, 1000, { role: "Parent" }),
        apiService.getUsers(user.token, 1, 1000, { role: "Student" }),
        apiService.getClasses(user.token, 1, 1000, {}),
      ]);

      // Backend returns: {msg, data, pagination} instead of {success, users/classes}
      if (parentsRes.data) {
        const mappedParents = parentsRes.data.map((parent) => ({
          id: parent._id || parent.id, // User ID
          roleId: parent.roleId || parent._id || parent.id, // Parent record ID
          name: parent.name || parent.userId?.name || "Chưa có tên",
          email: parent.email || parent.userId?.email || "Chưa có email",
        }));
        console.log("👨‍👩‍👧‍👦 Parents loaded for form:", {
          rawData: parentsRes.data,
          mappedParents,
          count: mappedParents.length,
        });
        setParents(mappedParents);
      } else {
        console.log("⚠️ No parents data received:", parentsRes);
        setParents([]);
      }

      if (studentsRes.data) {
        const mappedStudents = studentsRes.data.map((student) => ({
          id: student._id || student.id, // User ID
          roleId: student.roleId || student._id || student.id, // Student record ID
          name: student.name || student.userId?.name || "Chưa có tên",
          email: student.email || student.userId?.email || "Chưa có email",
        }));
        setStudents(mappedStudents);
      }

      if (classesRes.data) {
        const mappedClasses = classesRes.data.map((cls) => ({
          id: cls._id || cls.id,
          className: cls.className || cls.name || "Chưa có tên lớp",
        }));
        setAllClasses(mappedClasses);
        console.log(
          "🏫 Classes loaded for form:",
          mappedClasses.length,
          mappedClasses
        );
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
      setFormData((prev) => ({
        ...prev,
        studentIds: [...prev.studentIds, studentId],
      }));
    }
  };

  const handleRemoveStudentFromParent = (studentId) => {
    setFormData((prev) => ({
      ...prev,
      studentIds: prev.studentIds.filter((id) => id !== studentId),
    }));
  };

  const handleClassSelect = (classId) => {
    if (classId && !formData.classIds.includes(classId)) {
      setFormData((prev) => ({
        ...prev,
        classIds: [...prev.classIds, classId],
      }));
    }
  };

  const handleRemoveClass = (classId) => {
    setFormData((prev) => ({
      ...prev,
      classIds: prev.classIds.filter((id) => id !== classId),
    }));
  };

  // Handle role filter change
  const handleRoleFilterChange = async (newRole) => {
    console.log(`🔍 Changing filter from "${selectedRole}" to "${newRole}"`);

    // Reset pagination first
    const newPagination = {
      ...pagination,
      currentPage: 1,
    };
    setPagination(newPagination);

    // Update role
    setSelectedRole(newRole);

    // Clear any existing error
    setError("");

    // Load users immediately with new filter and reset pagination
    if (user?.token) {
      setLoading(true);
      try {
        const filters = {};
        if (newRole !== "all") {
          filters.role = newRole.charAt(0).toUpperCase() + newRole.slice(1);
        }

        console.log(`📋 Loading users with filter:`, filters, `page: 1`);

        const response = await apiService.getUsers(
          user.token,
          1, // Always start from page 1
          pagination.limit,
          filters
        );

        if (response.data && Array.isArray(response.data)) {
          const mappedUsers = response.data.map((user) => ({
            id: user._id || user.id,
            roleId: user.roleId || user._id || user.id,
            name: user.name || user.userId?.name || "Chưa có tên",
            email: user.email || user.userId?.email || "Chưa có email",
            phone:
              user.phoneNumber ||
              user.phone ||
              user.userId?.phoneNumber ||
              "Chưa có",
            role: (user.role || "unknown").toLowerCase(),
            status: user.isActive ? "Đang hoạt động" : "Ngừng hoạt động",
            gender: user.gender || "",
            address: user.address || "",
            parentId: user.parentId || null,
            classId: user.classId || null,
            childId: user.childId || [],
            canSeeTeacher: user.canSeeTeacher || false,
            wagePerLesson: user.wagePerLesson || 0,
          }));

          setUsers(mappedUsers);

          if (response.pagination) {
            setPagination({
              currentPage: 1,
              totalPages: response.pagination.totalPages || 1,
              totalUsers:
                response.pagination.totalItems || response.data.length,
              limit: pagination.limit,
            });
          }

          console.log(
            `✅ Loaded ${mappedUsers.length} users for role: ${newRole}`
          );
        } else {
          setError(response.msg || "Không thể tải danh sách người dùng");
        }
      } catch (error) {
        console.error("Error loading users after filter change:", error);
        setError("Lỗi kết nối. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle creating a new class
  const handleCreateClass = async () => {
    if (!user?.token) return;

    setLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        "name",
        "year",
        "grade",
        "startDate",
        "endDate",
        "feePerLesson",
      ];
      const missingFields = requiredFields.filter((field) => !newClass[field]);

      if (missingFields.length > 0) {
        setError(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(", ")}`);
        setLoading(false);
        return;
      }

      // Prepare data for API
      // Convert day names to numbers (0 = Monday, 1 = Tuesday, etc.)
      const dayToNumberMap = {
        Monday: 0,
        Tuesday: 1,
        Wednesday: 2,
        Thursday: 3,
        Friday: 4,
        Saturday: 5,
        Sunday: 6,
      };

      const daysAsNumbers = newClass.daysOfLessonInWeek.map(
        (day) => dayToNumberMap[day]
      );

      const classData = {
        className: newClass.name,
        year: parseInt(newClass.year),
        grade: parseInt(newClass.grade),
        teacherId: newClass.teacherId || null,
        feePerLesson: parseInt(newClass.feePerLesson),
        schedule: {
          startDate: newClass.startDate,
          endDate: newClass.endDate,
          daysOfLessonInWeek: daysAsNumbers,
        },
        isAvailable: true,
      };

      const response = await apiService.createClass(user.token, classData);

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        // Reset the form
        setNewClass({
          name: "",
          year: new Date().getFullYear(),
          grade: "",
          startDate: "",
          endDate: "",
          feePerLesson: "",
          teacherId: "",
          daysOfLessonInWeek: [],
        });

        // Close the modal
        setShowNewClassModal(false);

        // Reload classes list
        loadClasses();
      } else {
        setError(response.msg || "Không thể tạo lớp học mới");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarVisible(!sidebarVisible)}
          >
            <FiMenu />
          </button>
          <h1>
            <FiUser className="icon" />
            Quản trị viên
          </h1>
        </div>
        <div className="user-info">
          <span>Xin chào, {user?.name}</span>
          <button onClick={onLogout} className="logout-btn">
            <FiLogOut className="icon" style={{ marginRight: "0.5rem" }} />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar Overlay for mobile */}
        {sidebarVisible && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarVisible(false)}
          ></div>
        )}

        <aside className={`sidebar ${sidebarVisible ? "visible" : "hidden"}`}>
          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <RiDashboardLine className="icon" />
              Tổng quan
            </button>
            <button
              className={`nav-item ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <FiUsers className="icon" />
              Quản lý người dùng
            </button>
            <button
              className={`nav-item ${activeTab === "classes" ? "active" : ""}`}
              onClick={() => setActiveTab("classes")}
            >
              <HiAcademicCap className="icon" />
              Lớp học
            </button>
            <button
              className={`nav-item ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              <BiMoney className="icon" />
              Lương giáo viên
            </button>
            <button
              className={`nav-item ${activeTab === "tuition" ? "active" : ""}`}
              onClick={() => setActiveTab("tuition")}
            >
              <MdPayment className="icon" />
              Học phí
            </button>
            {/* New sidebar items */}
            <button
              className={`nav-item ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <MdNotifications className="icon" />
              Thông báo
            </button>
            <button
              className={`nav-item ${
                activeTab === "advertisements" ? "active" : ""
              }`}
              onClick={() => setActiveTab("advertisements")}
            >
              <MdCampaign className="icon" />
              Quảng cáo
            </button>
          </nav>
        </aside>

        <main
          className={`main-content ${
            activeTab === "overview" ? "overview-layout" : ""
          }`}
        >
          {activeTab === "overview" && <Overview user={user} />}

          {activeTab === "users" && (
            <UserManagement
              users={users}
              filteredUsers={filteredUsers}
              loading={loading}
              error={error}
              pagination={pagination}
              setPagination={setPagination}
              userFilters={userFilters}
              setUserFilters={setUserFilters}
              selectedRole={selectedRole}
              handleRoleFilterChange={handleRoleFilterChange}
              showAddUserForm={showAddUserForm}
              setShowAddUserForm={setShowAddUserForm}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              formData={formData}
              setFormData={setFormData}
              formKey={formKey}
              parents={parents}
              students={students}
              allClasses={allClasses}
              handleInputChange={handleInputChange}
              handleClassSelect={handleClassSelect}
              handleRemoveClass={handleRemoveClass}
              handleStudentSelect={handleStudentSelect}
              handleRemoveStudentFromParent={handleRemoveStudentFromParent}
              handleFormSubmit={handleFormSubmit}
              resetFormData={resetFormData}
              handleAddUser={handleAddUser}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              handleViewUserDetail={handleViewUserDetail}
            />
          )}

          {activeTab === "classes" && (
            <ClassManagement
              classes={classes}
              loading={loading}
              error={error}
              classPagination={classPagination}
              setClassPagination={setClassPagination}
              classFilters={classFilters}
              setClassFilters={setClassFilters}
              allTeachers={allTeachers}
              showNewClassModal={showNewClassModal}
              setShowNewClassModal={setShowNewClassModal}
              showClassDetail={showClassDetail}
              setShowClassDetail={setShowClassDetail}
              showEditClass={showEditClass}
              setShowEditClass={setShowEditClass}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              editClassData={editClassData}
              setEditClassData={setEditClassData}
              newClass={newClass}
              setNewClass={setNewClass}
              handleCreateClass={handleCreateClass}
              handleDeleteClass={handleDeleteClass}
              handleClassEdit={handleClassEdit}
              handleViewClassDetail={handleViewClassDetail}
              handleClassSelect={handleClassSelect}
              user={user}
            />
          )}

          {activeTab === "payments" && <SalaryManagement user={user} />}

          {activeTab === "tuition" && (
            <TuitionManagement
              user={user}
              loading={loading}
              error={error}
              setError={setError}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationsManagement user={user} />
          )}

          {activeTab === "advertisements" && (
            <AdvertisementsManagement user={user} />
          )}
        </main>
      </div>

      {/* Teacher Selection Modal */}
      <TeacherSelectionModal
        showTeacherSelect={showTeacherSelect}
        selectedClassForAssignment={selectedClassForAssignment}
        availableTeachers={availableTeachers}
        loading={loading}
        handleAssignTeacher={handleAssignTeacher}
        setShowTeacherSelect={setShowTeacherSelect}
        setSelectedClassForAssignment={setSelectedClassForAssignment}
      />

      {/* Student Selection Modal */}
      <StudentSelectionModal
        showStudentSelect={showStudentSelect}
        selectedClassForAssignment={selectedClassForAssignment}
        availableStudents={availableStudents}
        loading={loading}
        handleEnrollStudent={handleEnrollStudent}
        setShowStudentSelect={setShowStudentSelect}
        setSelectedClassForAssignment={setSelectedClassForAssignment}
        handleViewUserDetail={handleViewUserDetail}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={showUserDetail}
        onClose={() => {
          setShowUserDetail(false);
          setSelectedUserDetail(null);
          setError("");
        }}
        user={selectedUserDetail}
      />

      {/* Class Detail Modal */}
      <ClassDetailModal
        showClassDetail={showClassDetail}
        selectedClass={selectedClass}
        setShowClassDetail={setShowClassDetail}
        setSelectedClass={setSelectedClass}
        setError={setError}
        handleViewUserDetail={handleViewUserDetail}
        user={user}
      />

      {/* Class Form Modal - for editing classes */}
      <ClassFormModal
        isEdit={true}
        showModal={showEditClass}
        setShowModal={setShowEditClass}
        classData={editClassData}
        setClassData={setEditClassData}
        allTeachers={allTeachers}
        handleSubmit={() => handleClassEdit(editClassData.id)}
        loading={loading}
      />

      {/* User Form Modal - for adding/editing users */}
      <UserFormModal
        showModal={showAddUserForm}
        setShowModal={setShowAddUserForm}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleFormSubmit}
        loading={loading}
        error={error}
        setError={setError}
        parents={parents}
        students={students}
        allClasses={allClasses}
        formKey={formKey}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
    </div>
  );
}

export default AdminDashboard;
