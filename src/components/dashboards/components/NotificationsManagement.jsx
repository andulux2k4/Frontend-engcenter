import React, { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import { FiPlus, FiTrash2, FiEye, FiX } from "react-icons/fi";
import apiService from "../../../services/api";

const NotificationsManagement = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Form state
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    content: "",
    targetRole: "", // Student, Parent, Teacher, All
    type: "", // General, PaymentReminder, ClassUpdate, Event
    method: "email", // email, web, both
    classId: "",
  });

  // Filter and search
  const [filters, setFilters] = useState({
    type: "",
    targetRole: "",
    createByRole: "",
    search: "",
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Load notifications from API
  const loadNotifications = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const queryFilters = {};

      // Add filters
      if (filters.type) queryFilters.type = filters.type;
      if (filters.targetRole) queryFilters.targetRole = filters.targetRole;
      if (filters.createByRole)
        queryFilters.createByRole = filters.createByRole;
      if (filters.search) queryFilters.search = filters.search;

      const response = await apiService.getNotifications(
        user.token,
        pagination.currentPage,
        pagination.limit,
        queryFilters
      );

      if (response.success && response.data) {
        // Map API response to component state
        const mappedNotifications = response.data.map((notification) => ({
          id: notification._id,
          title: notification.title,
          content: notification.content,
          targetRole: notification.targetRole,
          type: notification.type,
          method: notification.method,
          className: notification.classId?.className || "",
          createdBy: notification.createdBy?.email || "",
          createdByRole: notification.createdByRole,
          isActive: notification.isActive,
          notificationDate: notification.notificationDate,
          createdAt: notification.createdAt,
          updatedAt: notification.updatedAt,
        }));

        setNotifications(mappedNotifications);

        // Update pagination if provided
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            totalPages: response.pagination.totalPages || 1,
            totalItems: response.pagination.totalItems || response.data.length,
          }));
        }
      } else {
        setError(response.message || "Không thể tải danh sách thông báo");
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load notification detail
  const handleViewNotification = async (notificationId) => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      const response = await apiService.getNotificationById(
        user.token,
        notificationId
      );

      if (response.success && response.data) {
        setSelectedNotification({
          id: response.data._id,
          title: response.data.title,
          content: response.data.content,
          targetRole: response.data.targetRole,
          type: response.data.type,
          method: response.data.method,
          className: response.data.classId?.className || "",
          grade: response.data.classId?.grade || "",
          createdBy: response.data.createdBy?.email || "",
          createdByRole: response.data.createdByRole,
          isActive: response.data.isActive,
          notificationDate: response.data.notificationDate,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
        });
        setShowNotificationDetail(true);
      } else {
        setError(response.message || "Không thể tải chi tiết thông báo");
      }
    } catch (error) {
      console.error("Error loading notification detail:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa thông báo này?")) return;
    if (!user?.token) return;

    setLoading(true);

    try {
      const response = await apiService.deleteNotification(
        user.token,
        notificationId
      );

      if (response.success || response.message?.includes("thành công")) {
        // Reload notifications list
        await loadNotifications();
        setShowNotificationDetail(false);
      } else {
        setError(response.message || "Không thể xóa thông báo");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount and when filters/pagination change
  useEffect(() => {
    loadNotifications();
  }, [pagination.currentPage, filters]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get notification type style
  const getTypeStyle = (type) => {
    switch (type) {
      case "PaymentReminder":
        return { backgroundColor: "#fef2f2", color: "#dc2626" };
      case "ClassUpdate":
        return { backgroundColor: "#eff6ff", color: "#2563eb" };
      case "Event":
        return { backgroundColor: "#f0fdf4", color: "#16a34a" };
      case "General":
        return { backgroundColor: "#f3f4f6", color: "#374151" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Get target role style
  const getTargetRoleStyle = (role) => {
    switch (role) {
      case "Parent":
        return { backgroundColor: "#faf5ff", color: "#7c3aed" };
      case "Student":
        return { backgroundColor: "#eff6ff", color: "#2563eb" };
      case "Teacher":
        return { backgroundColor: "#f0fdf4", color: "#16a34a" };
      case "All":
        return { backgroundColor: "#fefce8", color: "#ca8a04" };
      default:
        return { backgroundColor: "#f3f4f6", color: "#374151" };
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle search
  const handleSearchChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
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
          <MdNotifications
            style={{ marginRight: "0.75rem", color: "#3b82f6" }}
          />
          Quản lý Thông báo
        </h2>
        <div className="section-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddNotification(true)}
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
            <FiPlus style={{ fontSize: "1rem" }} />
            Thêm Thông báo
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div
        className="filter-bar"
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        <div className="filter-group" style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Loại thông báo:
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="">Tất cả</option>
            <option value="General">Thông báo chung</option>
            <option value="PaymentReminder">Nhắc nhở thanh toán</option>
            <option value="ClassUpdate">Cập nhật lớp học</option>
            <option value="Event">Sự kiện</option>
          </select>
        </div>

        <div className="filter-group" style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Đối tượng:
          </label>
          <select
            value={filters.targetRole}
            onChange={(e) => handleFilterChange("targetRole", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="">Tất cả</option>
            <option value="Student">Học sinh</option>
            <option value="Parent">Phụ huynh</option>
            <option value="Teacher">Giáo viên</option>
            <option value="All">Tất cả đối tượng</option>
          </select>
        </div>

        <div className="filter-group" style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Tạo bởi:
          </label>
          <select
            value={filters.createByRole}
            onChange={(e) => handleFilterChange("createByRole", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="">Tất cả</option>
            <option value="Admin">Admin</option>
            <option value="Teacher">Giáo viên</option>
          </select>
        </div>

        <div className="search-group" style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Tìm kiếm:
          </label>
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            className="loading-spinner"
            style={{
              width: "2rem",
              height: "2rem",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      )}

      {/* Notifications Cards */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Đang tải dữ liệu...
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Không có thông báo nào
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleViewNotification(notification.id)}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Type indicator strip */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor:
                      notification.type === "General"
                        ? "#3b82f6"
                        : notification.type === "Event"
                        ? "#8b5cf6"
                        : notification.type === "PaymentReminder"
                        ? "#ef4444"
                        : "#22c55e",
                  }}
                ></div>

                {/* Header */}
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#111827",
                      lineHeight: "1.3",
                    }}
                  >
                    {notification.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getTargetRoleStyle(notification.targetRole),
                      }}
                    >
                      {notification.targetRole === "Student"
                        ? "Học sinh"
                        : notification.targetRole === "Parent"
                        ? "Phụ huynh"
                        : notification.targetRole === "Teacher"
                        ? "Giáo viên"
                        : notification.targetRole === "All"
                        ? "Tất cả"
                        : notification.targetRole}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getTypeStyle(notification.type),
                      }}
                    >
                      {notification.type === "General"
                        ? "Thông báo chung"
                        : notification.type === "Event"
                        ? "Sự kiện"
                        : notification.type === "PaymentReminder"
                        ? "Nhắc nhở thanh toán"
                        : notification.type === "ClassUpdate"
                        ? "Cập nhật lớp học"
                        : notification.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div
                  style={{
                    marginBottom: "1rem",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    maxHeight: "4.5rem",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {notification.content}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: "#f0fdf4",
                        color: "#166534",
                      }}
                    >
                      {notification.method}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiTrash2 style={{ fontSize: "0.875rem" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          className="pagination-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            className="pagination-info"
            style={{ fontSize: "0.875rem", color: "#6b7280" }}
          >
            Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
            {Math.min(
              pagination.currentPage * pagination.limit,
              pagination.totalItems
            )}{" "}
            trong tổng số {pagination.totalItems} thông báo
          </div>
          <div
            className="pagination-buttons"
            style={{ display: "flex", gap: "0.5rem" }}
          >
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  pagination.currentPage === 1 ? "#f3f4f6" : "#3b82f6",
                color: pagination.currentPage === 1 ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor:
                  pagination.currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
              }}
            >
              Trang trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    pagination.currentPage === i + 1 ? "#3b82f6" : "#f3f4f6",
                  color: pagination.currentPage === i + 1 ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  pagination.currentPage === pagination.totalPages
                    ? "#f3f4f6"
                    : "#3b82f6",
                color:
                  pagination.currentPage === pagination.totalPages
                    ? "#9ca3af"
                    : "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor:
                  pagination.currentPage === pagination.totalPages
                    ? "not-allowed"
                    : "pointer",
                fontSize: "0.875rem",
              }}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Add Notification Modal */}
      {showAddNotification && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiPlus className="icon" /> Thêm Thông báo mới
            </h3>
            <form onSubmit={handleSubmitAddForm}>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={notificationForm.title}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  required
                  value={notificationForm.content}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      content: e.target.value,
                    })
                  }
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Đối tượng nhận</label>
                <select
                  required
                  value={notificationForm.target}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      target: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn đối tượng</option>
                  <option value="Học sinh">Học sinh</option>
                  <option value="Phụ huynh">Phụ huynh</option>
                  <option value="Giáo viên">Giáo viên</option>
                  <option value="Tất cả">Tất cả</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loại thông báo</label>
                <select
                  required
                  value={notificationForm.type}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn loại</option>
                  <option value="general">Thông báo chung</option>
                  <option value="event">Sự kiện</option>
                  <option value="payment reminder">Nhắc nhở thanh toán</option>
                  <option value="class absence">Nghỉ học</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phương thức gửi</label>
                <div className="radio-group-horizontal">
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="Web"
                      checked={notificationForm.method === "Web"}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          method: e.target.value,
                        })
                      }
                    />
                    Web
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="Email"
                      checked={notificationForm.method === "Email"}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          method: e.target.value,
                        })
                      }
                    />
                    Email
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="method"
                      value="Both"
                      checked={notificationForm.method === "Both"}
                      onChange={(e) =>
                        setNotificationForm({
                          ...notificationForm,
                          method: e.target.value,
                        })
                      }
                    />
                    Cả hai
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Lưu thông báo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddNotification(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {showNotificationDetail && selectedNotification && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowNotificationDetail(false)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                Chi tiết thông báo
              </h3>
              <button
                onClick={() => setShowNotificationDetail(false)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#f3f4f6",
                  color: "#6b7280",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiX style={{ fontSize: "1.25rem" }} />
              </button>
            </div>

            <div className="modal-body">
              <div
                className="notification-detail"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                {/* Title */}
                <div>
                  <h4
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {selectedNotification.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getTargetRoleStyle(selectedNotification.targetRole),
                      }}
                    >
                      {selectedNotification.targetRole === "Student"
                        ? "Học sinh"
                        : selectedNotification.targetRole === "Parent"
                        ? "Phụ huynh"
                        : selectedNotification.targetRole === "Teacher"
                        ? "Giáo viên"
                        : selectedNotification.targetRole === "All"
                        ? "Tất cả"
                        : selectedNotification.targetRole}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        ...getTypeStyle(selectedNotification.type),
                      }}
                    >
                      {selectedNotification.type === "General"
                        ? "Thông báo chung"
                        : selectedNotification.type === "Event"
                        ? "Sự kiện"
                        : selectedNotification.type === "PaymentReminder"
                        ? "Nhắc nhở thanh toán"
                        : selectedNotification.type === "ClassUpdate"
                        ? "Cập nhật lớp học"
                        : selectedNotification.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h5
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Nội dung:
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      lineHeight: "1.6",
                      color: "#6b7280",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {selectedNotification.content}
                  </p>
                </div>

                {/* Class Info */}
                {selectedNotification.className && (
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Lớp học:
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                      }}
                    >
                      {selectedNotification.className}
                      {selectedNotification.grade &&
                        ` - Lớp ${selectedNotification.grade}`}
                    </p>
                  </div>
                )}

                {/* Method */}
                <div>
                  <h5
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Phương thức gửi:
                  </h5>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#f0fdf4",
                      color: "#166534",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {selectedNotification.method}
                  </span>
                </div>

                {/* Created By */}
                <div>
                  <h5
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Người tạo:
                  </h5>
                  <p
                    style={{
                      margin: 0,
                      color: "#6b7280",
                    }}
                  >
                    {selectedNotification.createdBy} (
                    {selectedNotification.createdByRole})
                  </p>
                </div>

                {/* Dates */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Ngày tạo:
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      {formatDate(selectedNotification.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h5
                      style={{
                        margin: 0,
                        marginBottom: "0.5rem",
                        fontSize: "1rem",
                        fontWeight: "500",
                        color: "#374151",
                      }}
                    >
                      Ngày gửi:
                    </h5>
                    <p
                      style={{
                        margin: 0,
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      {formatDate(selectedNotification.notificationDate)}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h5
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "500",
                      color: "#374151",
                    }}
                  >
                    Trạng thái:
                  </h5>
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: selectedNotification.isActive
                        ? "#f0fdf4"
                        : "#fef2f2",
                      color: selectedNotification.isActive
                        ? "#166534"
                        : "#dc2626",
                      borderRadius: "9999px",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    }}
                  >
                    {selectedNotification.isActive
                      ? "Đang hoạt động"
                      : "Ngưng hoạt động"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "2rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  onClick={() =>
                    handleDeleteNotification(selectedNotification.id)
                  }
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiTrash2 style={{ fontSize: "1rem" }} />
                  Xóa thông báo
                </button>
                <button
                  onClick={() => setShowNotificationDetail(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NotificationsManagement;
