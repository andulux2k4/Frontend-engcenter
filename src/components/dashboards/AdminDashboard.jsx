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
} from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi";
import { RiDashboardLine } from "react-icons/ri";
import { MdNotifications, MdCampaign, MdPayment } from "react-icons/md";
import apiService from "../../services/api";

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [showClassDetail, setShowClassDetail] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [editClassData, setEditClassData] = useState(null);
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

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "classes") {
      loadClasses();
    } else {
      // Clear error when switching away from data tabs
      setError("");
    }
  }, [activeTab, pagination.currentPage, selectedRole]);

  const loadUsers = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const filters = {};
      if (selectedRole !== "all") {
        filters.role =
          selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1);
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
        const mappedUsers = response.data.map((user) => ({
          id: user._id || user.id,
          // Use roleId from backend if available, otherwise fallback to _id
          roleId: user.roleId || user._id || user.id,
          name: user.name || user.userId?.name || "Chưa có tên",
          email: user.email || user.userId?.email || "Chưa có email",
          phone:
            user.phoneNumber ||
            user.phone ||
            user.userId?.phoneNumber ||
            "Chưa có",
          role: (user.role || "unknown").toLowerCase(),
          status: user.isActive ? "Đang hoạt động" : "Tạm nghỉ",
          gender: user.gender || "",
          address: user.address || "",
          // Role-specific data
          parentId: user.parentId || null,
          classId: user.classId || null,
          childId: user.childId || [],
          canSeeTeacher: user.canSeeTeacher || false,
          wagePerLesson: user.wagePerLesson || 0,
        }));

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
      // Add filters if needed

      const response = await apiService.getClasses(user.token, 1, 100, filters);

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
      // Học viên mẫu
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
        status: "Tạm nghỉ",
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

  const handleAddUser = () => {
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
    });
    setEditingUser(null);
    setError(""); // Clear any previous errors
    setShowAddUserForm(true);
  };

  // Fetch detailed user info for editing
  const handleEditUser = async (userSummary) => {
    if (!user?.token) return;

    setLoading(true);
    setEditingUser(userSummary); // Set tạm thời để hiển thị modal
    setShowAddUserForm(true);

    try {
      // Gọi API để lấy thông tin chi tiết của user
      const response = await apiService.getUserById(
        user.token,
        userSummary.id,
        userSummary.role,
        userSummary.roleId // Truyền roleId nếu có
      );

      if (response.success && response.data) {
        // Cập nhật form data với thông tin chi tiết từ API
        setFormData({
          id: response.data.id || response.data._id || userSummary.id,
          name:
            response.data.name ||
            response.data.userId?.name ||
            userSummary.name ||
            "",
          email:
            response.data.email ||
            response.data.userId?.email ||
            userSummary.email ||
            "",
          phone:
            response.data.phone ||
            response.data.phoneNumber ||
            response.data.userId?.phoneNumber ||
            userSummary.phone ||
            "",
          role:
            (response.data.role || userSummary.role || "")
              .charAt(0)
              .toUpperCase() +
            (response.data.role || userSummary.role || "")
              .slice(1)
              .toLowerCase(),
          gender: response.data.gender || userSummary.gender || "",
          address: response.data.address || userSummary.address || "",
          passwordBeforeHash: "", // Không lấy password từ API
          classIds:
            response.data.classIds || response.data.currentClasses || [],
          studentIds: response.data.studentIds || response.data.children || [],
          parentId: response.data.parentId || "",
          canViewTeacher:
            response.data.canViewTeacher ||
            response.data.canSeeTeacher ||
            false,
        });
        // Preserve roleId from userSummary in editingUser
        setEditingUser({
          ...response.data,
          roleId: userSummary.roleId,
          id: userSummary.id,
        });
        setError(""); // Clear any previous errors
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
          phone: formData.phone,
          role: formData.role,
          gender: formData.gender,
          address: formData.address,
          canViewTeacher: formData.canViewTeacher,
        };

        // Convert User IDs to Role IDs for relationships
        if (formData.classIds && formData.classIds.length > 0) {
          updateData.classIds = formData.classIds; // Class IDs should be correct already
        }

        if (formData.studentIds && formData.studentIds.length > 0) {
          // Convert User IDs to Student Role IDs
          const studentRoleIds = formData.studentIds.map((userId) => {
            const student = students.find((s) => s.id === userId);
            console.log(
              `Converting student ${userId} to roleId:`,
              student?.roleId
            );
            return student ? student.roleId : userId;
          });
          updateData.studentIds = studentRoleIds;
          console.log(
            "📋 Student IDs converted:",
            formData.studentIds,
            "→",
            studentRoleIds
          );
        }

        if (formData.parentId) {
          // Convert User ID to Parent Role ID
          const parent = parents.find((p) => p.id === formData.parentId);
          console.log(
            `Converting parent ${formData.parentId} to roleId:`,
            parent?.roleId
          );
          updateData.parentId = parent ? parent.roleId : formData.parentId;
          console.log(
            "👨‍👩‍👧‍👦 Parent ID converted:",
            formData.parentId,
            "→",
            updateData.parentId
          );
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

        // Convert User IDs to Role IDs for relationships
        if (createData.studentIds && createData.studentIds.length > 0) {
          const studentRoleIds = createData.studentIds.map((userId) => {
            const student = students.find((s) => s.id === userId);
            console.log(
              `Converting student ${userId} to roleId:`,
              student?.roleId
            );
            return student ? student.roleId : userId;
          });
          createData.studentIds = studentRoleIds;
          console.log(
            "📋 Student IDs converted for new user:",
            formData.studentIds,
            "→",
            studentRoleIds
          );
        }

        if (createData.parentId) {
          const parent = parents.find((p) => p.id === createData.parentId);
          console.log(
            `Converting parent ${createData.parentId} to roleId:`,
            parent?.roleId
          );
          createData.parentId = parent ? parent.roleId : createData.parentId;
          console.log(
            "👨‍👩‍👧‍👦 Parent ID converted for new user:",
            formData.parentId,
            "→",
            createData.parentId
          );
        }

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
    if (window.confirm("Bạn có chắc chắn muốn xóa học viên này khỏi lớp?")) {
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
  //   alert('Đã lưu thay đổi cho học viên!');
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
        setParents(mappedParents);
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
      currentPage: 1 
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
            phone: user.phoneNumber || user.phone || user.userId?.phoneNumber || "Chưa có",
            role: (user.role || "unknown").toLowerCase(),
            status: user.isActive ? "Đang hoạt động" : "Tạm nghỉ",
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
              totalUsers: response.pagination.totalItems || response.data.length,
              limit: pagination.limit,
            });
          }
          
          console.log(`✅ Loaded ${mappedUsers.length} users for role: ${newRole}`);
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
        <h1>
          <FiUser className="icon" />
          Quản trị viên
        </h1>
        <div className="user-info">
          <span>Xin chào, {user?.name}</span>
          <button onClick={onLogout} className="logout-btn">
            <FiLogOut className="icon" style={{ marginRight: "0.5rem" }} />
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <aside className="sidebar">
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
                      Tổng số học viên
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
                      Học viên đang theo học
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
                  <option value="student">Học viên</option>
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
                <div className="modal">
                  <div className="modal-content">
                    <h3>
                      <FiEdit className="icon" />
                      {editingUser
                        ? `Chỉnh sửa User: ${editingUser.name || ""}`
                        : "Thêm User mới"}
                    </h3>
                    {loading && editingUser ? (
                      <div
                        className="loading-message"
                        style={{ padding: "3rem 0" }}
                      >
                        Đang tải thông tin...
                      </div>
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
                            <small
                              style={{ color: "#6b7280", fontSize: "0.875rem" }}
                            >
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
                        {formData.role === "Student" && (
                          <>
                            <div className="form-group">
                              <div className="input-with-icon">
                                <FiUser className="icon" />
                                <select
                                  id="parentId"
                                  name="parentId"
                                  value={formData.parentId}
                                  onChange={handleInputChange}
                                >
                                  <option value="">Chọn phụ huynh</option>
                                  {parents.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.name} (ID: {p.id.slice(-6)})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="input-with-icon">
                                <HiAcademicCap className="icon" />
                                <select
                                  onChange={(e) =>
                                    handleClassSelect(e.target.value)
                                  }
                                  value=""
                                >
                                  <option value="">Chọn lớp học để thêm</option>
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
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="multi-select-container">
                                {formData.classIds.map((id) => {
                                  const classItem = allClasses.find(
                                    (c) => c.id === id
                                  );
                                  return classItem ? (
                                    <div
                                      key={id}
                                      className="selected-item-badge"
                                    >
                                      <span>{classItem.className}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveClass(id)}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </>
                        )}

                        {formData.role === "Parent" && (
                          <>
                            <div className="form-group">
                              <div className="input-with-icon">
                                <FiUsers className="icon" />
                                <select
                                  onChange={(e) =>
                                    handleStudentSelect(e.target.value)
                                  }
                                  value=""
                                >
                                  <option value="">
                                    Chọn học viên để thêm
                                  </option>
                                  {students
                                    .filter(
                                      (s) => !formData.studentIds.includes(s.id)
                                    )
                                    .map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {s.name} (ID: {s.id.slice(-6)})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="multi-select-container">
                                {formData.studentIds.map((id) => {
                                  const student = students.find(
                                    (s) => s.id === id
                                  );
                                  return student ? (
                                    <div
                                      key={id}
                                      className="selected-item-badge"
                                    >
                                      <span>{student.name}</span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRemoveStudentFromParent(id)
                                        }
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <div className="form-group">
                              <label
                                style={{
                                  marginBottom: 0,
                                  marginRight: "1.5rem",
                                }}
                              >
                                Quyền xem giáo viên:
                              </label>
                              <div className="radio-group radio-group-horizontal">
                                <label>
                                  <input
                                    type="radio"
                                    name="canViewTeacher"
                                    value="true"
                                    checked={formData.canViewTeacher === true}
                                    onChange={handleInputChange}
                                  />
                                  Có
                                </label>
                                <label>
                                  <input
                                    type="radio"
                                    name="canViewTeacher"
                                    value="false"
                                    checked={formData.canViewTeacher === false}
                                    onChange={handleInputChange}
                                  />
                                  Không
                                </label>
                              </div>
                            </div>
                          </>
                        )}

                        {formData.role === "Teacher" && (
                          <>
                            <div className="form-group">
                              <div className="input-with-icon">
                                <HiAcademicCap className="icon" />
                                <select
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
                              </div>
                            </div>
                            <div className="form-group">
                              <div className="multi-select-container">
                                {formData.classIds.map((id) => {
                                  const classItem = allClasses.find(
                                    (c) => c.id === id
                                  );
                                  return classItem ? (
                                    <div
                                      key={id}
                                      className="selected-item-badge"
                                    >
                                      <span>{classItem.className}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveClass(id)}
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          </>
                        )}

                        <div
                          className="form-actions"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "0.75rem",
                          }}
                        >
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              minWidth: "130px",
                              display: "inline-flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "0.4rem",
                              padding: "0.5rem 1rem",
                            }}
                          >
                            <FiSave
                              style={{ fontSize: "1rem", flexShrink: 0 }}
                            />
                            <span>{editingUser ? "Cập nhật" : "Thêm mới"}</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                              setShowAddUserForm(false);
                              setEditingUser(null);
                            }}
                            style={{
                              width: "130px",
                              display: "inline-flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <FiX style={{ fontSize: "1rem", flexShrink: 0 }} />
                            <span style={{ flex: 1, textAlign: "center" }}>
                              Hủy Bỏ
                            </span>
                          </button>
                        </div>
                      </form>
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
                            style={{
                              backgroundColor:
                                index % 2 === 0 ? "white" : "#f9fafb",
                              borderBottom: "1px solid #f3f4f6",
                              transition: "background-color 0.2s ease",
                              minHeight: "80px",
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
                                {user.role === "student" && "Học viên"}
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
                                  backgroundColor: "#dcfce7",
                                  color: "#166534",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                <div
                                  style={{
                                    width: "0.5rem",
                                    height: "0.5rem",
                                    borderRadius: "50%",
                                    backgroundColor: "#22c55e",
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
                                  onClick={() => handleEditUser(user)}
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
                                  onClick={() => handleDeleteUser(user.id)}
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
                                  cursor: loading ? "not-allowed" : "pointer",
                                  fontSize: "0.875rem",
                                  transition: "all 0.2s ease",
                                  minWidth: "2.5rem",
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
                            currentPage: prev.currentPage + 1,
                          }))
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages ||
                          loading
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
                        gridColumn: "1 / -1",
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
                          ? "Có lỗi xảy ra khi tải dữ liệu"
                          : "Chưa có lớp học nào"}
                      </h3>
                      <p style={{ color: "#6b7280" }}>
                        {error
                          ? "Vui lòng thử lại sau"
                          : "Hãy tạo lớp học đầu tiên để bắt đầu"}
                      </p>
                    </div>
                  ) : (
                    classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="card"
                        style={{
                          backgroundColor: "white",
                          borderRadius: "0.75rem",
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
                                Học viên:
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
                                            : "warning"
                                        }`}
                                      >
                                        {student.isActive
                                          ? "Đang học"
                                          : "Tạm nghỉ"}
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
    </div>
  );
}

export default AdminDashboard;
