// API Configuration
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://english-center-website.onrender.com";

// API Service Class
class ApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    console.log(`🌐 API Call: ${options.method || "GET"} ${url}`);

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Merge options
    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // Log headers (without sensitive info)
    const logHeaders = { ...config.headers };
    if (logHeaders.Authorization) {
      logHeaders.Authorization =
        logHeaders.Authorization.substring(0, 20) + "...";
    }
    console.log("📤 Request headers:", logHeaders);

    try {
      const response = await fetch(url, config);

      console.log(
        `📥 Response status: ${response.status} ${response.statusText}`
      );

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.clone().json();
          console.log("❌ Error response body:", errorData);
          errorMessage += ` - ${errorData.message || errorData.msg || ""}`;
        } catch (e) {
          console.log("❌ Could not parse error response as JSON");
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ API call successful:", result);
      return result;
    } catch (error) {
      console.error("❌ API call failed:", error);
      throw error;
    }
  }

  // ==================== AUTHENTICATION ====================

  async login(email, password) {
    const response = await this.apiCall("/v1/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email, password }).toString(),
    });

    return response;
  }

  async logout(token) {
    return await this.apiCall("/v1/api/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async forgotPassword(email) {
    return await this.apiCall("/v1/api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email }).toString(),
    });
  }

  async verifyResetCode(email, code) {
    return await this.apiCall("/v1/api/verify-reset-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email, code }).toString(),
    });
  }

  async resetPassword(email, code, newPassword, confirmPassword) {
    return await this.apiCall("/v1/api/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email,
        code,
        newPassword,
        confirmPassword,
      }).toString(),
    });
  }

  // ==================== PROFILE MANAGEMENT ====================

  async getProfile(token) {
    return await this.apiCall("/v1/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateProfile(token, profileData) {
    return await this.apiCall("/v1/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(profileData).toString(),
    });
  }

  async changePassword(token, oldPassword, newPassword, confirmPassword) {
    return await this.apiCall("/v1/api/change-password", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        oldPassword,
        newPassword,
        confirmPassword,
      }).toString(),
    });
  }

  // ==================== USER MANAGEMENT ====================

  async getUsers(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/users/?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getUserById(token, userId, role = null, roleId = null) {
    try {
      // For role-based queries, use roleId if provided
      let endpoint = "";
      let targetId = userId; // default fallback

      if (role && roleId) {
        // Use role-specific endpoint with roleId
        targetId = roleId;
        if (role.toLowerCase() === "teacher") {
          endpoint = `/v1/api/teachers/${targetId}`;
        } else if (role.toLowerCase() === "student") {
          endpoint = `/v1/api/students/${targetId}`;
        } else if (role.toLowerCase() === "parent") {
          endpoint = `/v1/api/parents/${targetId}`;
        }
      }

      // If no role-specific endpoint, use general user endpoint
      if (!endpoint) {
        endpoint = `/v1/api/users/${targetId}`;
      }

      console.log(`🔍 Fetching user details from: ${endpoint}`);

      const response = await this.apiCall(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform backend response to match frontend expectations
      if (response.data || response.user) {
        return {
          success: true,
          data: response.data || response.user,
          message: "User details retrieved successfully",
        };
      } else {
        return {
          success: false,
          message: response.msg || "Failed to retrieve user details",
          error: "NO_DATA",
        };
      }
    } catch (error) {
      console.error("Error fetching user details:", error);

      // Only try fallback if we were trying role-specific endpoint
      if (role && roleId && roleId !== userId) {
        try {
          console.log(
            `🔄 Retrying with general users endpoint: /v1/api/users/${userId}`
          );
          const fallbackResponse = await this.apiCall(
            `/v1/api/users/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (fallbackResponse.data || fallbackResponse.user) {
            return {
              success: true,
              data: fallbackResponse.data || fallbackResponse.user,
              message: "User details retrieved using fallback endpoint",
            };
          }
        } catch (fallbackError) {
          console.error("Fallback API call also failed:", fallbackError);
        }
      }

      return {
        success: false,
        message:
          "Cannot retrieve user details. API endpoint may not be available.",
        error: "ENDPOINT_NOT_FOUND",
      };
    }
  }

  async toggleUserStatus(token, userId, isActive) {
    return await this.apiCall(`/v1/api/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ isActive: isActive.toString() }).toString(),
    });
  }

  async createUser(token, userData) {
    try {
      let endpoint = "/v1/api/users";

      // Choose the appropriate endpoint based on role
      if (userData.role) {
        const role = userData.role.toLowerCase();
        if (role === "teacher") {
          endpoint = "/v1/api/teachers";
        } else if (role === "student") {
          endpoint = "/v1/api/students";
        } else if (role === "parent") {
          endpoint = "/v1/api/parents";
        }
      }

      console.log(
        `🔰 Creating user with role: ${userData.role} via endpoint: ${endpoint}`
      );

      const response = await this.apiCall(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Transform backend response to match frontend expectations
      return {
        success: true,
        data: response.data,
        message: response.msg || "User created successfully",
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        success: false,
        message: error.message || "Failed to create user",
        error: error,
      };
    }
  }

  async updateUser(token, userId, updateData, role = null, roleId = null) {
    try {
      // For role-based updates, ONLY use roleId and role-specific endpoints
      // Do not fallback to general user endpoint
      if (role && roleId) {
        role = role.toLowerCase();
        let endpoint = "";

        if (role === "teacher") endpoint = `/v1/api/teachers/${roleId}`;
        else if (role === "parent") endpoint = `/v1/api/parents/${roleId}`;
        else if (role === "student") endpoint = `/v1/api/students/${roleId}`;
        else {
          throw new Error(`Unsupported role for update: ${role}`);
        }

        console.log(`🔄 Updating ${role} via: ${endpoint}`);

        const response = await this.apiCall(endpoint, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        // Transform backend response to match frontend expectations
        return {
          success: true,
          data: response.data,
          message: response.msg || "User updated successfully",
        };
      } else {
        // Fallback to general user endpoint only if no role specified
        const targetId = userId;
        const endpoint = `/v1/api/users/${targetId}`;

        console.log(`🔄 Updating user via general endpoint: ${endpoint}`);

        const response = await this.apiCall(endpoint, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        // Transform backend response to match frontend expectations
        return {
          success: true,
          data: response.data,
          message: response.msg || "User updated successfully",
        };
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return {
        success: false,
        message: error.message || "Failed to update user",
        error: error,
      };
    }
  }

  async deleteUser(token, userId, role = null) {
    // Use role-specific endpoints for deletion
    let endpoint;

    if (role) {
      switch (role.toLowerCase()) {
        case "student":
          endpoint = `/v1/api/students/${userId}`;
          break;
        case "teacher":
          endpoint = `/v1/api/teachers/${userId}`;
          break;
        case "parent":
          endpoint = `/v1/api/parents/${userId}`;
          break;
        case "admin":
          endpoint = `/v1/api/users/${userId}`; // Admin might use the general endpoint
          break;
        default:
          endpoint = `/v1/api/users/${userId}`; // Fallback to general endpoint
      }
    } else {
      endpoint = `/v1/api/users/${userId}`; // Fallback if no role provided
    }

    console.log(`🗑️ Delete API endpoint: DELETE ${endpoint}`);

    return await this.apiCall(endpoint, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== CLASS MANAGEMENT ====================

  async getClassesOverview(token) {
    return await this.apiCall("/v1/api/classes/overview", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createClass(token, classData) {
    return await this.apiCall("/v1/api/classes", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(classData),
    });
  }

  async getClasses(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      summary: "true",
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/classes?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getClassById(token, classId) {
    return await this.apiCall(
      `/v1/api/classes/${classId}?include=attendance,detailed,students,schedule`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async updateClass(token, classId, updateData) {
    return await this.apiCall(`/v1/api/classes/${classId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  }

  async deleteClass(token, classId) {
    return await this.apiCall(`/v1/api/classes/${classId}?hardDelete=false`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAvailableTeachers(token, excludeClassId = null) {
    const queryParams = new URLSearchParams();
    if (excludeClassId) {
      queryParams.append("excludeClassId", excludeClassId);
    }

    const endpoint = `/v1/api/classes/available-teachers${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAvailableStudents(token, excludeClassId = null) {
    const queryParams = new URLSearchParams();
    if (excludeClassId) {
      queryParams.append("excludeClassId", excludeClassId);
    }

    const endpoint = `/v1/api/classes/available-students${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== ATTENDANCE MANAGEMENT ====================

  async createAttendanceSession(token, classId, attendanceData) {
    return await this.apiCall(`/v1/api/attendance/class/${classId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(attendanceData).toString(),
    });
  }

  async getClassAttendance(
    token,
    classId,
    page = 1,
    limit = 10,
    startDate = null,
    endDate = null
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const endpoint = `/v1/api/attendance/class/${classId}?${queryParams}`;

    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async markAttendance(token, attendanceId, attendanceData) {
    return await this.apiCall(`/v1/api/attendance/${attendanceId}/mark`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
    });
  }

  async deleteAttendanceSession(token, attendanceId) {
    return await this.apiCall(`/v1/api/attendance/${attendanceId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== TEACHER MANAGEMENT ====================

  async createTeacher(token, teacherData) {
    return await this.apiCall("/v1/api/teachers/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData),
    });
  }

  async getTeacherById(token, teacherId) {
    return await this.apiCall(`/v1/api/teachers/${teacherId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateTeacher(token, teacherId, updateData) {
    return await this.apiCall(`/v1/api/teachers/${teacherId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  }

  async getTeachers(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/teachers?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async softDeleteTeacher(token, teacherId) {
    return await this.apiCall(`/v1/api/teachers/${teacherId}/soft`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async hardDeleteTeacher(token, teacherId) {
    return await this.apiCall(`/v1/api/teachers/${teacherId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTeacherClasses(token) {
    return await this.apiCall("/v1/api/teachers/classes", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTeacherSchedule(token) {
    return await this.apiCall("/v1/api/teachers/schedule", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== PARENT MANAGEMENT ====================

  async createParent(token, parentData) {
    return await this.apiCall("/v1/api/parents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parentData),
    });
  }

  async getParents(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/parents?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getParentById(token, parentId) {
    return await this.apiCall(`/v1/api/parents/${parentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateParent(token, parentId, updateData) {
    return await this.apiCall(`/v1/api/parents/${parentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  }

  async softDeleteParent(token, parentId) {
    return await this.apiCall(`/v1/api/parents/${parentId}/soft`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async hardDeleteParent(token, parentId) {
    return await this.apiCall(`/v1/api/parents/${parentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getParentChildrenDetails(token, parentId) {
    return await this.apiCall(`/v1/api/parents/${parentId}/children-details`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateParentChildren(token, parentId, action, studentIds) {
    return await this.apiCall(`/v1/api/parents/${parentId}/children`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, studentIds }),
    });
  }

  // ==================== STUDENT MANAGEMENT ====================

  async createStudent(token, studentData) {
    return await this.apiCall("/v1/api/students", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });
  }

  async getStudents(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/students?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getStudentById(token, studentId) {
    return await this.apiCall(`/v1/api/students/${studentId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateStudent(token, studentId, updateData) {
    return await this.apiCall(`/v1/api/students/${studentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  }

  async softDeleteStudent(token, studentId) {
    return await this.apiCall(`/v1/api/students/${studentId}/soft`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async hardDeleteStudent(token, studentId) {
    return await this.apiCall(`/v1/api/students/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getStudentAvailableClasses(
    token,
    studentId,
    grade = null,
    year = null
  ) {
    const queryParams = new URLSearchParams();
    if (grade) queryParams.append("grade", grade);
    if (year) queryParams.append("year", year);

    const endpoint = `/v1/api/students/${studentId}/available-classes${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async enrollStudent(token, studentId, enrollmentData) {
    return await this.apiCall(`/v1/api/students/${studentId}/enroll`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enrollmentData),
    });
  }

  async withdrawStudent(token, studentId, withdrawData) {
    return await this.apiCall(`/v1/api/students/${studentId}/withdraw`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(withdrawData),
    });
  }

  // ==================== PAYMENT MANAGEMENT ====================

  async getUnpaidPayments(token, parentId, month = null, year = null) {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append("month", month);
    if (year) queryParams.append("year", year);

    const endpoint = `/v1/api/parents/${parentId}/unpaid-payments${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;
    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createPaymentRequest(token, parentId, paymentData) {
    const formData = new FormData();
    formData.append("paymentId", paymentData.paymentId);
    formData.append("amount", paymentData.amount);
    if (paymentData.proof) {
      formData.append("proof", paymentData.proof);
    }

    return await this.apiCall(`/v1/api/parents/${parentId}/payment-request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }

  async getAllPaymentRequests(token, page = 1, limit = 10) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    return await this.apiCall(
      `/v1/api/parent-payment-requests?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async getPaymentRequestById(token, requestId) {
    return await this.apiCall(`/v1/api/parent-payment-requests/${requestId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async processPaymentRequest(token, requestId, action) {
    return await this.apiCall(
      `/v1/api/parent-payment-requests/${requestId}/process`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ action }).toString(),
      }
    );
  }

  // ==================== TEACHER WAGE MANAGEMENT ====================

  async getTeacherWages(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/teacher-wages?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async calculateTeacherWages(token, month, year) {
    return await this.apiCall("/v1/api/teacher-wages/calculate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        month: month.toString(),
        year: year.toString(),
      }).toString(),
    });
  }

  async getTeacherWageById(token, teacherWageId) {
    return await this.apiCall(`/v1/api/teacher-wages/${teacherWageId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getTeacherWagesByTeacher(
    token,
    teacherId,
    page = 1,
    limit = 10,
    filters = {}
  ) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(
      `/v1/api/teacher-wages/teacher/${teacherId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  async processTeacherWagePayment(token, teacherWageId, paidAmount) {
    return await this.apiCall(
      `/v1/api/teacher-wages/${teacherWageId}/process`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          paidAmount: paidAmount.toString(),
        }).toString(),
      }
    );
  }

  async updateTeacherWage(token, teacherWageId, updateData) {
    return await this.apiCall(`/v1/api/teacher-wages/${teacherWageId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(updateData).toString(),
    });
  }

  async deleteTeacherWage(token, teacherWageId) {
    return await this.apiCall(`/v1/api/teacher-wages/${teacherWageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== STATISTICS ====================

  async getStatistics(token, filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const endpoint = `/v1/api/statistics${
      queryParams.toString() ? `?${queryParams}` : ""
    }`;

    return await this.apiCall(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== ADVERTISEMENTS ====================

  async getPublicAdvertisements() {
    return await this.apiCall("/v1/api/advertisements/public", {
      method: "GET",
    });
  }

  async createAdvertisement(token, advertisementData) {
    const formData = new FormData();
    formData.append("title", advertisementData.title);
    formData.append("content", advertisementData.content);
    formData.append("startDate", advertisementData.startDate);
    formData.append("endDate", advertisementData.endDate);
    if (advertisementData.images) {
      advertisementData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    return await this.apiCall("/v1/api/advertisements", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }

  async getAdvertisements(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/advertisements?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getAdvertisementById(token, advertisementId) {
    return await this.apiCall(`/v1/api/advertisements/${advertisementId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async updateAdvertisement(token, advertisementId, updateData) {
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== "") {
        formData.append(key, updateData[key]);
      }
    });

    return await this.apiCall(`/v1/api/advertisements/${advertisementId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }

  async deleteAdvertisement(token, advertisementId) {
    return await this.apiCall(`/v1/api/advertisements/${advertisementId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // ==================== NOTIFICATIONS ====================

  async createNotification(token, notificationData) {
    return await this.apiCall("/v1/api/notifications", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });
  }

  async getNotifications(token, page = 1, limit = 10, filters = {}) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    return await this.apiCall(`/v1/api/notifications?${queryParams}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getNotificationById(token, notificationId) {
    return await this.apiCall(`/v1/api/notifications/${notificationId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteNotification(token, notificationId) {
    return await this.apiCall(`/v1/api/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async setupAutoNotification(token, autoNotificationData) {
    return await this.apiCall("/v1/api/notifications/auto-notifications", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(autoNotificationData).toString(),
    });
  }

  // ==================== UTILITY METHODS ====================

  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/v1/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: response.ok,
        status: response.status,
        message: response.ok ? "Connection successful" : "Connection failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Connection failed",
      };
    }
  }

  // Token management
  setToken(token) {
    localStorage.setItem("authToken", token);
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  removeToken() {
    localStorage.removeItem("authToken");
  }

  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT validation - check if token exists and has 3 parts
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;

      // Check if token is expired (if exp field exists)
      if (payload.exp && payload.exp < currentTime) {
        this.removeToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      this.removeToken();
      return false;
    }
  }

  async ensureAuthentication() {
    if (!this.isTokenValid()) {
      throw new Error("Authentication required");
    }

    const token = this.getToken();
    if (!token) {
      throw new Error("No token available");
    }

    return token;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
