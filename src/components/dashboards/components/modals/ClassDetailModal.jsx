import React, { useState } from "react";
import {
  FiBook,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiMail,
  FiPhone,
  FiBarChart2,
  FiCheckCircle,
  FiHome,
  FiInfo,
} from "react-icons/fi";
import { HiAcademicCap } from "react-icons/hi";

function ClassDetailModal({
  showClassDetail,
  selectedClass,
  setShowClassDetail,
  setSelectedClass,
  setError,
  handleViewUserDetail,
}) {
  const [showTeacherDetails, setShowTeacherDetails] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);

  if (!showClassDetail) {
    return null;
  }

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";

    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch (error) {
      return dateString || "Chưa xác định";
    }
  };

  // Function to convert day numbers to day names
  const getWeekdayLabel = (day) => {
    if (typeof day === "number") {
      // If day is a number (0-6), convert to day name
      const days = [
        "Chủ nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      return days[day % 7];
    } else if (typeof day === "string") {
      // If day is a string (Monday, Tuesday, etc.), convert to Vietnamese
      const dayLabels = {
        Monday: "Thứ 2",
        Tuesday: "Thứ 3",
        Wednesday: "Thứ 4",
        Thursday: "Thứ 5",
        Friday: "Thứ 6",
        Saturday: "Thứ 7",
        Sunday: "Chủ nhật",
        0: "Chủ nhật",
        1: "Thứ 2",
        2: "Thứ 3",
        3: "Thứ 4",
        4: "Thứ 5",
        5: "Thứ 6",
        6: "Thứ 7",
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

  return (
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
          maxWidth: "800px",
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
            padding: "1.5rem",
            borderBottom: "1px solid #e5e7eb",
            position: "relative",
            textAlign: "center",
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
            ×
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
            <>
              <div
                className="class-detail-icon"
                style={{
                  backgroundColor: "#2563eb",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                  fontSize: "1.75rem",
                }}
              >
                <FiBook />
              </div>
              <h2
                className="class-detail-name"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
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
                  gap: "1rem",
                  flexWrap: "wrap",
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
                    padding: "0.25rem 0.75rem",
                    borderRadius: "9999px",
                    fontWeight: "500",
                    fontSize: "0.75rem",
                    backgroundColor: selectedClass.isAvailable
                      ? "#dcfce7"
                      : "#fee2e2",
                    color: selectedClass.isAvailable ? "#166534" : "#991b1b",
                  }}
                >
                  {selectedClass.status}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Body */}
        {selectedClass && (
          <div
            className="class-detail-body"
            style={{
              padding: "1.5rem",
            }}
          >
            {/* Thông tin cơ bản */}
            <div
              className="class-detail-section"
              style={{
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#1f2937",
                }}
              >
                <FiBook style={{ color: "#3b82f6" }} />
                Thông tin cơ bản
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {/* Giáo viên */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Giáo viên
                  </div>
                  <div
                    className="info-value teacher-section"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: selectedClass.teacherId ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (handleViewUserDetail) {
                          handleTeacherClick();
                        } else {
                          setShowTeacherDetails(!showTeacherDetails);
                        }
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <FiUsers style={{ color: "#3b82f6" }} />
                        {selectedClass.teacherName || "Chưa phân công"}
                      </span>
                      {selectedClass.teacherId && (
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#6b7280",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowTeacherDetails(!showTeacherDetails);
                          }}
                        >
                          {showTeacherDetails ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Thông tin chi tiết giáo viên */}
                    {showTeacherDetails && selectedClass.teacherId && (
                      <div
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "0.375rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        {selectedClass.teacherEmail && (
                          <div
                            style={{
                              marginBottom: "0.25rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <FiMail style={{ color: "#6b7280" }} />
                            <span>{selectedClass.teacherEmail}</span>
                          </div>
                        )}
                        {selectedClass.teacherPhone && (
                          <div
                            style={{
                              marginBottom: "0.25rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <FiPhone style={{ color: "#6b7280" }} />
                            <span>{selectedClass.teacherPhone}</span>
                          </div>
                        )}
                        <div
                          style={{ marginTop: "0.5rem", textAlign: "center" }}
                        >
                          <button
                            style={{
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              border: "none",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "0.25rem",
                              fontSize: "0.75rem",
                              cursor: "pointer",
                            }}
                            onClick={handleTeacherClick}
                          >
                            Xem chi tiết giáo viên
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Học sinh */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Học sinh</span>
                    {selectedClass.studentList &&
                      selectedClass.studentList.length > 0 && (
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#6b7280",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() => setShowStudentList(!showStudentList)}
                        >
                          {showStudentList ? (
                            <FiChevronUp />
                          ) : (
                            <FiChevronDown />
                          )}
                        </button>
                      )}
                  </div>
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FiUsers style={{ color: "#3b82f6" }} />
                      {selectedClass.currentStudents}/
                      {selectedClass.maxStudents || 20} học sinh
                    </div>

                    {/* Danh sách học sinh */}
                    {showStudentList &&
                      selectedClass.studentList &&
                      selectedClass.studentList.length > 0 && (
                        <div
                          style={{
                            marginTop: "0.75rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "0.375rem",
                            padding: "0.5rem",
                            maxHeight: "200px",
                            overflowY: "auto",
                          }}
                        >
                          <ul
                            style={{ listStyle: "none", padding: 0, margin: 0 }}
                          >
                            {selectedClass.studentList.map((student, index) => (
                              <li
                                key={student.id || index}
                                style={{
                                  padding: "0.5rem",
                                  borderBottom:
                                    index < selectedClass.studentList.length - 1
                                      ? "1px solid #e5e7eb"
                                      : "none",
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  fontSize: "0.875rem",
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
                                <span>
                                  {student.name ||
                                    student.userId?.name ||
                                    `Học sinh ${index + 1}`}
                                </span>
                                {student.discount !== undefined && (
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
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                {/* Học phí */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Học phí mỗi buổi
                  </div>
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiDollarSign style={{ color: "#3b82f6" }} />
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(selectedClass.feePerLesson)}
                  </div>
                </div>
              </div>
            </div>

            {/* Lịch học */}
            <div
              className="class-detail-section"
              style={{
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#1f2937",
                }}
              >
                <FiCalendar style={{ color: "#3b82f6" }} />
                Lịch học
              </h3>

              <div
                className="schedule-info"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "1rem",
                }}
              >
                {/* Ngày học */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Ngày học trong tuần
                  </div>
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                    }}
                  >
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
                              padding: "0.25rem 0.75rem",
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              borderRadius: "9999px",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                            }}
                          >
                            {getWeekdayLabel(day)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: "#6b7280" }}>Chưa có lịch học</span>
                    )}
                  </div>
                </div>

                {/* Thời gian học */}
                {selectedClass.schedule && (
                  <div
                    className="info-card"
                    style={{
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      className="info-label"
                      style={{
                        fontWeight: "500",
                        color: "#6b7280",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Thời gian học
                    </div>
                    <div
                      className="info-value"
                      style={{
                        fontWeight: "500",
                        color: "#111827",
                      }}
                    >
                      {selectedClass.schedule.startTime &&
                      selectedClass.schedule.endTime ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <FiClock style={{ color: "#3b82f6" }} />
                          {selectedClass.schedule.startTime} -{" "}
                          {selectedClass.schedule.endTime}
                        </div>
                      ) : (
                        <span style={{ color: "#6b7280" }}>
                          Chưa có giờ học
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Ngày bắt đầu */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Thời gian bắt đầu
                  </div>
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiClock style={{ color: "#3b82f6" }} />
                    {formatDate(selectedClass.startDate)}
                  </div>
                </div>

                {/* Ngày kết thúc */}
                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-label"
                    style={{
                      fontWeight: "500",
                      color: "#6b7280",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Thời gian kết thúc
                  </div>
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiClock style={{ color: "#3b82f6" }} />
                    {formatDate(selectedClass.endDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Thống kê điểm danh (nếu có) */}
            {selectedClass.attendanceStats && (
              <div
                className="class-detail-section"
                style={{
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#1f2937",
                  }}
                >
                  <FiBarChart2 style={{ color: "#3b82f6" }} />
                  Thống kê điểm danh
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f0fdf4",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#166534",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FiCheckCircle />
                      Đã học
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#166534",
                      }}
                    >
                      {selectedClass.attendanceStats.attended || 0} buổi
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#fef2f2",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #fee2e2",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#991b1b",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FiInfo />
                      Vắng mặt
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#991b1b",
                      }}
                    >
                      {selectedClass.attendanceStats.missed || 0} buổi
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#4b5563",
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FiCalendar />
                      Tổng số buổi
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "600",
                        color: "#4b5563",
                      }}
                    >
                      {selectedClass.attendanceStats.total || 0} buổi
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin địa điểm (nếu có) */}
            {selectedClass.location && (
              <div
                className="class-detail-section"
                style={{
                  marginBottom: "2rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#1f2937",
                  }}
                >
                  <FiHome style={{ color: "#3b82f6" }} />
                  Địa điểm học
                </h3>

                <div
                  className="info-card"
                  style={{
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    className="info-value"
                    style={{
                      fontWeight: "500",
                      color: "#111827",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FiMapPin style={{ color: "#3b82f6" }} />
                    {selectedClass.location}
                  </div>
                </div>
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
                paddingTop: "1rem",
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
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassDetailModal;
