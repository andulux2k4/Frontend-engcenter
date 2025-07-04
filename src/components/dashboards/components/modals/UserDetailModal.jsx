import React from "react";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "inactive":
        return "status-inactive";
      case "pending":
        return "status-pending";
      default:
        return "status-default";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "role-admin";
      case "teacher":
        return "role-teacher";
      case "student":
        return "role-student";
      case "parent":
        return "role-parent";
      default:
        return "role-default";
    }
  };

  return (
    <div className="user-detail-modal-overlay" onClick={onClose}>
      <div
        className="user-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="user-detail-modal-header">
          <h2>Chi tiết người dùng</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="user-detail-modal-body">
          <div className="user-avatar-section">
            <div className="user-avatar">
              {user.fullName?.charAt(0)?.toUpperCase() ||
                user.name?.charAt(0)?.toUpperCase() ||
                user.userId?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <h3 className="user-name">
              {user.fullName || user.name || user.userId?.name || "Chưa có tên"}
            </h3>
            <span
              className={`user-role-badge ${getRoleColor(
                user.role || user.originalRole
              )}`}
            >
              {(user.role || user.originalRole)?.toUpperCase()}
            </span>
          </div>

          <div className="user-info-grid">
            <div className="user-info-row">
              <span className="info-label">ID:</span>
              <span className="info-value">{user.id || user._id}</span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {user.email || user.userId?.email || "N/A"}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Số điện thoại:</span>
              <span className="info-value">
                {user.phoneNumber ||
                  user.phone ||
                  user.userId?.phoneNumber ||
                  "N/A"}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Địa chỉ:</span>
              <span className="info-value">
                {user.address || user.userId?.address || "N/A"}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Giới tính:</span>
              <span className="info-value">
                {user.gender || user.userId?.gender || "N/A"}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Trạng thái:</span>
              <span className={`info-value ${getStatusColor(user.status)}`}>
                {user.status?.toLowerCase() === "active" ||
                (!user.isDeleted && !user.status)
                  ? "Đang hoạt động"
                  : "Ngừng hoạt động"}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Ngày tạo:</span>
              <span className="info-value">
                {formatDate(user.createdAt || user.userId?.createdAt)}
              </span>
            </div>
            <div className="user-info-row">
              <span className="info-label">Cập nhật cuối:</span>
              <span className="info-value">
                {formatDate(user.updatedAt || user.userId?.updatedAt)}
              </span>
            </div>
          </div>

          {/* Role-specific information */}
          {(user.role === "teacher" || user.originalRole === "teacher") && (
            <div className="user-info-section">
              <h4 className="section-title">Thông tin giáo viên</h4>
              <div className="user-info-row">
                <span className="info-label">Lương mỗi buổi:</span>
                <span className="info-value">
                  {user.wagePerLesson
                    ? `${new Intl.NumberFormat("vi-VN").format(
                        user.wagePerLesson
                      )} VND`
                    : "Chưa thiết lập"}
                </span>
              </div>
              <div className="user-info-row">
                <span className="info-label">Số lớp đang dạy:</span>
                <span className="info-value">
                  {user.classId?.length || 0} lớp
                </span>
              </div>
            </div>
          )}

          {(user.role === "student" || user.originalRole === "student") && (
            <div className="user-info-section">
              <h4 className="section-title">Thông tin học viên</h4>
              <div className="user-info-row">
                <span className="info-label">Số lớp đang học:</span>
                <span className="info-value">
                  {user.classId?.length || 0} lớp
                </span>
              </div>
              {user.parentId && (
                <div className="user-info-row">
                  <span className="info-label">Phụ huynh:</span>
                  <span className="info-value">
                    {user.parentId.name || user.parentId.userId?.name || "N/A"}
                  </span>
                </div>
              )}
            </div>
          )}

          {(user.role === "parent" || user.originalRole === "parent") && (
            <div className="user-info-section">
              <h4 className="section-title">Thông tin phụ huynh</h4>
              <div className="user-info-row">
                <span className="info-label">Số con:</span>
                <span className="info-value">
                  {user.childId?.length || 0} học viên
                </span>
              </div>
              <div className="user-info-row">
                <span className="info-label">Xem thông tin GV:</span>
                <span className="info-value">
                  {user.canSeeTeacher ? "Có" : "Không"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="user-detail-modal-footer">
          <div className="modal-footer-center">
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
