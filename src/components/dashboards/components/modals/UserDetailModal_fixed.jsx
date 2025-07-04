import React from "react";
import { FiUser, FiBook, FiUsers, FiBarChart2 } from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";

function UserDetailModal({
  showUserDetail,
  userDetailLoading,
  selectedUserDetail,
  setShowUserDetail,
  setSelectedUserDetail,
  setError,
}) {
  if (!showUserDetail) {
    return null;
  }

  return (
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
                        ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
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
                    selectedUserDetail.userId?.phone ||
                    "Chưa có số điện thoại"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Giới tính:</span>
                <span className="info-value">
                  {selectedUserDetail.gender === "male"
                    ? "Nam"
                    : selectedUserDetail.gender === "female"
                    ? "Nữ"
                    : "Chưa xác định"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Địa chỉ:</span>
                <span className="info-value">
                  {selectedUserDetail.address ||
                    selectedUserDetail.userId?.address ||
                    "Chưa có địa chỉ"}
                </span>
              </div>
            </div>

            {/* Role-specific Information */}
            {selectedUserDetail.role === "teacher" && (
              <div className="user-detail-section">
                <h3 className="section-title">
                  <HiAcademicCap className="icon" />
                  Thông tin giáo viên
                </h3>

                {selectedUserDetail.teacherInfo && (
                  <>
                    <div className="info-row">
                      <span className="info-label">Môn dạy:</span>
                      <span className="info-value">
                        {selectedUserDetail.teacherInfo.subject ||
                          "Chưa xác định"}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Kinh nghiệm:</span>
                      <span className="info-value">
                        {selectedUserDetail.teacherInfo.experience ||
                          "Chưa có thông tin"}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="info-label">Lương/buổi:</span>
                      <span className="info-value">
                        {selectedUserDetail.teacherInfo.salary
                          ? `${selectedUserDetail.teacherInfo.salary.toLocaleString()} VND`
                          : "Chưa xác định"}
                      </span>
                    </div>
                  </>
                )}

                {selectedUserDetail.classes &&
                  selectedUserDetail.classes.length > 0 && (
                    <div className="info-row">
                      <span className="info-label">Lớp đang dạy:</span>
                      <span className="info-value">
                        {selectedUserDetail.classes
                          .map((cls) => cls.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            )}

            {selectedUserDetail.role === "student" && (
              <div className="user-detail-section">
                <h3 className="section-title">
                  <FiBook className="icon" />
                  Thông tin học viên
                </h3>

                <div className="info-row">
                  <span className="info-label">Mã học viên:</span>
                  <span className="info-value">
                    {selectedUserDetail.studentCode ||
                      selectedUserDetail.userId?.studentCode ||
                      "Chưa có mã"}
                  </span>
                </div>

                <div className="info-row">
                  <span className="info-label">Ngày sinh:</span>
                  <span className="info-value">
                    {selectedUserDetail.dateOfBirth ||
                      selectedUserDetail.userId?.dateOfBirth ||
                      "Chưa có thông tin"}
                  </span>
                </div>

                {selectedUserDetail.classes &&
                  selectedUserDetail.classes.length > 0 && (
                    <div className="info-row">
                      <span className="info-label">Lớp đang học:</span>
                      <span className="info-value">
                        {selectedUserDetail.classes
                          .map((cls) => cls.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            )}

            {selectedUserDetail.role === "parent" && (
              <div className="user-detail-section">
                <h3 className="section-title">
                  <FiUsers className="icon" />
                  Thông tin phụ huynh
                </h3>

                <div className="info-row">
                  <span className="info-label">Nghề nghiệp:</span>
                  <span className="info-value">
                    {selectedUserDetail.occupation ||
                      selectedUserDetail.userId?.occupation ||
                      "Chưa có thông tin"}
                  </span>
                </div>

                {selectedUserDetail.children &&
                  selectedUserDetail.children.length > 0 && (
                    <div className="info-row">
                      <span className="info-label">Con em:</span>
                      <span className="info-value">
                        {selectedUserDetail.children
                          .map((child) => child.name || child.userId?.name)
                          .filter(Boolean)
                          .join(", ") || "Chưa có thông tin"}
                      </span>
                    </div>
                  )}
              </div>
            )}

            {/* Statistics */}
            <div className="user-detail-section">
              <h3 className="section-title">
                <FiBarChart2 className="icon" />
                Thống kê
              </h3>

              <div className="info-row">
                <span className="info-label">Ngày tạo:</span>
                <span className="info-value">
                  {selectedUserDetail.createdAt
                    ? new Date(selectedUserDetail.createdAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa có thông tin"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Lần cập nhật cuối:</span>
                <span className="info-value">
                  {selectedUserDetail.updatedAt
                    ? new Date(selectedUserDetail.updatedAt).toLocaleDateString(
                        "vi-VN"
                      )
                    : "Chưa có thông tin"}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Trạng thái:</span>
                <span className="info-value">
                  {selectedUserDetail.isActive
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDetailModal;
