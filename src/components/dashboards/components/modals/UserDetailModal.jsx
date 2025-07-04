import React from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiInfo,
} from "react-icons/fi";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  // Get user display name
  const getUserName = () => {
    return user.fullName || user.name || user.userId?.name || "Người dùng";
  };

  // Get user email
  const getUserEmail = () => {
    return user.email || user.userId?.email || "Chưa có email";
  };

  // Get user phone
  const getUserPhone = () => {
    return (
      user.phoneNumber ||
      user.phone ||
      user.userId?.phoneNumber ||
      "Chưa có số điện thoại"
    );
  };

  // Get user address
  const getUserAddress = () => {
    return user.address || user.userId?.address || "Chưa có địa chỉ";
  };

  // Get user gender
  const getUserGender = () => {
    const gender = (user.gender || user.userId?.gender)?.toLowerCase();
    switch (gender) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa có thông tin";
    }
  };

  // Get user role
  const getUserRole = () => {
    const role = (user.role || user.originalRole)?.toLowerCase();
    switch (role) {
      case "admin":
        return { label: "Quản trị viên", color: "#f59e0b" };
      case "teacher":
        return { label: "Giáo viên", color: "#3b82f6" };
      case "student":
        return { label: "Học sinh", color: "#10b981" };
      case "parent":
        return { label: "Phụ huynh", color: "#ec4899" };
      default:
        return { label: "Người dùng", color: "#6b7280" };
    }
  };

  // Get user status
  const getUserStatus = () => {
    if (user.isDisabled) {
      return { label: "Đã vô hiệu hóa", color: "#ef4444" };
    }

    if (
      user.status?.toLowerCase() === "active" ||
      (!user.isDeleted && !user.status)
    ) {
      return { label: "Đang hoạt động", color: "#10b981" };
    }

    return { label: "Ngừng hoạt động", color: "#ef4444" };
  };

  // Get avatar letter
  const getAvatarLetter = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const roleInfo = getUserRole();
  const statusInfo = getUserStatus();

  return (
    <div
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
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#1f2937",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FiUser />
            Chi tiết người dùng
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              color: "#6b7280",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiX />
          </button>
        </div>

        {/* Disabled User Warning */}
        {user.isDisabled && (
          <div
            style={{
              margin: "1rem",
              padding: "1rem",
              backgroundColor: "#fef3c7",
              border: "1px solid #f59e0b",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "#92400e",
                  marginBottom: "0.25rem",
                }}
              >
                Tài khoản đã bị vô hiệu hóa
              </div>
              <div style={{ fontSize: "0.875rem", color: "#78350f" }}>
                Người dùng này không thể truy cập hệ thống.
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div
          style={{
            padding: "1.5rem",
            flex: 1,
            overflowY: "auto",
          }}
        >
          {/* Avatar and Basic Info */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
              paddingBottom: "1.5rem",
              borderBottom: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: roleInfo.color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: "600",
                margin: "0 auto 1rem",
              }}
            >
              {getAvatarLetter()}
            </div>

            <h3
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {getUserName()}
              {user.isDisabled && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.75rem",
                    backgroundColor: "#fca5a5",
                    color: "#991b1b",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "9999px",
                    fontWeight: "500",
                  }}
                >
                  Vô hiệu hóa
                </span>
              )}
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: roleInfo.color + "20",
                  color: roleInfo.color,
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {roleInfo.label}
              </span>

              <span
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.75rem",
                  backgroundColor: statusInfo.color + "20",
                  color: statusInfo.color,
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          {/* User Information */}
          <div style={{ marginBottom: "2rem" }}>
            <h4
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#1f2937",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FiInfo />
              Thông tin cá nhân
            </h4>

            <div style={{ display: "grid", gap: "1rem" }}>
              {/* ID */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ fontWeight: "500", color: "#6b7280" }}>ID:</span>
                <span style={{ color: "#1f2937", fontFamily: "monospace" }}>
                  {user.id || user._id || "N/A"}
                </span>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiMail size={16} />
                  Email:
                </span>
                <span style={{ color: "#1f2937" }}>{getUserEmail()}</span>
              </div>

              {/* Phone */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiPhone size={16} />
                  Số điện thoại:
                </span>
                <span style={{ color: "#1f2937" }}>{getUserPhone()}</span>
              </div>

              {/* Address */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiMapPin size={16} />
                  Địa chỉ:
                </span>
                <span
                  style={{
                    color: "#1f2937",
                    textAlign: "right",
                    maxWidth: "60%",
                  }}
                >
                  {getUserAddress()}
                </span>
              </div>

              {/* Gender */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span style={{ fontWeight: "500", color: "#6b7280" }}>
                  Giới tính:
                </span>
                <span style={{ color: "#1f2937" }}>{getUserGender()}</span>
              </div>

              {/* Created Date */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiCalendar size={16} />
                  Ngày tạo:
                </span>
                <span style={{ color: "#1f2937" }}>
                  {formatDate(user.createdAt || user.userId?.createdAt)}
                </span>
              </div>

              {/* Updated Date */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                }}
              >
                <span
                  style={{
                    fontWeight: "500",
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiCalendar size={16} />
                  Cập nhật cuối:
                </span>
                <span style={{ color: "#1f2937" }}>
                  {formatDate(user.updatedAt || user.userId?.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Role-specific Information */}
          {(user.role === "teacher" || user.originalRole === "teacher") && (
            <div style={{ marginBottom: "1rem" }}>
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Thông tin giáo viên
              </h4>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#6b7280" }}>
                    Lương mỗi buổi:
                  </span>
                  <span style={{ color: "#1f2937", fontWeight: "600" }}>
                    {user.wagePerLesson
                      ? `${new Intl.NumberFormat("vi-VN").format(
                          user.wagePerLesson
                        )} VND`
                      : "Chưa thiết lập"}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#6b7280" }}>
                    Số lớp đang dạy:
                  </span>
                  <span style={{ color: "#1f2937", fontWeight: "600" }}>
                    {user.classId?.length || 0} lớp
                  </span>
                </div>
              </div>
            </div>
          )}

          {(user.role === "student" || user.originalRole === "student") && (
            <div style={{ marginBottom: "1rem" }}>
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Thông tin học sinh
              </h4>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#6b7280" }}>
                    Số lớp đang học:
                  </span>
                  <span style={{ color: "#1f2937", fontWeight: "600" }}>
                    {user.classId?.length || 0} lớp
                  </span>
                </div>

                {user.parentId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.75rem 0",
                    }}
                  >
                    <span style={{ fontWeight: "500", color: "#6b7280" }}>
                      Phụ huynh:
                    </span>
                    <span style={{ color: "#1f2937" }}>
                      {user.parentId.name ||
                        user.parentId.userId?.name ||
                        "Chưa có thông tin"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(user.role === "parent" || user.originalRole === "parent") && (
            <div style={{ marginBottom: "1rem" }}>
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1f2937",
                }}
              >
                Thông tin phụ huynh
              </h4>

              <div style={{ display: "grid", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#6b7280" }}>
                    Số con:
                  </span>
                  <span style={{ color: "#1f2937", fontWeight: "600" }}>
                    {user.childId?.length || 0} học sinh
                  </span>
                </div>

                {user.childId && user.childId.length > 0 && (
                  <div
                    style={{
                      padding: "0.75rem 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "500",
                        color: "#6b7280",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Danh sách con:
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {user.childId.map((child, index) => (
                        <div
                          key={child.userId?._id || child._id || index}
                          style={{
                            padding: "0.5rem 0.75rem",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              borderRadius: "50%",
                              backgroundColor: "#10b981",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                            }}
                          >
                            {index + 1}
                          </span>
                          <span style={{ color: "#1f2937", fontWeight: "500" }}>
                            {child.userId?.name || child.name || "Không có tên"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem 0",
                  }}
                >
                  <span style={{ fontWeight: "500", color: "#6b7280" }}>
                    Xem thông tin giáo viên:
                  </span>
                  <span style={{ color: "#1f2937" }}>
                    {user.canSeeTeacher ? "Có" : "Không"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.5rem",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
