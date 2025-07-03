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
                          {child.userId?.email || child.email || "Chưa có"} |
                          Giới tính:{" "}
                          {child.userId?.gender || child.gender || "Chưa có"} |
                          Số lớp: {child.classId?.length || 0}
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
  );
}

export default UserDetailModal;
