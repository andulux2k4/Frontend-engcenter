import React, { useState } from "react";
import { FiUsers, FiX, FiPercent } from "react-icons/fi";

function StudentSelectionModal({
  showStudentSelect,
  selectedClassForAssignment,
  availableStudents,
  loading,
  handleEnrollStudent,
  setShowStudentSelect,
  setSelectedClassForAssignment,
  handleViewUserDetail,
}) {
  if (!showStudentSelect || !selectedClassForAssignment) {
    return null;
  }

  // Add state for discount percentage
  const [discountPercentages, setDiscountPercentages] = useState({});

  // Handler for discount percentage change
  const handleDiscountChange = (studentId, value) => {
    // Ensure value is between 0 and 100
    const percentage = Math.min(100, Math.max(0, value));
    setDiscountPercentages({
      ...discountPercentages,
      [studentId]: percentage,
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>
          <FiUsers className="icon" />
          Thêm học sinh vào lớp: {selectedClassForAssignment.className}
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
            Đang tải danh sách học sinh...
          </div>
        )}

        {!loading && (
          <div className="student-list">
            {availableStudents.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#6b7280",
                }}
              >
                Không có học sinh khả dụng để thêm vào lớp
              </div>
            ) : (
              <div
                className="card-grid"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
              >
                {availableStudents.map((student) => (
                  <div
                    key={student._id}
                    className="card"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleViewUserDetail &&
                      handleViewUserDetail({
                        id: student._id,
                        role: "student",
                        roleId: student._id,
                      })
                    }
                  >
                    <div className="card-content">
                      <h4>{student.userId?.name || "Chưa có tên"}</h4>
                      <p>
                        <strong>Email:</strong>{" "}
                        {student.userId?.email || "Chưa có email"}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong>{" "}
                        {student.userId?.phoneNumber || "Chưa có số điện thoại"}
                      </p>
                      <p>
                        <strong>Lớp hiện tại:</strong>{" "}
                        {student.currentClasses?.length || 0} lớp
                      </p>
                      <p>
                        <strong>Phụ huynh:</strong>{" "}
                        {student.parentId?.name || "Chưa có thông tin"}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "0.5rem",
                          gap: "0.5rem",
                        }}
                      >
                        <FiPercent style={{ color: "#3b82f6" }} />
                        <label style={{ fontWeight: "500" }}>Giảm giá:</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercentages[student._id] || 0}
                          onChange={(e) =>
                            handleDiscountChange(
                              student._id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          style={{
                            padding: "0.25rem 0.5rem",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.25rem",
                            width: "70px",
                          }}
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <div
                      className="card-actions"
                      style={{ padding: "1rem", textAlign: "center" }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleEnrollStudent(
                            selectedClassForAssignment.id,
                            student._id,
                            discountPercentages[student._id] || 0
                          )
                        }
                        disabled={loading}
                      >
                        <FiUsers className="icon" />
                        Thêm vào lớp
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
              setShowStudentSelect(false);
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

export default StudentSelectionModal;
