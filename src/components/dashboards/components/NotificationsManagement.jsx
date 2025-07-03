import React, { useState, useEffect } from "react";
import { MdNotifications } from "react-icons/md";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import apiService from "../../../services/api";

const NotificationsManagement = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [showEditNotification, setShowEditNotification] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);

  // Form state
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    content: "",
    target: "", // Học sinh, Phụ huynh, Giáo viên, Tất cả
    type: "", // general, event, payment reminder, class absence
    method: "Web", // Web, Email, Both
  });

  // Filter and search
  const [notificationFilter, setNotificationFilter] = useState("all"); // type filter
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6); // Cards per page

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      title: "Lịch nghỉ Tết Nguyên Đán 2024",
      content:
        "Trung tâm sẽ nghỉ Tết từ ngày 08/02/2024 đến 14/02/2024. Các lớp học sẽ bắt đầu lại vào ngày 15/02/2024.",
      target: "Tất cả",
      type: "general",
      method: "Both",
      date: "01/02/2024",
    },
    {
      id: 2,
      title: "Kỳ thi IELTS tháng 3/2024",
      content:
        "Kỳ thi IELTS sẽ được tổ chức vào ngày 15/03/2024. Học viên đăng ký trước ngày 01/03/2024 sẽ được giảm 10% phí thi.",
      target: "Học sinh",
      type: "event",
      method: "Both",
      date: "15/02/2024",
    },
    {
      id: 3,
      title: "Nhắc nhở thanh toán học phí",
      content:
        "Vui lòng thanh toán học phí cho khóa học TOEIC tháng 3 trước ngày 05/03/2024.",
      target: "Phụ huynh",
      type: "payment reminder",
      method: "Email",
      date: "01/03/2024",
    },
    {
      id: 4,
      title: "Thông báo vắng mặt",
      content:
        "Giáo viên Sarah Johnson sẽ nghỉ dạy vào ngày 10/03/2024. Lớp IELTS Advanced sẽ được dời sang ngày 12/03/2024.",
      target: "Học sinh",
      type: "class absence",
      method: "Web",
      date: "08/03/2024",
    },
    {
      id: 5,
      title: "Hội thảo về du học",
      content:
        "Trung tâm sẽ tổ chức hội thảo về du học tại Úc và New Zealand vào ngày 20/03/2024. Mời các học viên và phụ huynh quan tâm tham dự.",
      target: "Tất cả",
      type: "event",
      method: "Both",
      date: "10/03/2024",
    },
    {
      id: 6,
      title: "Thay đổi lịch học lớp TOEIC cơ bản",
      content:
        "Từ ngày 01/04/2024, lịch học lớp TOEIC cơ bản sẽ được chuyển từ thứ 2,4,6 sang thứ 3,5,7.",
      target: "Học sinh",
      type: "general",
      method: "Both",
      date: "15/03/2024",
    },
    {
      id: 7,
      title: "Thông báo tuyển dụng giáo viên tiếng Anh",
      content:
        "Trung tâm đang tuyển dụng giáo viên tiếng Anh cho các khóa học IELTS, TOEIC và tiếng Anh cho trẻ em.",
      target: "Giáo viên",
      type: "general",
      method: "Email",
      date: "16/03/2024",
    },
  ];

  // Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call when available
      // const response = await apiService.getNotifications(user.token);
      // if (response.success) {
      //   setNotifications(response.data);
      // } else {
      //   setError(response.message || "Không thể tải thông báo");
      // }

      // Using mock data for now
      setTimeout(() => {
        setNotifications(mockNotifications);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchNotifications();
  }, [user?.token]);

  // Filter notifications based on type and search term
  const filteredNotifications = notifications.filter((notification) => {
    const matchesType =
      notificationFilter === "all" || notification.type === notificationFilter;
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Get paginated notifications
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);

  // Handle pagination change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle adding notification
  const handleAddNotification = () => {
    setNotificationForm({
      title: "",
      content: "",
      target: "",
      type: "",
      method: "Web",
    });
    setShowAddNotification(true);
  };

  // Handle editing notification
  const handleEditNotification = (notification) => {
    setEditingNotification(notification);
    setNotificationForm({
      title: notification.title,
      content: notification.content,
      target: notification.target,
      type: notification.type,
      method: notification.method,
    });
    setShowEditNotification(true);
  };

  // Handle deleting notification
  const handleDeleteNotification = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Handle form submission for adding notification
  const handleSubmitAddForm = (e) => {
    e.preventDefault();

    // Add new notification to the list with a generated ID
    setNotifications((prev) => [
      {
        id: Date.now(),
        title: notificationForm.title,
        content: notificationForm.content,
        target: notificationForm.target,
        type: notificationForm.type,
        method: notificationForm.method,
        date: new Date().toLocaleDateString("vi-VN"),
      },
      ...prev,
    ]);

    setShowAddNotification(false);
  };

  // Handle form submission for editing notification
  const handleSubmitEditForm = (e) => {
    e.preventDefault();

    if (!editingNotification) return;

    // Update the notification in the list
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === editingNotification.id
          ? {
              ...item,
              title: notificationForm.title,
              content: notificationForm.content,
              target: notificationForm.target,
              type: notificationForm.type,
              method: notificationForm.method,
            }
          : item
      )
    );

    setShowEditNotification(false);
  };

  // Get notification type display name
  const getNotificationTypeName = (type) => {
    switch (type) {
      case "general":
        return "Thông báo chung";
      case "event":
        return "Sự kiện";
      case "payment reminder":
        return "Nhắc nhở thanh toán";
      case "class absence":
        return "Nghỉ học";
      default:
        return type;
    }
  };

  // Helper to get notification type badge color
  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "general":
        return { bg: "#f0f9ff", text: "#0369a1" }; // Blue
      case "event":
        return { bg: "#f3e8ff", text: "#7c3aed" }; // Purple
      case "payment reminder":
        return { bg: "#fef3c7", text: "#92400e" }; // Yellow
      case "class absence":
        return { bg: "#fef2f2", text: "#b91c1c" }; // Red
      default:
        return { bg: "#f9fafb", text: "#374151" }; // Gray
    }
  };

  return (
    <section className="notifications-section">
      <div className="section-header">
        <h2 className="section-title">
          <MdNotifications className="icon" />
          Quản lý Thông báo
        </h2>
        <div className="section-actions">
          <button className="btn btn-primary" onClick={handleAddNotification}>
            <FiPlus className="icon" /> Thêm Thông báo
          </button>
        </div>
      </div>

      {/* Filter and search */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Loại thông báo:</label>
          <select
            value={notificationFilter}
            onChange={(e) => setNotificationFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="general">Thông báo chung</option>
            <option value="event">Sự kiện</option>
            <option value="payment reminder">Nhắc nhở thanh toán</option>
            <option value="class absence">Nghỉ học</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Notifications grid */}
      <div className="card-grid">
        {paginatedNotifications.length === 0 ? (
          <div className="empty-state">
            <MdNotifications className="icon" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          paginatedNotifications.map((notification) => {
            const typeColor = getNotificationTypeColor(notification.type);

            return (
              <div className="card notification-card" key={notification.id}>
                <h4>{notification.title}</h4>
                <div className="noti-content">{notification.content}</div>
                <div className="noti-meta">
                  <div className="noti-badges">
                    <span
                      className="noti-badge type"
                      style={{
                        backgroundColor: typeColor.bg,
                        color: typeColor.text,
                        borderColor: typeColor.text,
                      }}
                    >
                      {getNotificationTypeName(notification.type)}
                    </span>
                    <span className="noti-badge method">
                      {notification.method}
                    </span>
                  </div>
                  <div className="noti-info">
                    <span>Gửi đến: {notification.target}</span>
                    <span className="noti-date">{notification.date}</span>
                  </div>
                </div>
                <div className="noti-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditNotification(notification)}
                  >
                    <FiEdit className="icon" /> Sửa
                  </button>
                  <button
                    className="btn btn-danger noti-delete-btn"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <FiTrash2 className="icon" /> Xóa
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Sau
          </button>
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

      {/* Edit Notification Modal */}
      {showEditNotification && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiEdit className="icon" /> Chỉnh sửa Thông báo
            </h3>
            <form onSubmit={handleSubmitEditForm}>
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
                  onClick={() => setShowEditNotification(false)}
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

export default NotificationsManagement;
