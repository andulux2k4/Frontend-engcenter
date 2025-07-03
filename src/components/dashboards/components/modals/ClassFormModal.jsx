import React from "react";
import { FiPlus, FiEdit, FiX, FiSave } from "react-icons/fi";

function ClassFormModal({
  isEdit,
  showModal,
  setShowModal,
  classData,
  setClassData,
  allTeachers,
  handleSubmit,
  loading,
}) {
  // If modal is not shown, don't render anything
  if (!showModal) {
    return null;
  }

  // Determine if we're in edit or create mode
  const isEditMode = isEdit;

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
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {isEditMode ? (
              <>
                <FiEdit style={{ color: "#3b82f6" }} />
                Chỉnh sửa lớp học
              </>
            ) : (
              <>
                <FiPlus style={{ color: "#3b82f6" }} />
                Tạo lớp học mới
              </>
            )}
          </h3>
          <button
            onClick={() => setShowModal(false)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiX />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1rem",
          }}
        >
          {/* Class Name */}
          <div>
            <label
              htmlFor="className"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Tên lớp
            </label>
            <input
              id="className"
              type="text"
              value={classData.name}
              onChange={(e) =>
                setClassData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
              placeholder="Nhập tên lớp học"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                color: "#111827",
              }}
            />
          </div>

          {/* Year and Grade */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                htmlFor="classYear"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Năm học
              </label>
              <input
                id="classYear"
                type="number"
                value={classData.year}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    year: e.target.value,
                  }))
                }
                min={new Date().getFullYear() - 5}
                max={new Date().getFullYear() + 5}
                required
                placeholder="Nhập năm học"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  color: "#111827",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="classGrade"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Khối lớp
              </label>
              <select
                id="classGrade"
                value={classData.grade}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    grade: e.target.value,
                  }))
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  color: "#111827",
                  backgroundColor: "white",
                }}
              >
                <option value="">Chọn khối lớp</option>
                <option value="1">Lớp 1</option>
                <option value="2">Lớp 2</option>
                <option value="3">Lớp 3</option>
                <option value="4">Lớp 4</option>
                <option value="5">Lớp 5</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
            </div>
          </div>

          {/* Teacher */}
          <div>
            <label
              htmlFor="classTeacher"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Giáo viên
            </label>
            <select
              id="classTeacher"
              value={classData.teacherId}
              onChange={(e) =>
                setClassData((prev) => ({
                  ...prev,
                  teacherId: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                color: "#111827",
                backgroundColor: "white",
              }}
            >
              <option value="">Chọn giáo viên</option>
              {allTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fee per Lesson */}
          <div>
            <label
              htmlFor="classFee"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Học phí mỗi buổi (VNĐ)
            </label>
            <input
              id="classFee"
              type="number"
              min="0"
              step="10000"
              value={classData.feePerLesson}
              onChange={(e) =>
                setClassData((prev) => ({
                  ...prev,
                  feePerLesson: e.target.value,
                }))
              }
              required
              placeholder="Nhập học phí mỗi buổi"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                color: "#111827",
              }}
            />
          </div>

          {/* Start and End Date */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <label
                htmlFor="startDate"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Ngày bắt đầu
              </label>
              <input
                id="startDate"
                type="date"
                value={classData.startDate}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  color: "#111827",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="endDate"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Ngày kết thúc
              </label>
              <input
                id="endDate"
                type="date"
                value={classData.endDate}
                onChange={(e) =>
                  setClassData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  color: "#111827",
                }}
              />
            </div>
          </div>

          {/* Days of Lesson */}
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Ngày học trong tuần
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => {
                const dayLabel = {
                  Monday: "Thứ 2",
                  Tuesday: "Thứ 3",
                  Wednesday: "Thứ 4",
                  Thursday: "Thứ 5",
                  Friday: "Thứ 6",
                  Saturday: "Thứ 7",
                  Sunday: "Chủ nhật",
                }[day];

                return (
                  <label
                    key={day}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      userSelect: "none",
                      cursor: "pointer",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      backgroundColor: classData.daysOfLessonInWeek.includes(
                        day
                      )
                        ? "#eff6ff"
                        : "white",
                      color: classData.daysOfLessonInWeek.includes(day)
                        ? "#2563eb"
                        : "#374151",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={classData.daysOfLessonInWeek.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setClassData((prev) => ({
                            ...prev,
                            daysOfLessonInWeek: [
                              ...prev.daysOfLessonInWeek,
                              day,
                            ],
                          }));
                        } else {
                          setClassData((prev) => ({
                            ...prev,
                            daysOfLessonInWeek: prev.daysOfLessonInWeek.filter(
                              (d) => d !== day
                            ),
                          }));
                        }
                      }}
                      style={{
                        marginRight: "0.25rem",
                      }}
                    />
                    {dayLabel}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit and Cancel buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {loading
                ? "Đang xử lý..."
                : isEditMode
                ? "Lưu thay đổi"
                : "Tạo lớp học"}
              {!loading && <FiSave />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassFormModal;
