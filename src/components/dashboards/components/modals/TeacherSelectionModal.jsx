import React from "react";
import { FiUser, FiX } from "react-icons/fi";

function TeacherSelectionModal({
  showTeacherSelect,
  selectedClassForAssignment,
  availableTeachers,
  loading,
  handleAssignTeacher,
  setShowTeacherSelect,
  setSelectedClassForAssignment,
}) {
  if (!showTeacherSelect || !selectedClassForAssignment) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>
          <FiUser className="icon" />
          Phân công giáo viên cho lớp: {selectedClassForAssignment.className}
        </h3>

        {loading && (
          <div
            className="loading-message"
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#4a5568",
            }}
          >
            Đang tải danh sách giáo viên...
          </div>
        )}

        {!loading && (
          <div className="teacher-list">
            {availableTeachers.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6b7280",
                }}
              >
                Không có giáo viên khả dụng để phân công
              </div>
            ) : (
              <div
                className="card-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
              >
                {availableTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="card"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-content">
                      <h4>{teacher.userId?.name || "Chưa có tên"}</h4>
                      <p>
                        <strong>Email:</strong>{" "}
                        {teacher.userId?.email || "Chưa có email"}
                      </p>
                      <p>
                        <strong>Chuyên môn:</strong>{" "}
                        {teacher.specialization || "Chưa có thông tin"}
                      </p>
                      <p>
                        <strong>Kinh nghiệm:</strong> {teacher.experience || 0}{" "}
                        năm
                      </p>
                      <p>
                        <strong>Lớp hiện tại:</strong>{" "}
                        {teacher.currentClasses?.length || 0} lớp
                      </p>
                    </div>
                    <div
                      className="card-actions"
                      style={{ padding: "1rem", textAlign: "center" }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleAssignTeacher(
                            selectedClassForAssignment.id,
                            teacher._id
                          )
                        }
                        disabled={loading}
                      >
                        <FiUser className="icon" />
                        Phân công
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowTeacherSelect(false);
              setSelectedClassForAssignment(null);
            }}
          >
            <FiX className="icon" />
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeacherSelectionModal;
