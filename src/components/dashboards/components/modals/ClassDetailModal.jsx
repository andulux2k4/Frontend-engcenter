import React, { useState, useEffect } from "react";
import {
  FiBook,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiMail,
  FiPhone,
  FiBarChart2,
  FiCheckCircle,
  FiHome,
  FiInfo,
  FiEye,
  FiX,
} from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";
import apiService from "../../../../services/api";

function ClassDetailModal({
  showClassDetail,
  selectedClass,
  setShowClassDetail,
  setSelectedClass,
  setError,
  handleViewUserDetail,
  user,
}) {
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedClass && selectedClass.studentList) {
      setStudents(selectedClass.studentList);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredStudents(
        students.filter((student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch (error) {
      return "Chưa xác định";
    }
  };

  // Get weekday label in Vietnamese
  const getWeekdayLabel = (day) => {
    if (typeof day === "string" || typeof day === "number") {
      const dayLabels = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
        0: "Thứ 2",
        1: "Thứ 3",
        2: "Thứ 4",
        3: "Thứ 5",
        4: "Thứ 6",
        5: "Thứ 7",
        6: "Chủ nhật",
      };
      return dayLabels[day] || day;
    }
    return day;
  };

  // Handle click on teacher to view details
  const handleTeacherClick = () => {
    if (selectedClass.teacherId && handleViewUserDetail) {
      handleViewUserDetail(selectedClass.teacherId);
    }
  };

  // Handle click on student to view details
  const handleStudentClick = (studentId) => {
    if (studentId && handleViewUserDetail) {
      handleViewUserDetail(studentId);
    }
  };

  if (!showClassDetail) {
    return null;
  }

  return (
    <>
      <div
        className="modal-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowClassDetail(false);
            setSelectedClass(null);
            setError("");
          }
        }}
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
          className="class-detail-modal"
          style={{
            backgroundColor: "white",
            borderRadius: "0.5rem",
            width: "90%",
            maxWidth: "900px",
            maxHeight: "90vh",
            overflow: "auto",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Header */}
          <div
            className="class-detail-header"
            style={{
              padding: "2rem",
              borderBottom: "1px solid #e5e7eb",
              position: "relative",
              backgroundColor: "#3b82f6",
              color: "white",
              borderRadius: "0.5rem 0.5rem 0 0",
            }}
          >
            <button
              className="class-detail-close"
              onClick={() => {
                setShowClassDetail(false);
                setSelectedClass(null);
                setError("");
              }}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                backgroundColor: "transparent",
                border: "none",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              <FiX />
            </button>

            {!selectedClass ? (
              <div
                className="class-detail-loading"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                }}
              >
                <div
                  className="loading-spinner"
                  style={{
                    border: "4px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "50%",
                    borderTop: "4px solid white",
                    width: "40px",
                    height: "40px",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                <div className="loading-text" style={{ marginTop: "1rem" }}>
                  Đang tải thông tin...
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  className="class-detail-icon"
                  style={{
                    backgroundColor: "#2563eb",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                    fontSize: "2rem",
                  }}
                >
                  <FiBook />
                </div>
                <h2
                  className="class-detail-name"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: "700",
                    margin: "0 0 0.5rem",
                  }}
                >
                  {selectedClass.className || "Chưa có tên lớp"}
                </h2>
                <div
                  className="class-detail-meta"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "1.5rem",
                    flexWrap: "wrap",
                    fontSize: "1rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <HiAcademicCap /> Lớp {selectedClass.grade}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiCalendar /> Năm học: {selectedClass.year}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.375rem 1rem",
                      borderRadius: "9999px",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      backgroundColor: selectedClass.isAvailable
                        ? "#dcfce7"
                        : "#fee2e2",
                      color: selectedClass.isAvailable ? "#166534" : "#991b1b",
                    }}
                  >
                    {selectedClass.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          {selectedClass && (
            <div
              className="class-detail-body"
              style={{
                padding: "2rem",
              }}
            >
              {/* Teacher Information */}
              <div
                className="teacher-section"
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiUsers style={{ color: "#3b82f6" }} />
                  Thông tin giáo viên
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        margin: "0 0 0.5rem 0",
                        color: "#1e293b",
                      }}
                    >
                      {selectedClass.teacherName || "Chưa phân công giáo viên"}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.875rem",
                        color: "#64748b",
                      }}
                    >
                      {selectedClass.teacherEmail && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FiMail />
                          {selectedClass.teacherEmail}
                        </span>
                      )}
                      {selectedClass.teacherPhone && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <FiPhone />
                          {selectedClass.teacherPhone}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedClass.teacherId && (
                    <button
                      onClick={handleTeacherClick}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.75rem 1rem",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#2563eb";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#3b82f6";
                      }}
                    >
                      <FiEye />
                      Xem chi tiết
                    </button>
                  )}
                </div>
              </div>

              {/* Schedule and Fee Grid */}
              <div
                className="schedule-fee-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Start Date */}
                <div
                  className="info-card"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "#fefefe",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <FiClock
                      style={{ color: "#10b981", fontSize: "1.25rem" }}
                    />
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      Ngày bắt đầu
                    </h4>
                  </div>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {formatDate(selectedClass.startDate)}
                  </p>
                </div>

                {/* End Date */}
                <div
                  className="info-card"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "#fefefe",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <FiClock
                      style={{ color: "#ef4444", fontSize: "1.25rem" }}
                    />
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      Ngày kết thúc
                    </h4>
                  </div>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {formatDate(selectedClass.endDate)}
                  </p>
                </div>

                {/* Days of Week */}
                <div
                  className="info-card"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "#fefefe",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <FiCalendar
                      style={{ color: "#3b82f6", fontSize: "1.25rem" }}
                    />
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      Ngày học trong tuần
                    </h4>
                  </div>
                  <div>
                    {selectedClass.daysOfLessonInWeek &&
                    Array.isArray(selectedClass.daysOfLessonInWeek) &&
                    selectedClass.daysOfLessonInWeek.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {selectedClass.daysOfLessonInWeek.map((day, index) => (
                          <span
                            key={index}
                            style={{
                              padding: "0.375rem 0.75rem",
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              borderRadius: "9999px",
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              border: "1px solid #dbeafe",
                            }}
                          >
                            {getWeekdayLabel(day)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
                        Chưa có lịch học
                      </span>
                    )}
                  </div>
                </div>

                {/* Fee */}
                <div
                  className="info-card"
                  style={{
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    backgroundColor: "#fefefe",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <FiDollarSign
                      style={{ color: "#f59e0b", fontSize: "1.25rem" }}
                    />
                    <h4
                      style={{
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#1e293b",
                        margin: 0,
                      }}
                    >
                      Học phí mỗi buổi
                    </h4>
                  </div>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedClass.feePerLesson)}
                  </p>
                </div>
              </div>

              {/* Student Information */}
              <div
                className="student-section"
                style={{
                  marginBottom: "2rem",
                  padding: "1.5rem",
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.75rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FiUsers style={{ color: "#3b82f6" }} />
                  Thông tin học sinh
                </h3>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: "600",
                        margin: "0 0 0.5rem 0",
                        color: "#1e293b",
                      }}
                    >
                      Tổng số học sinh: {selectedClass.currentStudents || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStudentListModal(true)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.75rem 1rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#059669";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#10b981";
                    }}
                  >
                    <FiEye />
                    Xem danh sách
                  </button>
                </div>
              </div>

              {/* Attendance Statistics */}
              {selectedClass.attendanceStats && (
                <div
                  className="attendance-section"
                  style={{
                    marginBottom: "2rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "1.5rem",
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiBarChart2 style={{ color: "#3b82f6" }} />
                    Thống kê điểm danh
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f0fdf4",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        border: "1px solid #dcfce7",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FiCheckCircle
                          style={{
                            fontSize: "2rem",
                            color: "#16a34a",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#16a34a",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {selectedClass.attendanceStats.attended || 0}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#166534",
                          fontWeight: "500",
                        }}
                      >
                        Buổi đã học
                      </div>
                    </div>

                    <div
                      style={{
                        backgroundColor: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "0.75rem",
                        border: "1px solid #e2e8f0",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <FiCalendar
                          style={{
                            fontSize: "2rem",
                            color: "#64748b",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#64748b",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {selectedClass.attendanceStats.total || 0}
                      </div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#475569",
                          fontWeight: "500",
                        }}
                      >
                        Tổng số buổi
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Location Information */}
              {selectedClass.location && (
                <div
                  className="location-section"
                  style={{
                    marginBottom: "2rem",
                    padding: "1.5rem",
                    backgroundColor: "#f8fafc",
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "#1e293b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiHome style={{ color: "#3b82f6" }} />
                    Địa điểm học
                  </h3>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      color: "#1e293b",
                      margin: 0,
                    }}
                  >
                    {selectedClass.location}
                  </p>
                </div>
              )}

              {/* Footer action buttons */}
              <div
                className="class-detail-footer"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "1rem",
                  marginTop: "2rem",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowClassDetail(false);
                    setSelectedClass(null);
                  }}
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student List Modal */}
      {showStudentListModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStudentListModal(false);
            }
          }}
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
            zIndex: 60,
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              overflow: "hidden",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "80vh",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "1rem",
                borderBottom: "1px solid #2563eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "white",
                }}
              >
                <FiUsers />
                Danh sách học sinh
              </h3>
              <button
                onClick={() => setShowStudentListModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "0",
                  lineHeight: "1",
                }}
                title="Đóng"
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: "1rem" }}>
              {/* Search bar */}
              <div style={{ marginBottom: "1.5rem" }}>
                <input
                  type="text"
                  placeholder="Tìm kiếm học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: "#f9fafb",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              {/* Student count */}
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "0.5rem",
                  border: "1px solid #bae6fd",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "#0c4a6e",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                  }}
                >
                  Tổng số học sinh: {filteredStudents.length} /{" "}
                  {students.length}
                </p>
              </div>

              {/* Students table */}
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              >
                {filteredStudents && filteredStudents.length > 0 ? (
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead
                      style={{
                        backgroundColor: "#f9fafb",
                        position: "sticky",
                        top: 0,
                      }}
                    >
                      <tr>
                        <th
                          style={{
                            padding: "0.75rem",
                            textAlign: "left",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Tên học sinh
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            textAlign: "left",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Email
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            textAlign: "left",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Số điện thoại
                        </th>
                        <th
                          style={{
                            padding: "0.75rem",
                            textAlign: "center",
                            fontWeight: "600",
                            fontSize: "0.875rem",
                            borderBottom: "2px solid #e5e7eb",
                          }}
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student, index) => {
                        const studentId =
                          student.id ||
                          student._id ||
                          (student.userId &&
                            (student.userId.id || student.userId._id));
                        const studentData = student.userId || student;

                        return (
                          <tr
                            key={studentId || index}
                            style={{
                              borderBottom: "1px solid #e5e7eb",
                              backgroundColor:
                                index % 2 === 0 ? "#ffffff" : "#f9fafb",
                            }}
                          >
                            <td
                              style={{
                                padding: "0.75rem",
                                fontSize: "0.875rem",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                handleStudentClick(
                                  student.idObj || {
                                    id: student.id || student._id,
                                    role: "student",
                                    roleId: student.id || student._id,
                                  }
                                )
                              }
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.5rem",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "500",
                                    color: "#1e293b",
                                  }}
                                >
                                  {studentData.name ||
                                    student.name ||
                                    `Học sinh ${index + 1}`}
                                </span>
                                {student.discount > 0 && (
                                  <span
                                    style={{
                                      fontSize: "0.75rem",
                                      backgroundColor: "#fef3c7",
                                      color: "#92400e",
                                      padding: "0.125rem 0.375rem",
                                      borderRadius: "9999px",
                                    }}
                                  >
                                    Giảm {student.discount}%
                                  </span>
                                )}
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "0.75rem",
                                fontSize: "0.875rem",
                                color: "#64748b",
                              }}
                            >
                              {studentData.email || student.email || "—"}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem",
                                fontSize: "0.875rem",
                                color: "#64748b",
                              }}
                            >
                              {studentData.phoneNumber ||
                                studentData.phone ||
                                student.phoneNumber ||
                                student.phone ||
                                "—"}
                            </td>
                            <td
                              style={{
                                padding: "0.75rem",
                                textAlign: "center",
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleStudentClick(
                                    student.idObj || {
                                      id: student.id || student._id,
                                      role: "student",
                                      roleId: student.id || student._id,
                                    }
                                  )
                                }
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "0.25rem",
                                  padding: "0.375rem 0.75rem",
                                  backgroundColor: "#3b82f6",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "0.375rem",
                                  fontSize: "0.75rem",
                                  cursor: "pointer",
                                  transition: "all 0.2s ease",
                                  margin: "0 auto",
                                }}
                                onMouseOver={(e) => {
                                  e.target.style.backgroundColor = "#2563eb";
                                }}
                                onMouseOut={(e) => {
                                  e.target.style.backgroundColor = "#3b82f6";
                                }}
                              >
                                <FiEye />
                                Xem
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#64748b",
                    }}
                  >
                    {searchTerm
                      ? "Không tìm thấy học sinh nào phù hợp"
                      : "Chưa có học sinh nào trong lớp"}
                  </div>
                )}
              </div>

              {/* Loading state */}
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      border: "4px solid rgba(59, 130, 246, 0.3)",
                      borderTop: "4px solid #3b82f6",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ClassDetailModal;
