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

const UserFormModal = ({
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
  error,
  setError,
  loading,
}) => {
  if (!showAddUserForm) return null;

  return (
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
                  return role.charAt(0).toUpperCase().concat(role.slice(1));
              }
            })()}
          </div>
        </div>

        {/* Body / Form */}
        <div className="user-edit-body">
          {error && <div className="form-error">{error}</div>}

          <form
            key={formKey}
            onSubmit={handleFormSubmit}
            className="user-edit-form"
          >
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <FiUser />
                Thông tin cơ bản
              </h3>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập tên người dùng"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Vai trò</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={editingUser}
                  >
                    <option value="">Chọn vai trò</option>
                    <option value="Admin">Quản trị viên</option>
                    <option value="Teacher">Giáo viên</option>
                    <option value="Student">Học sinh</option>
                    <option value="Parent">Phụ huynh</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Nhập email"
                  />
                </div>

                {!editingUser && (
                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      id="passwordBeforeHash"
                      name="passwordBeforeHash"
                      value={formData.passwordBeforeHash}
                      onChange={handleInputChange}
                      required={!editingUser}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Giới tính</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                  />
                </div>
              </div>
            </div>

            {/* Role-specific information */}
            {formData.role === "Student" && (
              <div className="form-section">
                <h3 className="section-title">
                  <HiAcademicCap />
                  Thông tin học sinh
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="parentId">Phụ huynh</label>
                    <select
                      id="parentId"
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn phụ huynh</option>
                      {parents.map((parent) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.name} ({parent.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Lớp học</label>
                    <div className="class-selection">
                      <select
                        value=""
                        onChange={(e) => handleClassSelect(e.target.value)}
                      >
                        <option value="">Thêm lớp học</option>
                        {allClasses
                          .filter((cls) => !formData.classIds.includes(cls.id))
                          .map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.className} ({cls.year})
                            </option>
                          ))}
                      </select>

                      <div className="selected-classes">
                        {formData.classIds.length > 0 ? (
                          formData.classIds.map((classId) => {
                            const cls = allClasses.find(
                              (c) => c.id === classId
                            );
                            return (
                              <div
                                key={classId}
                                className="selected-class-item"
                              >
                                <span>
                                  {cls
                                    ? `${cls.className} (${cls.year})`
                                    : classId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveClass(classId)}
                                >
                                  <FiX />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="no-selection">
                            Chưa chọn lớp học nào
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "Teacher" && (
              <div className="form-section">
                <h3 className="section-title">
                  <FiUsers />
                  Thông tin giáo viên
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="wagePerLesson">Lương/buổi (VNĐ)</label>
                    <input
                      type="number"
                      id="wagePerLesson"
                      name="wagePerLesson"
                      value={formData.wagePerLesson}
                      onChange={handleInputChange}
                      placeholder="Nhập lương mỗi buổi dạy"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="canViewTeacher">
                      Quyền xem giáo viên khác
                    </label>
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        id="canViewTeacher"
                        name="canViewTeacher"
                        checked={formData.canViewTeacher}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            canViewTeacher: e.target.checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="canViewTeacher"
                        className="checkbox-label"
                      >
                        Cho phép xem thông tin giáo viên khác
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.role === "Parent" && (
              <div className="form-section">
                <h3 className="section-title">
                  <FiUsers />
                  Thông tin phụ huynh
                </h3>

                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Học sinh liên kết</label>
                    <div className="student-selection">
                      <select
                        value=""
                        onChange={(e) => handleStudentSelect(e.target.value)}
                      >
                        <option value="">Thêm học sinh</option>
                        {students
                          .filter(
                            (student) =>
                              !formData.studentIds.includes(student.id)
                          )
                          .map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.email})
                            </option>
                          ))}
                      </select>

                      <div className="selected-students">
                        {formData.studentIds.length > 0 ? (
                          formData.studentIds.map((studentId) => {
                            const student = students.find(
                              (s) => s.id === studentId
                            );
                            return (
                              <div
                                key={studentId}
                                className="selected-student-item"
                              >
                                <span>
                                  {student
                                    ? `${student.name} (${student.email})`
                                    : studentId}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveStudentFromParent(studentId)
                                  }
                                >
                                  <FiX />
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="no-selection">
                            Chưa chọn học sinh nào
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
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
                {editingUser ? "Hủy chỉnh sửa" : "Hủy"}
              </button>
              <button
                type="submit"
                className="user-edit-btn user-edit-btn-save"
                disabled={loading}
              >
                <FiSave />
                {loading
                  ? "Đang xử lý..."
                  : editingUser
                  ? "Lưu thay đổi"
                  : "Tạo người dùng"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserFormModal;
