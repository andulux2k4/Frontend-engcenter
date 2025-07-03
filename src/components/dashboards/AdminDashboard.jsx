import { useState, useEffect } from "react";
import "../Dashboard.css";
import "../../styles/dashboard/admin.css";
import {
  FiUser,
  FiLogOut,
  FiEdit,
  FiTrash2,
  FiEye,
  FiUsers,
  FiPhone,
  FiMail,
  FiLock,
  FiSave,
  FiX,
  FiBook,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
  FiPlus,
  FiMenu,
} from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap, HiInformationCircle } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import { MdNotifications, MdCampaign, MdPayment } from "react-icons/md";
import apiService from "../../services/api";

function AdminDashboard({ user, onLogout }) {
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
  }, [activeTab, pagination.currentPage, selectedRole, userFilters, classPagination.currentPage, classFilters]);

  const loadUsers = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const filters = {};
      
      // Combine selectedRole with userFilters
      if (selectedRole !== "all") {
        filters.role = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
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
      const filters = { summary: "true" }; // Always get summary for list view
      
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
            totalClasses: response.pagination.totalItems || response.data.length,
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
  const handleEnrollStudent = async (classId, studentId) => {
    if (!user?.token) return;

    setLoading(true);

    try {
      const response = await apiService.updateClass(user.token, classId, {
        studentList: studentId,
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
      // Try to delete using the user's role first, then fallback to general endpoint
      const response = await apiService.deleteUser(
        user.token,
        userId,
        userToDelete.role
      );
      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        loadUsers(); // Refresh the user list
      } else {
        setError(response.msg || "Không thể xóa người dùng");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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

  const handleViewClassDetail = (classItem) => {
    setSelectedClass(classItem);
    setShowClassDetail(true);
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

  const handleEditClassChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setEditClassData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setEditClassData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddStudentToClass = () => {
    // setShowAddStudent(true)
  };

  const handleRemoveStudent = (studentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này khỏi lớp?")) {
      setEditClassData((prev) => ({
        ...prev,
        students: prev.students.filter((student) => student.id !== studentId),
        currentStudents: prev.currentStudents - 1,
      }));
    }
  };

  // Dummy implementation for saving student changes in class edit modal
  // const handleSaveStudentChanges = (studentId) => {
  //   // You can implement API call here to save student changes if needed
  //   // For now, just show a notification or log
  //   alert('Đã lưu thay đổi cho học sinh!');
  // }

  const handleSaveClass = () => {
    // Trong thực tế sẽ gọi API để lưu thông tin
    console.log("Lưu thông tin lớp:", editClassData);
    setShowEditClass(false);
  };

  const handleCreateClass = async () => {
    if (!user?.token) return;

    setLoading(true);

    try {
      // Function to convert YYYY-MM-DD to MM/DD/YYYY format
      const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

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
          daysOfLessonInWeek: newClass.daysOfLessonInWeek || [],
        },
        teacherId: newClass.teacherId || null,
        studentList: [],
      };

      const response = await apiService.createClass(user.token, classData);

      // Backend returns: {msg, data} instead of {success, data}
      if (response.msg && response.msg.includes("thành công")) {
        setShowNewClassModal(false);
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
        // Reload classes list
        loadClasses();
      } else {
        setError(response.msg || "Không thể tạo lớp học");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load available teachers for new class creation
  const loadTeachersForNewClass = async () => {
    if (!user?.token) return;

    try {
      const response = await apiService.getAvailableTeachers(user.token);

      // Backend returns: {msg, data} instead of {success, teachers}
      if (response.data && response.data.length > 0) {
        setAvailableTeachers(response.data);
        console.log("✅ Loaded teachers for new class:", response.data.length);
      } else {
        console.log("⚠️ No teachers found");
        setAvailableTeachers([]);
      }
    } catch (error) {
      console.error("Error loading teachers for new class:", error);
      setAvailableTeachers([]);
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
              Quản lý Users
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
              Thanh toán
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

        <main className="main-content">
          {activeTab === "overview" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-chart-pie"></i>
                  Tổng quan hệ thống
                </h2>
              </div>
              <div
                className="card-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)", // 3 cột mỗi hàng, nếu muốn 1 hàng thì dùng repeat(6, 1fr)
                  gap: "1.5rem",
                  padding: "0.5rem 0",
                }}
              >
                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <FiUsers className="icon" style={{ color: "#b30000" }} />
                      Tổng số học sinh
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      {mockData.stats.totalStudents}
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Học sinh đang theo học
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>

                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <FiUsers className="icon" style={{ color: "#b30000" }} />
                      Tổng số giáo viên
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      {mockData.stats.totalTeachers}
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Giáo viên đang giảng dạy
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>

                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <HiAcademicCap
                        className="icon"
                        style={{ color: "#b30000" }}
                      />
                      Lớp học đang hoạt động
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      {mockData.stats.activeClasses}
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Lớp học đang diễn ra
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>

                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <BiMoney className="icon" style={{ color: "#b30000" }} />
                      Doanh thu tháng
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      {mockData.stats.revenue} VNĐ
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Tổng thu tháng 3/2024
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>
                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <FiBarChart2
                        className="icon"
                        style={{ color: "#b30000" }}
                      />
                      Tỷ lệ hoàn thành bài tập
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      92%
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Bài tập đã hoàn thành trong tháng
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>
                <div
                  className="card"
                  style={{
                    background:
                      "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
                    border: "2px solid #ffebee",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(179, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div className="card-content">
                    <h3>
                      <FiFileText
                        className="icon"
                        style={{ color: "#b30000" }}
                      />
                      Số lượng tài liệu
                    </h3>
                    <p
                      className="stat"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#b30000",
                        margin: "1rem 0",
                        textAlign: "center",
                      }}
                    >
                      38
                    </p>
                    <p
                      style={{
                        textAlign: "center",
                        color: "#666",
                        fontSize: "0.9rem",
                        margin: "0",
                      }}
                    >
                      Tài liệu học tập hiện có
                    </p>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "80px",
                      height: "80px",
                      backgroundColor: "rgba(179, 0, 0, 0.1)",
                      borderRadius: "50%",
                      zIndex: 0,
                    }}
                  ></div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "users" && (
            <section>
              <div
                className="section-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  className="section-title"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  <FiUsers
                    style={{ marginRight: "0.75rem", color: "#3b82f6" }}
                  />
                  Quản lý Users
                </h2>
                <div className="section-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleAddUser}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    }}
                  >
                    <FiUser style={{ fontSize: "1rem" }} />
                    Thêm User mới
                  </button>
                </div>
              </div>

              <div
                className="filter-section"
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e5e7eb",
                }}
              >
                {/* Search by Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "200px",
                  }}
                >
                  <FiUser style={{ color: "#6b7280" }} />
                  <input
                    type="text"
                    placeholder="Tìm theo tên..."
                    value={userFilters.name}
                    onChange={(e) =>
                      setUserFilters(prev => ({ ...prev, name: e.target.value }))
                    }
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      flex: 1,
                    }}
                  />
                </div>

                {/* Search by Email */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    minWidth: "200px",
                  }}
                >
                  <FiMail style={{ color: "#6b7280" }} />
                  <input
                    type="text"
                    placeholder="Tìm theo email..."
                    value={userFilters.email}
                    onChange={(e) =>
                      setUserFilters(prev => ({ ...prev, email: e.target.value }))
                    }
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      fontSize: "0.875rem",
                      flex: 1,
                    }}
                  />
                </div>

                {/* Filter by Active Status */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    Trạng thái:
                  </label>
                  <select
                    value={userFilters.isActive}
                    onChange={(e) =>
                      setUserFilters(prev => ({ ...prev, isActive: e.target.value }))
                    }
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      backgroundColor: "white",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="">Tất cả</option>
                    <option value="true">Đang hoạt động</option>
                    <option value="false">Ngừng hoạt động</option>
                  </select>
                </div>

                {/* Role Filter */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiUsers style={{ color: "#6b7280" }} />
                  <label
                    htmlFor="roleFilter"
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                      fontSize: "0.875rem",
                    }}
                  >
                    Lọc theo vai trò:
                  </label>
                </div>
                <select
                  id="roleFilter"
                  value={selectedRole}
                  onChange={(e) => {
                    handleRoleFilterChange(e.target.value);
                  }}
                  className="role-filter"
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    backgroundColor: "white",
                    color: "#374151",
                    fontSize: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  <option value="all">Tất cả</option>
                  <option value="teacher">Giáo viên</option>
                  <option value="student">Học sinh</option>
                  <option value="parent">Phụ huynh</option>
                </select>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Hiển thị {pagination.limit} kết quả
                  </span>
                </div>
              </div>

              {error && (
                <div
                  className="error-message"
                  style={{
                    padding: "1rem",
                    backgroundColor: "#fed7d7",
                    color: "#c53030",
                    borderRadius: "0.375rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              {loading && (
                <div
                  className="loading-message"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#4a5568",
                  }}
                >
                  Đang tải dữ liệu...
                </div>
              )}

              {showAddUserForm && (
                <div
                  className="modal-overlay"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) {
                      setShowAddUserForm(false);
                      setEditingUser(null);
                      setError("");
                    }
                  }}
                >
                  <div className="user-edit-modal">
                    {/* Header */}
                    <div className="user-edit-header">
                      <button
                        className="user-edit-close"
                        onClick={() => {
                          setShowAddUserForm(false);
                          setEditingUser(null);
                          setError("");
                        }}
                      ></button>

                      <div className="user-edit-avatar">
                        {editingUser
                          ? (formData.name || editingUser.name || "U")
                              .charAt(0)
                              .toUpperCase()
                          : "+"}
                      </div>
                      <h2 className="user-edit-name">
                        {editingUser
                          ? `Chỉnh sửa: ${
                              formData.name || editingUser.name || "Người dùng"
                            }`
                          : "Thêm người dùng mới"}
                      </h2>
                      <div className="user-edit-role">
                        {(() => {
                          const role = formData.role?.toLowerCase() || "";
                          switch (role) {
                            case "teacher":
                              return "Giáo viên";
                            case "student":
                              return "Học sinh";
                            case "parent":
                              return "Phụ huynh";
                            case "admin":
                              return "Quản trị viên";
                            default:
                              return role
                                ? role.charAt(0).toUpperCase() + role.slice(1)
                                : "Người dùng";
                          }
                        })()}
                      </div>
                    </div>

                    {/* Body */}
                    <div className="user-edit-body">
                      {loading && editingUser ? (
                        <div className="user-detail-loading">
                          <div className="loading-spinner"></div>
                          <div className="loading-text">
                            Đang tải thông tin...
                          </div>
                        </div>
                      ) : error ? (
                        <div
                          className="error-message"
                          style={{
                            color: "#dc2626",
                            background: "#fee2e2",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                          }}
                        >
                          {error}
                        </div>
                      ) : (
                        <form
                          key={formKey}
                          onSubmit={handleFormSubmit}
                          autoComplete="off"
                        >
                          {/* Thông tin cơ bản */}
                          <div className="user-edit-section">
                            <h3>
                              <FiUser />
                              Thông tin cơ bản
                            </h3>

                            <div className="user-edit-field">
                              <label className="user-edit-label">
                                Họ và tên *
                              </label>
                              <input
                                className="user-edit-input"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nhập họ và tên"
                                autoComplete="off"
                                data-lpignore="true"
                                required
                              />
                            </div>

                            <div className="user-edit-field">
                              <label className="user-edit-label">Email *</label>
                              <input
                                className="user-edit-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ email"
                                autoComplete="new-email"
                                autoFill="off"
                                data-lpignore="true"
                                required
                              />
                            </div>

                            <div className="user-edit-field">
                              <label className="user-edit-label">
                                Số điện thoại *
                              </label>
                              <input
                                className="user-edit-input"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                                required
                              />
                            </div>

                            <div className="user-edit-field">
                              <label className="user-edit-label">
                                Giới tính
                              </label>
                              <select
                                className="user-edit-select"
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                              >
                                <option value="">Chọn giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                              </select>
                            </div>

                            <div className="user-edit-field">
                              <label className="user-edit-label">Địa chỉ</label>
                              <input
                                className="user-edit-input"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ"
                              />
                            </div>
                          </div>

                          {/* Thông tin hệ thống */}
                          <div className="user-edit-section">
                            <h3>
                              <FiLock />
                              Thông tin hệ thống
                            </h3>

                            <div className="user-edit-field">
                              <label className="user-edit-label">
                                Vai trò *
                              </label>
                              <select
                                className="user-edit-select"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                disabled={editingUser} // Không cho đổi role khi edit
                              >
                                <option value="Student">Học sinh</option>
                                <option value="Teacher">Giáo viên</option>
                                <option value="Parent">Phụ huynh</option>
                              </select>
                              {editingUser && (
                                <small
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.75rem",
                                    marginTop: "0.25rem",
                                    display: "block",
                                  }}
                                >
                                  Không thể thay đổi vai trò khi chỉnh sửa
                                </small>
                              )}
                            </div>

                            <div className="user-edit-field">
                              <label className="user-edit-label">
                                Mật khẩu {!editingUser && "*"}
                              </label>
                              <input
                                className="user-edit-input"
                                type="password"
                                name="passwordBeforeHash"
                                value={formData.passwordBeforeHash}
                                onChange={handleInputChange}
                                placeholder={
                                  editingUser
                                    ? "Để trống để giữ nguyên mật khẩu"
                                    : "Nhập mật khẩu"
                                }
                                autoComplete="new-password"
                                autoFill="off"
                                data-lpignore="true"
                                minLength="8"
                                {...(editingUser ? {} : { required: true })}
                              />
                              {editingUser && (
                                <small
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.75rem",
                                    marginTop: "0.25rem",
                                    display: "block",
                                  }}
                                >
                                  Để trống nếu không muốn thay đổi mật khẩu
                                </small>
                              )}
                            </div>
                          </div>

                          {/* Thông tin theo role */}
                          {formData.role === "Student" && (
                            <div className="user-edit-section">
                              <h3>
                                <HiAcademicCap />
                                Thông tin học sinh
                              </h3>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Phụ huynh hiện tại
                                </label>

                                {/* Hiển thị phụ huynh hiện tại nếu có */}
                                {formData.parentId ? (
                                  <div style={{ marginBottom: "0.5rem" }}>
                                    {(() => {
                                      const currentParent = parents.find(
                                        (p) =>
                                          p.id === formData.parentId ||
                                          p.roleId === formData.parentId
                                      );
                                      if (currentParent) {
                                        return (
                                          <span
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "0.25rem",
                                              padding: "0.25rem 0.5rem",
                                              background: "#f3e8ff",
                                              color: "#7c3aed",
                                              borderRadius: "4px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            Phụ huynh: {currentParent.name}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  parentId: "",
                                                }))
                                              }
                                              style={{
                                                background: "none",
                                                border: "none",
                                                color: "#7c3aed",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "0.25rem",
                                              }}
                                            >
                                              ×
                                            </button>
                                          </span>
                                        );
                                      } else {
                                        return (
                                          <span
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "0.25rem",
                                              padding: "0.25rem 0.5rem",
                                              background: "#fef3c7",
                                              color: "#92400e",
                                              borderRadius: "4px",
                                              fontSize: "0.75rem",
                                            }}
                                          >
                                            Phụ huynh: ID {formData.parentId}{" "}
                                            (không tìm thấy)
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  parentId: "",
                                                }))
                                              }
                                              style={{
                                                background: "none",
                                                border: "none",
                                                color: "#92400e",
                                                cursor: "pointer",
                                                padding: "0",
                                                marginLeft: "0.25rem",
                                              }}
                                            >
                                              ×
                                            </button>
                                          </span>
                                        );
                                      }
                                    })()}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: "0.5rem",
                                      background: "#f9fafb",
                                      borderRadius: "4px",
                                      fontSize: "0.75rem",
                                      color: "#6b7280",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    Chưa có phụ huynh
                                  </div>
                                )}

                                <select
                                  className="user-edit-select"
                                  onChange={(e) => {
                                    const selectedParentId = e.target.value;
                                    console.log(
                                      "🔍 Parent dropdown selection:",
                                      {
                                        selectedParentId,
                                        currentParentId: formData.parentId,
                                        allParents: parents,
                                        parentsCount: parents.length,
                                      }
                                    );
                                    if (
                                      selectedParentId &&
                                      selectedParentId !== ""
                                    ) {
                                      console.log(
                                        "✅ Setting parent ID:",
                                        selectedParentId
                                      );
                                      setFormData((prev) => ({
                                        ...prev,
                                        parentId: selectedParentId,
                                      }));
                                    }
                                  }}
                                  value=""
                                  style={{
                                    width: "100%",
                                    padding: "0.75rem",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  <option value="">
                                    {parents.length > 0
                                      ? "Chọn phụ huynh"
                                      : "Không có phụ huynh nào"}
                                  </option>
                                  {parents
                                    .filter(
                                      (p) =>
                                        p.roleId !== formData.parentId &&
                                        p.id !== formData.parentId
                                    )
                                    .map((p) => (
                                      <option
                                        key={p.roleId || p.id}
                                        value={p.roleId}
                                      >
                                        {p.name} (ID:{" "}
                                        {(p.id || p.roleId).slice(-6)})
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Lớp học
                                </label>
                                <div
                                  style={{
                                    padding: "0.75rem",
                                    background: "#f0f9ff",
                                    border: "1px solid #0ea5e9",
                                    borderRadius: "8px",
                                    fontSize: "0.875rem",
                                    color: "#0c4a6e",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                  }}
                                >
                                  <HiInformationCircle style={{ fontSize: "1.25rem", color: "#0ea5e9" }} />
                                  <span>
                                    Vui lòng tạo học sinh trước, sau đó thêm vào lớp học ở mục "Lớp học"
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}

                          {formData.role === "Teacher" && (
                            <div className="user-edit-section">
                              <h3>
                                <HiAcademicCap />
                                Thông tin giáo viên
                              </h3>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Lương mỗi buổi học (VND) *
                                </label>
                                <div className="input-with-icon">
                                  <BiMoney className="user-edit-icon" />
                                  <input
                                    className="user-edit-input"
                                    type="number"
                                    name="wagePerLesson"
                                    value={formData.wagePerLesson}
                                    onChange={handleInputChange}
                                    placeholder="Ví dụ: 100000"
                                    min="0"
                                    step="1000"
                                    required
                                  />
                                </div>
                                <small
                                  style={{
                                    color: "#6b7280",
                                    fontSize: "0.75rem",
                                    marginTop: "0.25rem",
                                    display: "block",
                                  }}
                                >
                                  Lương được tính theo từng buổi dạy thực tế
                                </small>
                              </div>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Lớp đang giảng dạy
                                </label>
                                <select
                                  className="user-edit-select"
                                  onChange={(e) =>
                                    handleClassSelect(e.target.value)
                                  }
                                  value=""
                                >
                                  <option value="">Chọn lớp dạy để thêm</option>
                                  {allClasses
                                    .filter(
                                      (c) => !formData.classIds.includes(c.id)
                                    )
                                    .map((c) => (
                                      <option key={c.id} value={c.id}>
                                        {c.className}
                                      </option>
                                    ))}
                                </select>

                                {formData.classIds.length > 0 && (
                                  <div
                                    style={{
                                      marginTop: "0.5rem",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    {formData.classIds.map((id) => {
                                      // Debug thông tin cho Teacher form
                                      if (allClasses.length === 0) {
                                        console.log(
                                          "⚠️ allClasses is empty for Teacher form"
                                        );
                                      }

                                      const classItem = allClasses.find(
                                        (c) => c.id === id || c._id === id
                                      );
                                      return (
                                        <span
                                          key={id}
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.25rem",
                                            padding: "0.25rem 0.5rem",
                                            background: classItem
                                              ? "#fef3c7"
                                              : "#fee2e2",
                                            color: classItem
                                              ? "#92400e"
                                              : "#dc2626",
                                            borderRadius: "4px",
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {classItem
                                            ? classItem.className ||
                                              classItem.name
                                            : `Lớp ID: ${id} (không tìm thấy)`}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveClass(id)
                                            }
                                            style={{
                                              background: "none",
                                              border: "none",
                                              color: classItem
                                                ? "#92400e"
                                                : "#dc2626",
                                              cursor: "pointer",
                                              padding: "0",
                                              marginLeft: "0.25rem",
                                            }}
                                          >
                                            ×
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {formData.role === "Parent" && (
                            <div className="user-edit-section">
                              <h3>
                                <FiUsers />
                                Thông tin phụ huynh
                              </h3>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Con em đang theo học
                                </label>

                                {/* Hiển thị con em hiện tại nếu có */}
                                {formData.studentIds.length > 0 ? (
                                  <div
                                    style={{
                                      marginBottom: "0.5rem",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "0.5rem",
                                    }}
                                  >
                                    {formData.studentIds.map((id) => {
                                      const student = students.find(
                                        (s) =>
                                          s.id === id ||
                                          s._id === id ||
                                          s.roleId === id
                                      );
                                      return (
                                        <span
                                          key={id}
                                          style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.25rem",
                                            padding: "0.25rem 0.5rem",
                                            background: student
                                              ? "#dcfce7"
                                              : "#fef3c7",
                                            color: student
                                              ? "#166534"
                                              : "#92400e",
                                            borderRadius: "4px",
                                            fontSize: "0.75rem",
                                          }}
                                        >
                                          {student
                                            ? student.name
                                            : `Học sinh ID: ${id} (không tìm thấy)`}
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveStudentFromParent(id)
                                            }
                                            style={{
                                              background: "none",
                                              border: "none",
                                              color: student
                                                ? "#166534"
                                                : "#92400e",
                                              cursor: "pointer",
                                              padding: "0",
                                              marginLeft: "0.25rem",
                                            }}
                                          >
                                            ×
                                          </button>
                                        </span>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      padding: "0.5rem",
                                      background: "#f9fafb",
                                      borderRadius: "4px",
                                      fontSize: "0.75rem",
                                      color: "#6b7280",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    Chưa có con em theo học
                                  </div>
                                )}

                                <select
                                  className="user-edit-select"
                                  onChange={(e) =>
                                    handleStudentSelect(e.target.value)
                                  }
                                  value=""
                                >
                                  <option value="">
                                    Chọn học sinh để thêm
                                  </option>
                                  {students
                                    .filter(
                                      (s) =>
                                        !formData.studentIds.includes(s.id) &&
                                        !formData.studentIds.includes(s.roleId)
                                    )
                                    .map((s) => (
                                      <option key={s.id} value={s.roleId}>
                                        {s.name} (ID: {s.id.slice(-6)})
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div className="user-edit-field">
                                <label className="user-edit-label">
                                  Quyền xem thông tin giáo viên
                                </label>
                                <div className="user-edit-checkbox-group">
                                  <input
                                    className="user-edit-checkbox"
                                    type="checkbox"
                                    name="canViewTeacher"
                                    checked={formData.canViewTeacher}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        canViewTeacher: e.target.checked,
                                      }))
                                    }
                                  />
                                  <label className="user-edit-checkbox-label">
                                    Cho phép xem thông tin giáo viên
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
                        </form>
                      )}
                    </div>

                    {/* Actions */}
                    {!loading && !error && (
                      <div className="user-edit-actions">
                        <button
                          type="button"
                          className="user-edit-btn user-edit-btn-cancel"
                          onClick={() => {
                            resetFormData();
                            setShowAddUserForm(false);
                            setEditingUser(null);
                            setError("");
                            setFormKey((prev) => prev + 1); // Force form re-render
                          }}
                        >
                          <FiX />
                          Hủy bỏ
                        </button>
                        <button
                          type="button"
                          className="user-edit-btn user-edit-btn-save"
                          onClick={handleFormSubmit}
                          disabled={loading}
                        >
                          <FiSave />
                          {editingUser ? "Cập nhật" : "Thêm mới"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Users Table */}
              {!loading && filteredUsers.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  <table
                    className="data-table"
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.875rem",
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          backgroundColor: "#f8fafc",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "200px",
                            width: "15%",
                          }}
                        >
                          Họ và tên
                        </th>
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "180px",
                            width: "19%",
                          }}
                        >
                          Email
                        </th>
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "120px",
                            width: "15%",
                          }}
                        >
                          Số điện thoại
                        </th>
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "100px",
                            width: "12.5%",
                          }}
                        >
                          Vai trò
                        </th>
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "left",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "100px",
                            width: "12.2%",
                          }}
                        >
                          Trạng thái
                        </th>
                        <th
                          style={{
                            padding: "1.25rem 1rem",
                            textAlign: "center",
                            fontWeight: "600",
                            color: "#374151",
                            borderBottom: "1px solid #e5e7eb",
                            minWidth: "150px",
                            width: "16%",
                          }}
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            style={{
                              textAlign: "center",
                              padding: "4rem 1rem",
                              color: "#6b7280",
                              fontSize: "1rem",
                            }}
                          >
                            {error
                              ? "Có lỗi xảy ra khi tải dữ liệu"
                              : "Không có người dùng nào"}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user, index) => (
                          <tr
                            key={user.id}
                            onClick={() => handleViewUserDetail(user)}
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "white" : "#f9fafb",
                              borderBottom: "1px solid #f3f4f6",
                              transition: "background-color 0.2s ease",
                              minHeight: "80px",
                              cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f3f4f6";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                index % 2 === 0 ? "white" : "#f9fafb";
                            }}
                          >
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                fontWeight: "500",
                                color: "#111827",
                                verticalAlign: "middle",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.75rem",
                                }}
                              >
                                <div
                                  style={{
                                    width: "2.5rem",
                                    height: "2.5rem",
                                    borderRadius: "50%",
                                    backgroundColor: "#3b82f6",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    flexShrink: 0,
                                  }}
                                >
                                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    minWidth: 0,
                                    flex: 1,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: "600",
                                      color: "#111827",
                                      fontSize: "0.95rem",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {user.name}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      color: "#6b7280",
                                      marginTop: "0.125rem",
                                    }}
                                  >
                                    ID: {user.id?.slice(-8) || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                color: "#374151",
                                verticalAlign: "middle",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <FiMail
                                  style={{
                                    fontSize: "1rem",
                                    color: "#6b7280",
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {user.email}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                color: "#374151",
                                verticalAlign: "middle",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <FiPhone
                                  style={{
                                    fontSize: "1rem",
                                    color: "#6b7280",
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {user.phone || "Chưa có"}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                verticalAlign: "middle",
                              }}
                            >
                              <span
                                style={{
                                  padding: "0.375rem 0.875rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                  display: "inline-block",
                                  whiteSpace: "nowrap",
                                  ...(user.role === "teacher" && {
                                    backgroundColor: "#dbeafe",
                                    color: "#1e40af",
                                  }),
                                  ...(user.role === "student" && {
                                    backgroundColor: "#dcfce7",
                                    color: "#166534",
                                  }),
                                  ...(user.role === "parent" && {
                                    backgroundColor: "#fef3c7",
                                    color: "#92400e",
                                  }),
                                  ...(user.role === "admin" && {
                                    backgroundColor: "#f3e8ff",
                                    color: "#7c3aed",
                                  }),
                                }}
                              >
                                {user.role === "teacher" && "Giáo viên"}
                                {user.role === "student" && "Học sinh"}
                                {user.role === "parent" && "Phụ huynh"}
                                {user.role === "admin" && "Quản trị viên"}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                verticalAlign: "middle",
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "0.375rem",
                                  padding: "0.375rem 0.875rem",
                                  borderRadius: "9999px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  backgroundColor: user.status === "Đang hoạt động" ? "#dcfce7" : "#fee2e2",
                                  color: user.status === "Đang hoạt động" ? "#166534" : "#dc2626",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <div
                                  style={{
                                    width: "0.5rem",
                                    height: "0.5rem",
                                    borderRadius: "50%",
                                    backgroundColor: user.status === "Đang hoạt động" ? "#22c55e" : "#ef4444",
                                  }}
                                ></div>
                                {user.status}
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "1.25rem 1rem",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: "0.5rem",
                                  justifyContent: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  className="btn btn-secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditUser(user);
                                  }}
                                  disabled={loading}
                                  style={{
                                    padding: "0.625rem 0.875rem",
                                    fontSize: "0.75rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                    backgroundColor: "#f3f4f6",
                                    color: "#374151",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "0.375rem",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    opacity: loading ? 0.5 : 1,
                                    fontWeight: "500",
                                    minWidth: "70px",
                                  }}
                                >
                                  <FiEdit style={{ fontSize: "0.875rem" }} />
                                  Sửa
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user.id);
                                  }}
                                  disabled={loading}
                                  style={{
                                    padding: "0.625rem 0.875rem",
                                    fontSize: "0.75rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                    backgroundColor: "#fef2f2",
                                    color: "#dc2626",
                                    border: "1px solid #fecaca",
                                    borderRadius: "0.375rem",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    opacity: loading ? 0.5 : 1,
                                    fontWeight: "500",
                                    minWidth: "70px",
                                  }}
                                >
                                  <FiTrash2 style={{ fontSize: "0.875rem" }} />
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
              {!loading &&
                filteredUsers.length > 0 &&
                pagination.totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1.5rem",
                      padding: "1rem",
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      Hiển thị{" "}
                      {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
                      {Math.min(
                        pagination.currentPage * pagination.limit,
                        pagination.totalUsers
                      )}{" "}
                      trong tổng số {pagination.totalUsers} người dùng
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: prev.currentPage - 1,
                          }))
                        }
                        disabled={pagination.currentPage === 1 || loading}
                        style={{
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          backgroundColor:
                            pagination.currentPage === 1 ? "#f3f4f6" : "white",
                          color:
                            pagination.currentPage === 1
                              ? "#9ca3af"
                              : "#374151",
                          cursor:
                            pagination.currentPage === 1
                              ? "not-allowed"
                              : "pointer",
                          fontSize: "0.875rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Trước
                      </button>

                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() =>
                                  setPagination((prev) => ({
                                    ...prev,
                                    currentPage: pageNum,
                                  }))
                                }
                                disabled={loading}
                                style={{
                                  padding: "0.5rem 0.75rem",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "0.375rem",
                                  backgroundColor:
                                    pagination.currentPage === pageNum
                                      ? "#3b82f6"
                                      : "white",
                                  color:
                                    pagination.currentPage === pageNum
                                      ? "white"
                                      : "#374151",
                                  cursor: "pointer",
                                  fontSize: "0.875rem",
                                  fontWeight: "500",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                        )}
                      </div>

                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: Math.min(
                              prev.currentPage + 1,
                              prev.totalPages
                            ),
                          }))
                        }
                        disabled={
                          loading || pagination.currentPage === pagination.totalPages
                        }
                        style={{
                          padding: "0.5rem 0.75rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          backgroundColor:
                            pagination.currentPage === pagination.totalPages
                              ? "#f3f4f6"
                              : "white",
                          color:
                            pagination.currentPage === pagination.totalPages
                              ? "#9ca3af"
                              : "#374151",
                          cursor:
                            pagination.currentPage === pagination.totalPages
                              ? "not-allowed"
                              : "pointer",
                          fontSize: "0.875rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        Sau
                      </button>
                    </div>
                  </div>
                )}
            </section>
          )}

          {activeTab === "classes" && (
            <section>
              <div
                className="section-header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h2
                  className="section-title"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  <FiBook
                    style={{ marginRight: "0.75rem", color: "#3b82f6" }}
                  />
                  Quản lý lớp học
                </h2>
                <div className="section-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowNewClassModal(true)}
                    disabled={loading}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <FiPlus style={{ fontSize: "1rem" }} />
                    Tạo lớp mới
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="error-message"
                  style={{
                    padding: "1rem",
                    backgroundColor: "#fed7d7",
                    color: "#c53030",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "0.75rem",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                  overflow: "hidden",
                  border: "1px solid #e5e7eb",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  className="section-title"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: 0,
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  <FiBook
                    style={{ marginRight: "0.75rem", color: "#3b82f6" }}
                  />
                  Quản lý lớp học
                </h2>
                <div className="section-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowNewClassModal(true)}
                    disabled={loading}
                    style={{
                      padding: "0.75rem 1.5rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      boxShadow:
                        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <FiPlus style={{ fontSize: "1rem" }} />
                    Tạo lớp mới
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="error-message"
                  style={{
                    padding: "1rem",
                    backgroundColor: "#fed7d7",
                    color: "#c53030",
                    borderRadius: "0.375rem",
                    marginBottom: "1rem",
                  }}
                >
                  {error}
                </div>
              )}

              {loading && (
                <div
                  className="loading-message"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#4a5568",
                  }}
                >
                  Đang tải dữ liệu...
                </div>
              )}

              {!loading && (
                <div
                  className="card-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "1.5rem",
                    padding: "0.5rem 0",
                  }}
                >
                  {classes.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "3rem",
                        color: "#6b7280",
                        backgroundColor: "white",
                        borderRadius: "0.5rem",
                        boxShadow:
                          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                      }}
                    >
                      <FiBook
                        style={{
                          fontSize: "3rem",
                          marginBottom: "1rem",
                          opacity: 0.5,
                        }}
                      />
                      <h3 style={{ marginBottom: "0.5rem", color: "#374151" }}>
                        {error
                          boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          border: "1px solid #e5e7eb",
                          overflow: "hidden",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          className="card-header"
                          style={{
                            padding: "1.5rem 1.5rem 1rem 1.5rem",
                            borderBottom: "1px solid #f3f4f6",
                            backgroundColor: "#f8fafc",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: "0.5rem",
                            }}
                          >
                            <h3
                              style={{
                                margin: 0,
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "#111827",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <FiBook style={{ color: "#3b82f6" }} />
                              {classItem.className}
                            </h3>
                            <span
                              style={{
                                padding: "0.25rem 0.75rem",
                                borderRadius: "9999px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                                ...(classItem.isAvailable
                                  ? {
                                      backgroundColor: "#dcfce7",
                                      color: "#166534",
                                    }
                                  : {
                                      backgroundColor: "#fef3c7",
                                      color: "#92400e",
                                    }),
                              }}
                            >
                              {classItem.status}
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              color: "#6b7280",
                              fontSize: "0.875rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <HiAcademicCap style={{ fontSize: "1rem" }} />
                            Lớp {classItem.grade} - Năm học {classItem.year}
                          </p>
                        </div>

                        <div
                          className="card-content"
                          style={{
                            padding: "1.5rem",
                          }}
                        >
                          <div style={{ display: "grid", gap: "1rem" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <FiUser
                                style={{ color: "#6b7280", fontSize: "1rem" }}
                              />
                              <span
                                style={{ color: "#374151", fontWeight: "500" }}
                              >
                                Giáo viên:
                              </span>
                              <span style={{ color: "#6b7280" }}>
                                {classItem.teacherName}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <FiUsers
                                style={{ color: "#6b7280", fontSize: "1rem" }}
                              />
                              <span
                                style={{ color: "#374151", fontWeight: "500" }}
                              >
                                Học sinh:
                              </span>
                              <span style={{ color: "#6b7280" }}>
                                {classItem.currentStudents}/
                                {classItem.maxStudents}
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  height: "0.5rem",
                                  backgroundColor: "#e5e7eb",
                                  borderRadius: "9999px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    backgroundColor: "#3b82f6",
                                    width: `${
                                      (classItem.currentStudents /
                                        classItem.maxStudents) *
                                      100
                                    }%`,
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                              }}
                            >
                              <BiMoney
                                style={{ color: "#6b7280", fontSize: "1rem" }}
                              />
                              <span
                                style={{ color: "#374151", fontWeight: "500" }}
                              >
                                Học phí/buổi:
                              </span>
                              <span
                                style={{ color: "#059669", fontWeight: "600" }}
                              >
                                {classItem.feePerLesson?.toLocaleString()} VNĐ
                              </span>
                            </div>
                          </div>
                        </div>

                        <div
                          className="card-actions"
                          style={{
                            padding: "1rem 1.5rem",
                            borderTop: "1px solid #f3f4f6",
                            backgroundColor: "#f9fafb",
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            className="btn btn-secondary"
                            onClick={() => handleViewClassDetail(classItem)}
                            disabled={loading}
                            style={{
                              padding: "0.5rem 0.75rem",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
                              border: "1px solid #d1d5db",
                              borderRadius: "0.375rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              opacity: loading ? 0.5 : 1,
                            }}
                          >
                            <FiEye style={{ fontSize: "0.875rem" }} />
                            Chi tiết
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={() => handleEditClass(classItem)}
                            disabled={loading}
                            style={{
                              padding: "0.5rem 0.75rem",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              backgroundColor: "#eff6ff",
                              color: "#1d4ed8",
                              border: "1px solid #bfdbfe",
                              borderRadius: "0.375rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              opacity: loading ? 0.5 : 1,
                            }}
                          >
                            <FiEdit style={{ fontSize: "0.875rem" }} />
                            Sửa
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedClassForAssignment(classItem);
                              loadAvailableTeachers(classItem.id);
                              setShowTeacherSelect(true);
                            }}
                            disabled={loading}
                            style={{
                              padding: "0.5rem 0.75rem",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              backgroundColor: "#e6f3ff",
                              color: "#0066cc",
                              border: "1px solid #b3d9ff",
                              borderRadius: "0.375rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              opacity: loading ? 0.5 : 1,
                            }}
                            title="Phân công giáo viên"
                          >
                            <FiUser style={{ fontSize: "0.875rem" }} />
                            <span style={{ fontSize: "0.75rem" }}>GV</span>
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedClassForAssignment(classItem);
                              loadAvailableStudents(classItem.id);
                              setShowStudentSelect(true);
                            }}
                            disabled={loading}
                            style={{
                              padding: "0.5rem 0.75rem",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              backgroundColor: "#f0fff4",
                              color: "#38a169",
                              border: "1px solid #9ae6b4",
                              borderRadius: "0.375rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              opacity: loading ? 0.5 : 1,
                            }}
                            title="Thêm học sinh"
                          >
                            <FiUsers style={{ fontSize: "0.875rem" }} />
                            <span style={{ fontSize: "0.75rem" }}>HS</span>
                          </button>

                          <button
                            className="action-icon delete"
                            onClick={() => handleDeleteClass(classItem.id)}
                            disabled={loading}
                            title="Xóa"
                            style={{
                              padding: "0.5rem",
                              fontSize: "0.75rem",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "#fef2f2",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "0.375rem",
                              cursor: loading ? "not-allowed" : "pointer",
                              transition: "all 0.2s ease",
                              opacity: loading ? 0.5 : 1,
                              minWidth: "2.5rem",
                              minHeight: "2.5rem",
                            }}
                          >
                            <FiTrash2 style={{ fontSize: "0.875rem" }} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
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
                            value={selectedClass?.className || ""}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Năm học:</label>
                          <input
                            type="text"
                            value={selectedClass?.year || ""}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Khối lớp:</label>
                          <input
                            type="text"
                            value={`Lớp ${selectedClass?.grade || ""}`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Học phí/buổi:</label>
                          <input
                            type="text"
                            value={`${
                              selectedClass?.feePerLesson?.toLocaleString() || 0
                            } VNĐ`}
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Trạng thái:</label>
                          <input
                            type="text"
                            value={selectedClass?.status || "Chưa có thông tin"}
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
                            value={
                              selectedClass?.teacherName || "Chưa phân công"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Email:</label>
                          <input
                            type="email"
                            value={
                              selectedClass?.teacherEmail || "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Số điện thoại:</label>
                          <input
                            type="text"
                            value={
                              selectedClass?.teacherInfo?.phone ||
                              "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Kinh nghiệm:</label>
                          <input
                            type="text"
                            value={
                              selectedClass?.teacherInfo?.experience ||
                              "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Chuyên môn:</label>
                          <input
                            type="text"
                            value={
                              selectedClass?.teacherInfo?.specialty ||
                              "Chưa có thông tin"
                            }
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
                            value={
                              selectedClass?.schedule?.startDate
                                ? new Date(
                                    selectedClass.schedule.startDate
                                  ).toLocaleDateString("vi-VN")
                                : "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Ngày kết thúc:</label>
                          <input
                            type="text"
                            value={
                              selectedClass?.schedule?.endDate
                                ? new Date(
                                    selectedClass.schedule.endDate
                                  ).toLocaleDateString("vi-VN")
                                : "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                        <div className="form-group">
                          <label>Thứ học:</label>
                          <input
                            type="text"
                            value={
                              selectedClass?.schedule?.daysOfLessonInWeek
                                ? selectedClass.schedule.daysOfLessonInWeek
                                    .map((day) => {
                                      const dayNames = {
                                        0: "Chủ nhật",
                                        1: "Thứ 2",
                                        2: "Thứ 3",
                                        3: "Thứ 4",
                                        4: "Thứ 5",
                                        5: "Thứ 6",
                                        6: "Thứ 7",
                                      };
                                      return dayNames[day];
                                    })
                                    .join(", ")
                                : "Chưa có thông tin"
                            }
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="form-section full-width">
                        <div className="section-header">
                          <h4>
                            <i className="fas fa-users"></i>
                            Danh sách học viên (
                            {selectedClass?.currentStudents || 0}/
                            {selectedClass?.maxStudents || 20})
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
                                selectedClass.studentList.map((student) => (
                                  <tr key={student._id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.phoneNumber}</td>
                                    <td>
                                      <span
                                        className={`status-badge ${
                                          student.isActive
                                            ? "success"
                                            : "danger"
                                        }`}
                                      >
                                        {student.isActive
                                          ? "Đang học"
                                          : "Ngừng hoạt động"}
                                      </span>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td
                                    colSpan="4"
                                    style={{
                                      textAlign: "center",
                                      padding: "2rem",
                                      color: "#6b7280",
                                    }}
                                  >
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
                      <div
                        className="loading-message"
                        style={{ padding: "3rem 0" }}
                      >
                        Đang tải thông tin lớp học...
                      </div>
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
                                <option value="Chưa bắt đầu">
                                  Chưa bắt đầu
                                </option>
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
                                Danh sách học viên (
                                {editClassData.currentStudents}/
                                {editClassData.maxStudents})
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
                                    editClassData.students.map((student) => (
                                      <tr key={student.id}>
                                        <td>{student.name}</td>
                                        <td>
                                          <input
                                            type="text"
                                            value={student.attendance}
                                            onChange={(e) => {
                                              const newStudents =
                                                editClassData.students.map(
                                                  (s) =>
                                                    s.id === student.id
                                                      ? {
                                                          ...s,
                                                          attendance:
                                                            e.target.value,
                                                        }
                                                      : s
                                                );
                                              setEditClassData((prev) => ({
                                                ...prev,
                                                students: newStudents,
                                              }));
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <select
                                            value={student.progress}
                                            onChange={(e) => {
                                              const newStudents =
                                                editClassData.students.map(
                                                  (s) =>
                                                    s.id === student.id
                                                      ? {
                                                          ...s,
                                                          progress:
                                                            e.target.value,
                                                        }
                                                      : s
                                                );
                                              setEditClassData((prev) => ({
                                                ...prev,
                                                students: newStudents,
                                              }));
                                            }}
                                          >
                                            <option value="Xuất sắc">
                                              Xuất sắc
                                            </option>
                                            <option value="Tốt">Tốt</option>
                                            <option value="Khá">Khá</option>
                                            <option value="Trung bình">
                                              Trung bình
                                            </option>
                                            <option value="Cần cải thiện">
                                              Cần cải thiện
                                            </option>
                                          </select>
                                        </td>
                                        <td>{student.lastAttendance}</td>
                                        <td>
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "8px",
                                            }}
                                          >
                                            <button
                                              className="action-icon save"
                                              // onClick={() => handleSaveStudentChanges(student.id)}
                                              title="Lưu"
                                              style={{
                                                color: "#38a169",
                                                background: "white",
                                                padding: "4px",
                                                fontSize: "0.875rem",
                                              }}
                                            >
                                              <FiSave
                                                className="icon"
                                                style={{ fontSize: "1.2rem" }}
                                              />
                                            </button>
                                            <button
                                              className="action-icon delete"
                                              onClick={() =>
                                                handleRemoveStudent(student.id)
                                              }
                                              title="Xóa"
                                              style={{
                                                color: "#e53e3e",
                                                background: "white",
                                                padding: "4px",
                                                fontSize: "0.875rem",
                                              }}
                                            >
                                              <FiTrash2
                                                className="icon"
                                                style={{ fontSize: "1.2rem" }}
                                              />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td
                                        colSpan="5"
                                        style={{
                                          textAlign: "center",
                                          padding: "2rem",
                                          color: "#6b7280",
                                        }}
                                      >
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
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateClass();
                      }}
                    >
                      <div className="form-group">
                        <div className="input-with-icon">
                          <FiBook className="icon" />
                          <input
                            type="text"
                            id="className"
                            value={newClass.name}
                            onChange={(e) =>
                              setNewClass({ ...newClass, name: e.target.value })
                            }
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                year: parseInt(e.target.value),
                              })
                            }
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                grade: parseInt(e.target.value),
                              })
                            }
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                feePerLesson: parseInt(e.target.value),
                              })
                            }
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                startDate: e.target.value,
                              })
                            }
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                endDate: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                          }}
                        >
                          {[
                            { value: 1, label: "Chủ nhật" },
                            { value: 2, label: "Thứ 2" },
                            { value: 3, label: "Thứ 3" },
                            { value: 4, label: "Thứ 4" },
                            { value: 5, label: "Thứ 5" },
                            { value: 6, label: "Thứ 6" },
                            { value: 7, label: "Thứ 7" },
                          ].map((day) => (
                            <label
                              key={day.value}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.25rem",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={newClass.daysOfLessonInWeek.includes(
                                  day.value
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewClass({
                                      ...newClass,
                                      daysOfLessonInWeek: [
                                        ...newClass.daysOfLessonInWeek,
                                        day.value,
                                      ],
                                    });
                                  } else {
                                    setNewClass({
                                      ...newClass,
                                      daysOfLessonInWeek:
                                        newClass.daysOfLessonInWeek.filter(
                                          (d) => d !== day.value
                                        ),
                                    });
                                  }
                                }}
                              />
                              <span style={{ fontSize: "0.875rem" }}>
                                {day.label}
                              </span>
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
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                teacherId: e.target.value,
                              })
                            }
                            onFocus={() => loadTeachersForNewClass()}
                          >
                            <option value="">
                              Chọn giáo viên (để trống nếu chưa phân công)
                            </option>
                            {availableTeachers.map((teacher) => (
                              <option key={teacher._id} value={teacher._id}>
                                {teacher.userId?.name || "Chưa có tên"} -{" "}
                                {teacher.specialization || "Chưa có chuyên môn"}
                              </option>
                            ))}
                          </select>
                        </div>
                        <small
                          style={{ color: "#6b7280", fontSize: "0.875rem" }}
                        >
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
                          {loading ? "Đang tạo..." : "Tạo lớp"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "payments" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fas fa-money-bill-wave"></i>
                  Quản lý thanh toán
                </h2>
              </div>
              <table className="data-table payment-table">
                <thead>
                  <tr>
                    <th>Học viên</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.student}</td>
                      <td>{payment.course}</td>
                      <td>{payment.amount} VNĐ</td>
                      <td>{payment.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            payment.status === "Đã thanh toán"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          <i className="fas fa-circle"></i>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {activeTab === "notifications" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdNotifications className="icon" />
                  Quản lý Thông báo
                </h2>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#b30000",
                  fontWeight: 500,
                }}
              >
                Chức năng quản lý thông báo sẽ được phát triển tại đây.
              </div>
            </section>
          )}
          {activeTab === "advertisements" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdCampaign className="icon" />
                  Quản lý Quảng cáo
                </h2>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#b30000",
                  fontWeight: 500,
                }}
              >
                Chức năng quản lý quảng cáo sẽ được phát triển tại đây.
              </div>
            </section>
          )}
          {activeTab === "tuition" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdPayment className="icon" />
                  Quản lý Học phí
                </h2>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Học viên</th>
                    <th>Khóa học</th>
                    <th>Số tiền</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.student}</td>
                      <td>{payment.course}</td>
                      <td>{payment.amount} VNĐ</td>
                      <td>{payment.date}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            payment.status === "Đã thanh toán"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          <i className="fas fa-circle"></i>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {activeTab === "notifications" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdNotifications className="icon" />
                  Quản lý Thông báo
                </h2>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#b30000",
                  fontWeight: 500,
                }}
              >
                Chức năng quản lý thông báo sẽ được phát triển tại đây.
              </div>
            </section>
          )}
          {activeTab === "advertisements" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdCampaign className="icon" />
                  Quản lý Quảng cáo
                </h2>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#b30000",
                  fontWeight: 500,
                }}
              >
                Chức năng quản lý quảng cáo sẽ được phát triển tại đây.
              </div>
            </section>
          )}
          {activeTab === "tuition" && (
            <section>
              <div className="section-header">
                <h2 className="section-title">
                  <MdPayment className="icon" />
                  Quản lý Học phí
                </h2>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#b30000",
                  fontWeight: 500,
                }}
              >
                Chức năng quản lý học phí sẽ được phát triển tại đây.
              </div>
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
              Phân công giáo viên cho lớp:{" "}
              {selectedClassForAssignment.className}
            </h3>

            {loading && (
              <div
                className="loading-message"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#4a5568",
                }}
              >
                Đang tải danh sách giáo viên...
              </div>
            )}

            {!loading && (
              <div className="teacher-list">
                {availableTeachers.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#6b7280",
                    }}
                  >
                    Không có giáo viên khả dụng để phân công
                  </div>
                ) : (
                  <div
                    className="card-grid"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    }}
                  >
                    {availableTeachers.map((teacher) => (
                      <div
                        key={teacher._id}
                        className="card"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-content">
                          <h4>{teacher.userId?.name || "Chưa có tên"}</h4>
                          <p>
                            <strong>Email:</strong>{" "}
                            {teacher.userId?.email || "Chưa có email"}
                          </p>
                          <p>
                            <strong>Chuyên môn:</strong>{" "}
                            {teacher.specialization || "Chưa có thông tin"}
                          </p>
                          <p>
                            <strong>Kinh nghiệm:</strong>{" "}
                            {teacher.experience || 0} năm
                          </p>
                          <p>
                            <strong>Lớp hiện tại:</strong>{" "}
                            {teacher.currentClasses?.length || 0} lớp
                          </p>
                        </div>
                        <div
                          className="card-actions"
                          style={{ padding: "1rem", textAlign: "center" }}
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleAssignTeacher(
                                selectedClassForAssignment.id,
                                teacher._id
                              )
                            }
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
                  setShowTeacherSelect(false);
                  setSelectedClassForAssignment(null);
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
              <div
                className="loading-message"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#4a5568",
                }}
              >
                Đang tải danh sách học sinh...
              </div>
            )}

            {!loading && (
              <div className="student-list">
                {availableStudents.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#6b7280",
                    }}
                  >
                    Không có học sinh khả dụng để thêm vào lớp
                  </div>
                ) : (
                  <div
                    className="card-grid"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    }}
                  >
                    {availableStudents.map((student) => (
                      <div
                        key={student._id}
                        className="card"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-content">
                          <h4>{student.userId?.name || "Chưa có tên"}</h4>
                          <p>
                            <strong>Email:</strong>{" "}
                            {student.userId?.email || "Chưa có email"}
                          </p>
                          <p>
                            <strong>Số điện thoại:</strong>{" "}
                            {student.userId?.phoneNumber ||
                              "Chưa có số điện thoại"}
                          </p>
                          <p>
                            <strong>Lớp hiện tại:</strong>{" "}
                            {student.currentClasses?.length || 0} lớp
                          </p>
                          <p>
                            <strong>Phụ huynh:</strong>{" "}
                            {student.parentId?.name || "Chưa có thông tin"}
                          </p>
                        </div>
                        <div
                          className="card-actions"
                          style={{ padding: "1rem", textAlign: "center" }}
                        >
                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              handleEnrollStudent(
                                selectedClassForAssignment.id,
                                student._id
                              )
                            }
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
                  setShowStudentSelect(false);
                  setSelectedClassForAssignment(null);
                }}
              >
                <FiX className="icon" />
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetail && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUserDetail(false);
              setSelectedUserDetail(null);
              setError("");
            }
          }}
        >
          <div className="user-detail-modal">
            {/* Header */}
            <div className="user-detail-header">
              <button
                className="user-detail-close"
                onClick={() => {
                  setShowUserDetail(false);
                  setSelectedUserDetail(null);
                  setError("");
                }}
              ></button>

              {userDetailLoading ? (
                <div className="user-detail-loading">
                  <div className="loading-spinner"></div>
                  <div className="loading-text">Đang tải thông tin...</div>
                </div>
              ) : selectedUserDetail ? (
                <>
                  <div className="user-detail-avatar">
                    {(
                      selectedUserDetail.name ||
                      selectedUserDetail.userId?.name ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <h2 className="user-detail-name">
                    {selectedUserDetail.name ||
                      selectedUserDetail.userId?.name ||
                      "Chưa có tên"}
                  </h2>
                  <div className="user-detail-role">
                    {(() => {
                      // Lấy role từ nhiều nguồn có thể
                      const userRole =
                        selectedUserDetail.role ||
                        selectedUserDetail.userId?.role ||
                        selectedUserDetail.originalRole ||
                        "";

                      const normalizedRole = userRole.toLowerCase();

                      switch (normalizedRole) {
                        case "teacher":
                          return "Giáo viên";
                        case "student":
                          return "Học viên";
                        case "parent":
                          return "Phụ huynh";
                        case "admin":
                          return "Quản trị viên";
                        default:
                          return userRole
                            ? userRole.charAt(0).toUpperCase() +
                                userRole.slice(1)
                            : "Chưa xác định";
                      }
                    })()}
                  </div>
                </>
              ) : (
                <div className="user-detail-loading">
                  <div className="loading-text">Không thể tải thông tin</div>
                </div>
              )}
            </div>

            {/* Body */}
            {!userDetailLoading && selectedUserDetail && (
              <div className="user-detail-body">
                {/* Basic Information */}
                <div className="user-detail-section">
                  <h3 className="section-title">
                    <FiUser className="icon" />
                    Thông tin cơ bản
                  </h3>

                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">
                      {selectedUserDetail.email ||
                        selectedUserDetail.userId?.email ||
                        "Chưa có email"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Số điện thoại:</span>
                    <span className="info-value">
                      {selectedUserDetail.phone ||
                        selectedUserDetail.phoneNumber ||
                        selectedUserDetail.userId?.phoneNumber ||
                        "Chưa có"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Giới tính:</span>
                    <span className="info-value">
                      {selectedUserDetail.gender ||
                        selectedUserDetail.userId?.gender ||
                        "Chưa có"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">
                      {selectedUserDetail.address ||
                        selectedUserDetail.userId?.address ||
                        "Chưa có"}
                    </span>
                  </div>
                </div>

                {/* Role Specific Information */}
                {(selectedUserDetail.role?.toLowerCase() === "student" ||
                  selectedUserDetail.userId?.role === "student") && (
                  <div className="user-detail-section">
                    <h3 className="section-title">
                      <HiAcademicCap className="icon" />
                      Thông tin học viên
                    </h3>

                    <div className="info-row">
                      <span className="info-label">Lớp học hiện tại:</span>
                      <span className="info-value">
                        {selectedUserDetail.classId?.length ||
                          selectedUserDetail.currentClasses?.length ||
                          0}{" "}
                        lớp
                      </span>
                    </div>

                    {/* Hiển thị danh sách lớp cụ thể cho Student */}
                    {(selectedUserDetail.classId?.length > 0 ||
                      selectedUserDetail.currentClasses?.length > 0) && (
                      <div className="info-row">
                        <span className="info-label">Danh sách lớp:</span>
                        <div className="info-value">
                          {(
                            selectedUserDetail.classId ||
                            selectedUserDetail.currentClasses ||
                            []
                          ).map((cls, index) => (
                            <div
                              key={cls._id || cls.id || index}
                              style={{
                                display: "inline-block",
                                padding: "0.25rem 0.5rem",
                                margin: "0.25rem 0.25rem 0.25rem 0",
                                background: "#e0f2fe",
                                color: "#0c4a6e",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                              }}
                            >
                              {cls.className ||
                                cls.name ||
                                `Lớp ${cls._id || cls.id || index + 1}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="info-row">
                      <span className="info-label">Phụ huynh:</span>
                      <span className="info-value">
                        {selectedUserDetail.parentId?.name ||
                          selectedUserDetail.parentId?.userId?.name ||
                          "Chưa có"}
                      </span>
                    </div>

                    {selectedUserDetail.parentId?.userId?.email && (
                      <div className="info-row">
                        <span className="info-label">Email phụ huynh:</span>
                        <span className="info-value">
                          {selectedUserDetail.parentId.userId.email}
                        </span>
                      </div>
                    )}

                    {selectedUserDetail.parentId?.userId?.phoneNumber && (
                      <div className="info-row">
                        <span className="info-label">SĐT phụ huynh:</span>
                        <span className="info-value">
                          {selectedUserDetail.parentId.userId.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {(selectedUserDetail.role?.toLowerCase() === "teacher" ||
                  selectedUserDetail.userId?.role === "teacher") && (
                  <div className="user-detail-section">
                    <h3 className="section-title">
                      <FiBook className="icon" />
                      Thông tin giáo viên
                    </h3>

                    <div className="info-row">
                      <span className="info-label">Lương mỗi buổi:</span>
                      <span className="info-value">
                        {selectedUserDetail.wagePerLesson
                          ? `${new Intl.NumberFormat("vi-VN").format(
                              selectedUserDetail.wagePerLesson
                            )} VND`
                          : "Chưa thiết lập"}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Số lớp đang dạy:</span>
                      <span className="info-value">
                        {selectedUserDetail.classId?.length ||
                          selectedUserDetail.currentClasses?.length ||
                          0}{" "}
                        lớp
                      </span>
                    </div>

                    {/* Hiển thị danh sách lớp cụ thể */}
                    {(selectedUserDetail.classId?.length > 0 ||
                      selectedUserDetail.currentClasses?.length > 0) && (
                      <div className="info-row">
                        <span className="info-label">Danh sách lớp:</span>
                        <div className="info-value">
                          {(
                            selectedUserDetail.classId ||
                            selectedUserDetail.currentClasses ||
                            []
                          ).map((cls, index) => (
                            <div
                              key={cls._id || cls.id || index}
                              style={{
                                display: "inline-block",
                                padding: "0.25rem 0.5rem",
                                margin: "0.25rem 0.25rem 0.25rem 0",
                                background: "#fef3c7",
                                color: "#92400e",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                              }}
                            >
                              {cls.className ||
                                cls.name ||
                                `Lớp ${cls._id || cls.id || index + 1}`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="info-row">
                      <span className="info-label">Trạng thái:</span>
                      <span className="info-value">
                        {selectedUserDetail.isDeleted
                          ? "Ngừng hoạt động"
                          : "Đang hoạt động"}
                      </span>
                    </div>
                  </div>
                )}

                {(selectedUserDetail.role?.toLowerCase() === "parent" ||
                  selectedUserDetail.userId?.role === "parent") && (
                  <div className="user-detail-section">
                    <h3 className="section-title">
                      <FiUsers className="icon" />
                      Thông tin phụ huynh
                    </h3>

                    <div className="info-row">
                      <span className="info-label">Số con:</span>
                      <span className="info-value">
                        {selectedUserDetail.childId?.length ||
                          selectedUserDetail.studentIds?.length ||
                          selectedUserDetail.children?.length ||
                          0}{" "}
                        học viên
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Xem thông tin GV:</span>
                      <span className="info-value">
                        {selectedUserDetail.canSeeTeacher ? "Có" : "Không"}
                      </span>
                    </div>

                    {(selectedUserDetail.childId?.length > 0 ||
                      selectedUserDetail.studentIds?.length > 0) && (
                      <div className="children-list">
                        <h4
                          style={{
                            margin: "1rem 0 0.5rem 0",
                            fontSize: "0.9rem",
                            color: "#4a5568",
                          }}
                        >
                          Danh sách con:
                        </h4>
                        {(
                          selectedUserDetail.childId ||
                          selectedUserDetail.studentIds ||
                          []
                        ).map((child, index) => (
                          <div key={child._id || index} className="child-item">
                            <div className="child-name">
                              {child.userId?.name ||
                                child.name ||
                                `Học viên ${index + 1}`}
                            </div>
                            <div className="child-details">
                              Email:{" "}
                              {child.userId?.email || child.email || "Chưa có"}{" "}
                              | Giới tính:{" "}
                              {child.userId?.gender ||
                                child.gender ||
                                "Chưa có"}{" "}
                              | Số lớp: {child.classId?.length || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* System Information */}
                <div className="user-detail-section">
                  <h3 className="section-title">
                    <FiBarChart2 className="icon" />
                    Thông tin hệ thống
                  </h3>

                  <div className="info-row">
                    <span className="info-label">ID người dùng:</span>
                    <span
                      className="info-value"
                      style={{ fontFamily: "monospace", fontSize: "0.8rem" }}
                    >
                      {selectedUserDetail._id || selectedUserDetail.id || "N/A"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Ngày tạo:</span>
                    <span className="info-value">
                      {selectedUserDetail.createdAt ||
                      selectedUserDetail.userId?.createdAt
                        ? new Date(
                            selectedUserDetail.createdAt ||
                              selectedUserDetail.userId.createdAt
                          ).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Cập nhật lần cuối:</span>
                    <span className="info-value">
                      {selectedUserDetail.updatedAt ||
                      selectedUserDetail.userId?.updatedAt
                        ? new Date(
                            selectedUserDetail.updatedAt ||
                              selectedUserDetail.userId.updatedAt
                          ).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
