import React from "react";
import {
  FiUser,
  FiUsers,
  FiPhone,
  FiMail,
  FiLock,
  FiSave,
  FiX,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { HiAcademicCap, HiInformationCircle } from "react-icons/hi";
import { BiMoney } from "react-icons/bi";
import UserFormModal from "./modals/UserFormModal";

const UserManagement = ({
  users,
  filteredUsers,
  loading,
  error,
  pagination,
  setPagination,
  userFilters,
  setUserFilters,
  selectedRole,
  handleRoleFilterChange,
  showAddUserForm,
  setShowAddUserForm,
  editingUser,
  setEditingUser,
  formData,
  setFormData,
  formKey,
  parents,
  students,
  allClasses,
  handleInputChange,
  handleClassSelect,
  handleRemoveClass,
  handleStudentSelect,
  handleRemoveStudentFromParent,
  handleFormSubmit,
  resetFormData,
  handleAddUser,
  handleEditUser,
  handleDeleteUser,
  handleViewUserDetail,
}) => {
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
          <FiUsers style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Quản lý người dùng
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
            Thêm người dùng mới
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
              setUserFilters((prev) => ({ ...prev, name: e.target.value }))
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
              setUserFilters((prev) => ({ ...prev, email: e.target.value }))
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
              setUserFilters((prev) => ({ ...prev, isActive: e.target.value }))
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
            width: "100%",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "0.5rem",
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
              marginLeft: "0.5rem",
            }}
          >
            <option value="all">Tất cả</option>
            <option value="teacher">Giáo viên</option>
            <option value="student">Học sinh</option>
            <option value="parent">Phụ huynh</option>
          </select>
        </div>

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
                  <div className="loading-text">Đang tải thông tin...</div>
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
                      <label className="user-edit-label">Họ và tên *</label>
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
                      <label className="user-edit-label">Số điện thoại *</label>
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
                      <label className="user-edit-label">Giới tính</label>
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
                      <label className="user-edit-label">Vai trò *</label>
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
                                    Phụ huynh: ID {formData.parentId} (không tìm
                                    thấy)
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
                            console.log("🔍 Parent dropdown selection:", {
                              selectedParentId,
                              currentParentId: formData.parentId,
                              allParents: parents,
                              parentsCount: parents.length,
                            });
                            if (selectedParentId && selectedParentId !== "") {
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
                              <option key={p.roleId || p.id} value={p.roleId}>
                                {p.name} (ID: {(p.id || p.roleId).slice(-6)})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="user-edit-field">
                        <label className="user-edit-label">Lớp học</label>
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
                          <HiInformationCircle
                            style={{ fontSize: "1.25rem", color: "#0ea5e9" }}
                          />
                          <span>
                            Vui lòng tạo học sinh trước, sau đó thêm vào lớp học
                            ở mục "Lớp học"
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
                          onChange={(e) => handleClassSelect(e.target.value)}
                          value=""
                        >
                          <option value="">Chọn lớp dạy để thêm</option>
                          {allClasses
                            .filter((c) => !formData.classIds.includes(c.id))
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
                                    color: classItem ? "#92400e" : "#dc2626",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {classItem
                                    ? classItem.className || classItem.name
                                    : `Lớp ID: ${id} (không tìm thấy)`}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveClass(id)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      color: classItem ? "#92400e" : "#dc2626",
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
                                  s.id === id || s._id === id || s.roleId === id
                              );
                              return (
                                <span
                                  key={id}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.25rem",
                                    padding: "0.25rem 0.5rem",
                                    background: student ? "#dcfce7" : "#fef3c7",
                                    color: student ? "#166534" : "#92400e",
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
                                      color: student ? "#166534" : "#92400e",
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
                          onChange={(e) => handleStudentSelect(e.target.value)}
                          value=""
                        >
                          <option value="">Chọn học sinh để thêm</option>
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
                      backgroundColor: index % 2 === 0 ? "white" : "#f9fafb",
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
                          backgroundColor:
                            user.status === "Đang hoạt động"
                              ? "#dcfce7"
                              : "#fee2e2",
                          color:
                            user.status === "Đang hoạt động"
                              ? "#166534"
                              : "#dc2626",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div
                          style={{
                            width: "0.5rem",
                            height: "0.5rem",
                            borderRadius: "50%",
                            backgroundColor:
                              user.status === "Đang hoạt động"
                                ? "#22c55e"
                                : "#ef4444",
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
      {!loading && filteredUsers.length > 0 && pagination.totalPages > 1 && (
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
            Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
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
                color: pagination.currentPage === 1 ? "#9ca3af" : "#374151",
                cursor:
                  pagination.currentPage === 1 ? "not-allowed" : "pointer",
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
                  currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
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
  );
};

export default UserManagement;
