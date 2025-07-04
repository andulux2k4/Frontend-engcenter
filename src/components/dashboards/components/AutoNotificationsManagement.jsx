import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MdNotifications } from "react-icons/md";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import apiService from "../../../services/api";

// Reusable Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  loading = false,
  itemName = "items",
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemName}
      </div>

      <div className="pagination-buttons">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="pagination-button"
        >
          Trang trước
        </button>

        {/* Page numbers */}
        <div className="page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = currentPage - 2 + i;
            }

            return (
              <button
                key={pageToShow}
                onClick={() => onPageChange(pageToShow)}
                disabled={loading}
                className={`page-number ${
                  currentPage === pageToShow ? "active" : ""
                }`}
              >
                {pageToShow}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="pagination-button"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

const AutoNotificationsManagement = ({ user }) => {
  const [autoNotifications, setAutoNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Form state
  const [notificationForm, setNotificationForm] = useState({
    classId: "",
    scheduleType: "daily",
    isActive: true,
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [notificationsPagination, setNotificationsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0,
    limit: 5,
  });

  // Mock auto-notification data (matching API structure)
  const mockAutoNotifications = [
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d0",
      classId: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d1",
        className: "A1 - Sáng",
        grade: "A1",
        schedule: "Monday, Wednesday, Friday - 8:00 AM",
      },
      scheduleType: "daily",
      isActive: true,
      createdBy: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d2",
        name: "Admin User",
        email: "admin@example.com",
      },
      createdAt: "2024-01-15T08:00:00.000Z",
      updatedAt: "2024-01-15T08:00:00.000Z",
      lastRun: "2024-01-15T08:00:00.000Z",
      nextRun: "2024-01-16T08:00:00.000Z",
      totalNotificationsSent: 25,
      lastNotificationResult: {
        success: true,
        sentCount: 5,
        message: "Notifications sent successfully",
      },
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d3",
      classId: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d4",
        className: "B2 - Chiều",
        grade: "B2",
        schedule: "Tuesday, Thursday, Saturday - 2:00 PM",
      },
      scheduleType: "monthly",
      isActive: true,
      createdBy: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d2",
        name: "Admin User",
        email: "admin@example.com",
      },
      createdAt: "2024-01-10T08:00:00.000Z",
      updatedAt: "2024-01-10T08:00:00.000Z",
      lastRun: "2024-01-10T08:00:00.000Z",
      nextRun: "2024-02-10T08:00:00.000Z",
      totalNotificationsSent: 8,
      lastNotificationResult: {
        success: true,
        sentCount: 3,
        message: "Payment notifications sent successfully",
      },
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d5",
      classId: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d6",
        className: "C1 - Tối",
        grade: "C1",
        schedule: "Monday, Wednesday, Friday - 7:00 PM",
      },
      scheduleType: "daily",
      isActive: false,
      createdBy: {
        _id: "64f8a5b2c3d4e5f6a7b8c9d2",
        name: "Admin User",
        email: "admin@example.com",
      },
      createdAt: "2024-01-05T08:00:00.000Z",
      updatedAt: "2024-01-12T08:00:00.000Z",
      lastRun: "2024-01-12T08:00:00.000Z",
      nextRun: null,
      totalNotificationsSent: 15,
      lastNotificationResult: {
        success: false,
        sentCount: 0,
        message: "Auto notification setting is inactive",
      },
    },
  ];

  // Function to normalize API data to match component expectations
  const normalizeNotificationData = (data) => {
    return data.map((item) => ({
      ...item,
      // Map API fields to component expectations
      lastRun: item.lastExecuted || item.lastRun,
      nextRun: item.nextExecution || item.nextRun,
      totalNotificationsSent: item.totalNotificationsSent || 0,
      lastNotificationResult: item.lastNotificationResult || {
        success: true,
        sentCount: 0,
        message: "No previous execution",
      },
      // Ensure classId has schedule if missing
      classId: {
        ...item.classId,
        schedule:
          item.classId.schedule ||
          `Lớp ${item.classId.className} - Grade ${item.classId.grade}`,
      },
    }));
  };

  // Fetch auto-notifications from API
  const fetchAutoNotifications = useCallback(async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await apiService.apiCall(
        "/v1/api/notifications/auto-settings",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.success) {
        const normalizedData = normalizeNotificationData(response.data);
        setAutoNotifications(normalizedData);
      } else {
        setError(response.message || "Không thể tải dữ liệu thông báo tự động");
        // Use mock data as fallback
        setAutoNotifications(mockAutoNotifications);
      }
    } catch (error) {
      console.error("Error fetching auto notifications:", error);
      setError("Lỗi kết nối. Sử dụng dữ liệu mẫu.");
      // Using mock data as fallback
      setAutoNotifications(mockAutoNotifications);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Filter notifications based on status and search term
  const filteredNotifications = useMemo(() => {
    return autoNotifications.filter((notification) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && notification.isActive) ||
        (statusFilter === "inactive" && !notification.isActive);
      const matchesSearch =
        notification.classId.className
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        notification.classId.grade
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [autoNotifications, statusFilter, searchTerm]);

  // Calculate pagination
  useEffect(() => {
    const total = filteredNotifications.length;
    const pages = Math.ceil(total / notificationsPagination.limit) || 1;

    setNotificationsPagination((prev) => ({
      ...prev,
      totalNotifications: total,
      totalPages: pages,
      currentPage: Math.min(prev.currentPage, pages),
    }));
  }, [filteredNotifications, notificationsPagination.limit]); // Fixed dependencies

  // Get paginated notifications
  const paginatedNotifications = useMemo(() => {
    return filteredNotifications.slice(
      (notificationsPagination.currentPage - 1) * notificationsPagination.limit,
      notificationsPagination.currentPage * notificationsPagination.limit
    );
  }, [
    filteredNotifications,
    notificationsPagination.currentPage,
    notificationsPagination.limit,
  ]);

  // Load initial data
  useEffect(() => {
    if (user?.token) {
      fetchAutoNotifications();
    }
  }, [user?.token]); // Only depend on user token

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Helper function to format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // Handle add notification
  const handleAddNotification = () => {
    setNotificationForm({
      classId: "",
      scheduleType: "daily",
      isActive: true,
    });
    setShowAddModal(true);
  };

  // Handle edit notification
  const handleEditNotification = (notification) => {
    setSelectedNotification(notification);
    setNotificationForm({
      classId: notification.classId._id,
      scheduleType: notification.scheduleType,
      isActive: notification.isActive,
    });
    setShowEditModal(true);
  };

  // Handle view notification details
  const handleNotificationRowClick = (notification, e) => {
    // Don't open modal when clicking action buttons
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;

    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  // Handle toggle notification status
  const handleToggleNotificationStatus = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall(
        `/v1/api/notifications/auto-settings/${notificationId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            isActive: !autoNotifications.find((n) => n._id === notificationId)
              ?.isActive,
          }),
        }
      );

      if (response.success) {
        setAutoNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isActive: !notification.isActive }
              : notification
          )
        );
      } else {
        setError(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error toggling notification status:", error);

      // Mock behavior for development
      setAutoNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isActive: !notification.isActive }
            : notification
        )
      );
    }
  };

  // Handle delete notification
  const handleDeleteNotification = async (notificationId) => {
    if (
      window.confirm("Bạn có chắc muốn xóa cấu hình thông báo tự động này?")
    ) {
      try {
        // TODO: Replace with actual API call
        const response = await apiService.apiCall(
          `/v1/api/notifications/auto-settings/${notificationId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.success) {
          setAutoNotifications((prev) =>
            prev.filter((notification) => notification._id !== notificationId)
          );
        } else {
          setError(response.message || "Không thể xóa cấu hình");
        }
      } catch (error) {
        console.error("Error deleting notification:", error);

        // Mock behavior for development
        setAutoNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
      }
    }
  };

  // Handle trigger manual notification
  const handleTriggerNotification = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall(
        `/v1/api/notifications/auto-settings/${notificationId}/trigger`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.success) {
        alert(
          `Thông báo đã được gửi thành công! Đã gửi ${response.data.notificationsSent} thông báo.`
        );
        fetchAutoNotifications(); // Refresh data
      } else {
        setError(response.message || "Không thể kích hoạt thông báo");
      }
    } catch (error) {
      console.error("Error triggering notification:", error);
      alert("Thông báo đã được kích hoạt thành công! (Mock)");
    }
  };

  // Handle form submission for adding notification
  const handleSubmitAddForm = async (e) => {
    e.preventDefault();

    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall(
        "/v1/api/notifications/auto-notifications",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            classId: notificationForm.classId,
            scheduleType: notificationForm.scheduleType,
            isActive: notificationForm.isActive,
          }),
        }
      );

      if (response.success) {
        setAutoNotifications((prev) => [response.data, ...prev]);
        setShowAddModal(false);
      } else {
        setError(response.message || "Không thể tạo cấu hình thông báo");
      }
    } catch (error) {
      console.error("Error adding notification:", error);

      // Mock behavior for development
      setAutoNotifications((prev) => [
        {
          ...notificationForm,
          _id: Date.now().toString(),
          classId: {
            _id: notificationForm.classId,
            className: "Mock Class",
            grade: "A1",
            schedule: "Mock Schedule",
          },
          createdBy: {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastRun: null,
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          totalNotificationsSent: 0,
          lastNotificationResult: null,
        },
        ...prev,
      ]);
      setShowAddModal(false);
    }
  };

  // Handle form submission for editing notification
  const handleSubmitEditForm = async (e) => {
    e.preventDefault();

    if (!selectedNotification) return;

    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall(
        `/v1/api/notifications/auto-settings/${selectedNotification._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            scheduleType: notificationForm.scheduleType,
            isActive: notificationForm.isActive,
          }),
        }
      );

      if (response.success) {
        setAutoNotifications((prev) =>
          prev.map((notification) =>
            notification._id === selectedNotification._id
              ? response.data
              : notification
          )
        );
        setShowEditModal(false);
      } else {
        setError(response.message || "Không thể cập nhật cấu hình thông báo");
      }
    } catch (error) {
      console.error("Error editing notification:", error);

      // Mock behavior for development
      setAutoNotifications((prev) =>
        prev.map((notification) =>
          notification._id === selectedNotification._id
            ? {
                ...notification,
                scheduleType: notificationForm.scheduleType,
                isActive: notificationForm.isActive,
                updatedAt: new Date().toISOString(),
              }
            : notification
        )
      );
      setShowEditModal(false);
    }
  };

  // Helper function to get schedule type display name
  const getScheduleTypeDisplay = (scheduleType) => {
    switch (scheduleType) {
      case "hourly":
        return "Hàng giờ";
      case "daily":
        return "Hàng ngày";
      case "monthly":
        return "Hàng tháng";
      default:
        return scheduleType;
    }
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
          Quản lý Thông báo tự động
        </h2>

        <button
          className="btn btn-primary"
          onClick={handleAddNotification}
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
          Thêm cấu hình mới
        </button>
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
            Trạng thái:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
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
            placeholder="Tìm kiếm theo tên lớp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Auto-Notifications Cards */}
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
        ) : filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Không có cấu hình thông báo tự động nào
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {paginatedNotifications.map((notification) => (
              <div
                key={notification._id}
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
                onClick={(e) => handleNotificationRowClick(notification, e)}
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
                {/* Status indicator strip */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: notification.isActive
                      ? "#22c55e"
                      : "#ef4444",
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
                    {notification.classId.className}
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
                        backgroundColor: notification.isActive
                          ? "#f0fdf4"
                          : "#fef2f2",
                        color: notification.isActive ? "#166534" : "#dc2626",
                      }}
                    >
                      {notification.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: "#f0f9ff",
                        color: "#1e40af",
                      }}
                    >
                      {getScheduleTypeDisplay(notification.scheduleType)}
                    </span>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: "#e0e7ff",
                        color: "#3730a3",
                      }}
                    >
                      {notification.classId.grade}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>Lịch học:</strong> {notification.classId.schedule}
                  </div>
                  <div
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      lineHeight: "1.5",
                      marginTop: "0.5rem",
                    }}
                  >
                    <strong>Tổng thông báo đã gửi:</strong>{" "}
                    {notification.totalNotificationsSent}
                  </div>
                  {notification.lastRun && (
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>Lần chạy cuối:</strong>{" "}
                      {formatDateTime(notification.lastRun)}
                    </div>
                  )}
                  {notification.nextRun && (
                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                        marginTop: "0.5rem",
                      }}
                    >
                      <strong>Lần chạy tiếp theo:</strong>{" "}
                      {formatDateTime(notification.nextRun)}
                    </div>
                  )}
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
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      Tạo: {formatDate(notification.createdAt)}
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
                      onClick={() =>
                        handleTriggerNotification(notification._id)
                      }
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#f0f9ff",
                        color: "#1e40af",
                        border: "1px solid #3b82f6",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      disabled={!notification.isActive}
                      title="Kích hoạt thông báo ngay"
                    >
                      <FiPlay style={{ fontSize: "0.875rem" }} />
                    </button>
                    <button
                      onClick={() => handleEditNotification(notification)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#f3f4f6",
                        color: "#374151",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiEdit style={{ fontSize: "0.875rem" }} />
                    </button>
                    <button
                      onClick={() =>
                        handleToggleNotificationStatus(notification._id)
                      }
                      style={{
                        padding: "0.5rem",
                        backgroundColor: notification.isActive
                          ? "#fef3c7"
                          : "#dcfce7",
                        color: notification.isActive ? "#92400e" : "#166534",
                        border: notification.isActive
                          ? "1px solid #fbbf24"
                          : "1px solid #10b981",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {notification.isActive ? (
                        <FiPause style={{ fontSize: "0.875rem" }} />
                      ) : (
                        <FiPlay style={{ fontSize: "0.875rem" }} />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
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
      {!loading &&
        filteredNotifications.length > 0 &&
        notificationsPagination.totalPages > 1 && (
          <Pagination
            currentPage={notificationsPagination.currentPage}
            totalPages={notificationsPagination.totalPages}
            totalItems={notificationsPagination.totalNotifications}
            limit={notificationsPagination.limit}
            onPageChange={(newPage) =>
              setNotificationsPagination((prev) => ({
                ...prev,
                currentPage: newPage,
              }))
            }
            loading={loading}
            itemName="cấu hình"
          />
        )}

      {/* Auto-Notification Detail Modal */}
      {showDetailModal && selectedNotification && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chi tiết cấu hình thông báo tự động</h3>

            <table className="detail-table">
              <tbody>
                <tr>
                  <td>Lớp học</td>
                  <td>{selectedNotification.classId.className}</td>
                </tr>
                <tr>
                  <td>Trình độ</td>
                  <td>{selectedNotification.classId.grade}</td>
                </tr>
                <tr>
                  <td>Lịch học</td>
                  <td>{selectedNotification.classId.schedule}</td>
                </tr>
                <tr>
                  <td>Loại lịch trình</td>
                  <td>
                    {getScheduleTypeDisplay(selectedNotification.scheduleType)}
                  </td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: selectedNotification.isActive
                          ? "#f0fdf4"
                          : "#fef2f2",
                        color: selectedNotification.isActive
                          ? "#166534"
                          : "#dc2626",
                      }}
                    >
                      {selectedNotification.isActive
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Tổng thông báo đã gửi</td>
                  <td>{selectedNotification.totalNotificationsSent}</td>
                </tr>
                {selectedNotification.lastRun && (
                  <tr>
                    <td>Lần chạy cuối</td>
                    <td>{formatDateTime(selectedNotification.lastRun)}</td>
                  </tr>
                )}
                {selectedNotification.nextRun && (
                  <tr>
                    <td>Lần chạy tiếp theo</td>
                    <td>{formatDateTime(selectedNotification.nextRun)}</td>
                  </tr>
                )}
                {selectedNotification.lastNotificationResult && (
                  <tr>
                    <td>Kết quả lần chạy cuối</td>
                    <td>
                      <div
                        style={{
                          color: selectedNotification.lastNotificationResult
                            .success
                            ? "#166534"
                            : "#dc2626",
                        }}
                      >
                        {selectedNotification.lastNotificationResult.success
                          ? "Thành công"
                          : "Thất bại"}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                        {selectedNotification.lastNotificationResult.message}
                      </div>
                      {selectedNotification.lastNotificationResult.sentCount >
                        0 && (
                        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                          Đã gửi:{" "}
                          {
                            selectedNotification.lastNotificationResult
                              .sentCount
                          }{" "}
                          thông báo
                        </div>
                      )}
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Người tạo</td>
                  <td>
                    {selectedNotification.createdBy.name} (
                    {selectedNotification.createdBy.email})
                  </td>
                </tr>
                <tr>
                  <td>Ngày tạo</td>
                  <td>{formatDateTime(selectedNotification.createdAt)}</td>
                </tr>
                <tr>
                  <td>Ngày cập nhật</td>
                  <td>{formatDateTime(selectedNotification.updatedAt)}</td>
                </tr>
              </tbody>
            </table>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleTriggerNotification(selectedNotification._id)
                }
                disabled={!selectedNotification.isActive}
              >
                <FiPlay className="icon" /> Kích hoạt ngay
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleEditNotification(selectedNotification)}
              >
                <FiEdit className="icon" /> Sửa
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Auto-Notification Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiPlus className="icon" /> Thêm cấu hình thông báo tự động
            </h3>
            <form onSubmit={handleSubmitAddForm}>
              <div className="form-group">
                <label>Lớp học</label>
                <select
                  required
                  value={notificationForm.classId}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      classId: e.target.value,
                    })
                  }
                >
                  <option value="">Chọn lớp học</option>
                  <option value="64f8a5b2c3d4e5f6a7b8c9d1">A1 - Sáng</option>
                  <option value="64f8a5b2c3d4e5f6a7b8c9d4">B2 - Chiều</option>
                  <option value="64f8a5b2c3d4e5f6a7b8c9d6">C1 - Tối</option>
                </select>
              </div>

              <div className="form-group">
                <label>Loại lịch trình</label>
                <select
                  required
                  value={notificationForm.scheduleType}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      scheduleType: e.target.value,
                    })
                  }
                >
                  <option value="hourly">Hàng giờ</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="monthly">Hàng tháng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={notificationForm.isActive}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Auto-Notification Modal */}
      {showEditModal && selectedNotification && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiEdit className="icon" /> Chỉnh sửa cấu hình thông báo tự động
            </h3>
            <form onSubmit={handleSubmitEditForm}>
              <div className="form-group">
                <label>Lớp học</label>
                <input
                  type="text"
                  value={selectedNotification.classId.className}
                  disabled
                  style={{ backgroundColor: "#f9fafb", color: "#6b7280" }}
                />
              </div>

              <div className="form-group">
                <label>Loại lịch trình</label>
                <select
                  required
                  value={notificationForm.scheduleType}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      scheduleType: e.target.value,
                    })
                  }
                >
                  <option value="hourly">Hàng giờ</option>
                  <option value="daily">Hàng ngày</option>
                  <option value="monthly">Hàng tháng</option>
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={notificationForm.isActive}
                  onChange={(e) =>
                    setNotificationForm({
                      ...notificationForm,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AutoNotificationsManagement;
