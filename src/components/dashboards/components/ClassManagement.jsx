import React from "react";
import {
  FiBook,
  FiPlus,
  FiBarChart2,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiCheck,
  FiDollarSign,
} from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi";
import ClassFormModal from "./modals/ClassFormModal";

const ClassManagement = ({
  classes,
  loading,
  error,
  classPagination,
  setClassPagination,
  classFilters,
  setClassFilters,
  allTeachers,
  showNewClassModal,
  setShowNewClassModal,
  showClassDetail,
  setShowClassDetail,
  showEditClass,
  setShowEditClass,
  selectedClass,
  setSelectedClass,
  editClassData,
  setEditClassData,
  newClass,
  setNewClass,
  handleCreateClass,
  handleDeleteClass,
  handleClassEdit,
  handleViewClassDetail,
  handleClassSelect,
  user,
}) => {
  // Reset filter function
  const handleResetClassFilters = () => {
    setClassFilters({
      summary: "true",
      year: "",
      grade: "",
      isAvailable: "",
      teacherId: "",
      sort: "",
    });
    setClassPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

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
          <FiBook style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Quản lý lớp học
        </h2>
        <div className="section-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowNewClassModal(true)}
            disabled={loading}
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
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              opacity: loading ? 0.5 : 1,
            }}
          >
            <FiPlus style={{ fontSize: "1rem" }} />
            Tạo lớp mới
          </button>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            backgroundColor: "#fed7d7",
            color: "#c53030",
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Class Filters */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiBarChart2 style={{ marginRight: "0.5rem", color: "#6366f1" }} />
          Lọc và tìm kiếm
        </h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          {/* Filter by Year */}
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
              Năm học:
            </label>
            <select
              value={classFilters.year}
              onChange={(e) =>
                setClassFilters((prev) => ({ ...prev, year: e.target.value }))
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
              <option value={new Date().getFullYear() - 1}>
                {new Date().getFullYear() - 1}
              </option>
              <option value={new Date().getFullYear()}>
                {new Date().getFullYear()}
              </option>
              <option value={new Date().getFullYear() + 1}>
                {new Date().getFullYear() + 1}
              </option>
            </select>
          </div>

          {/* Filter by Grade */}
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
              Khối lớp:
            </label>
            <select
              value={classFilters.grade}
              onChange={(e) =>
                setClassFilters((prev) => ({ ...prev, grade: e.target.value }))
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

          {/* Filter by Teacher */}
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
              Giáo viên:
            </label>
            <select
              value={classFilters.teacherId}
              onChange={(e) =>
                setClassFilters((prev) => ({
                  ...prev,
                  teacherId: e.target.value,
                }))
              }
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                backgroundColor: "white",
                fontSize: "0.875rem",
                minWidth: "180px",
              }}
            >
              <option value="">Tất cả</option>
              {allTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
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
              value={classFilters.isAvailable}
              onChange={(e) =>
                setClassFilters((prev) => ({
                  ...prev,
                  isAvailable: e.target.value,
                }))
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
              <option value="true">Đang học</option>
              <option value="false">Đã kết thúc</option>
            </select>
          </div>

          {/* Filter by Summary */}
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
              Hiển thị:
            </label>
            <select
              value={classFilters.summary}
              onChange={(e) =>
                setClassFilters((prev) => ({
                  ...prev,
                  summary: e.target.value,
                }))
              }
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                backgroundColor: "white",
                fontSize: "0.875rem",
              }}
            >
              <option value="true">Cơ bản</option>
              <option value="false">Chi tiết</option>
            </select>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleResetClassFilters}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f3f4f6",
              color: "#4b5563",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Đang tải dữ liệu...
          </div>
        ) : classes.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Không có lớp học nào
          </div>
        ) : (
          <>
            <div className="card-grid">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="card"
                  onClick={() =>
                    handleViewClassDetail && handleViewClassDetail(classItem.id)
                  }
                  style={{
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {/* Status indicator strip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "5px",
                      backgroundColor: classItem.isAvailable
                        ? "#22c55e"
                        : "#ef4444",
                    }}
                  ></div>

                  {/* Class header with class name and year */}
                  <h3 style={{ marginTop: "0.5rem" }}>
                    <FiBook style={{ color: "#3b82f6" }} />
                    {classItem.className}
                  </h3>

                  {/* Class info section */}
                  <div style={{ flex: 1 }}>
                    <p>
                      <span>
                        <FiCalendar style={{ color: "#6366f1" }} /> Năm học:
                      </span>
                      <span>{classItem.year}</span>
                    </p>

                    <p>
                      <span>
                        <HiAcademicCap style={{ color: "#8b5cf6" }} /> Khối:
                      </span>
                      <span>Lớp {classItem.grade}</span>
                    </p>

                    <p>
                      <span>
                        <FiUsers style={{ color: "#ec4899" }} /> Giáo viên:
                      </span>
                      <span>{classItem.teacherName || "Chưa phân công"}</span>
                    </p>

                    <p>
                      <span>
                        <FiUsers style={{ color: "#0ea5e9" }} /> Học sinh:
                      </span>
                      <span>
                        {classItem.currentStudents}/{classItem.maxStudents}
                      </span>
                    </p>

                    <p>
                      <span>
                        <FiDollarSign style={{ color: "#22c55e" }} /> Học phí:
                      </span>
                      <span>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(classItem.feePerLesson)}
                        /buổi
                      </span>
                    </p>
                  </div>

                  {/* Status display */}
                  <div className="status-container">
                    <p style={{ justifyContent: "space-between" }}>
                      <span>Trạng thái:</span>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontWeight: "500",
                          fontSize: "0.75rem",
                          backgroundColor: classItem.isAvailable
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: classItem.isAvailable ? "#166534" : "#991b1b",
                          textAlign: "center",
                        }}
                      >
                        {classItem.status}
                      </span>
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div
                    className="action-buttons"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      justifyContent: "flex-end",
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <button
                      className="btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClassEdit && handleClassEdit(classItem.id);
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
                      }}
                    >
                      <FiEdit style={{ fontSize: "0.875rem" }} />
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClass(classItem.id);
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
                      }}
                    >
                      <FiTrash2 style={{ fontSize: "0.875rem" }} />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {classes.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem 1.5rem",
                  marginTop: "1.5rem",
                  borderTop: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              >
                {/* Results info */}
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "#6b7280",
                  }}
                >
                  Hiển thị{" "}
                  {(classPagination.currentPage - 1) * classPagination.limit +
                    1}{" "}
                  -{" "}
                  {Math.min(
                    classPagination.currentPage * classPagination.limit,
                    classPagination.totalClasses
                  )}{" "}
                  trong tổng số {classPagination.totalClasses} lớp học
                </div>

                {/* Pagination controls */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() =>
                      setClassPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage - 1,
                      }))
                    }
                    disabled={classPagination.currentPage === 1 || loading}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor:
                        classPagination.currentPage === 1 ? "#f3f4f6" : "white",
                      color:
                        classPagination.currentPage === 1
                          ? "#9ca3af"
                          : "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      cursor:
                        classPagination.currentPage === 1
                          ? "not-allowed"
                          : "pointer",
                      fontSize: "0.875rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Trước
                  </button>

                  {classPagination.totalPages > 1 && (
                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      {Array.from(
                        { length: Math.min(5, classPagination.totalPages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() =>
                                setClassPagination((prev) => ({
                                  ...prev,
                                  currentPage: pageNum,
                                }))
                              }
                              style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor:
                                  classPagination.currentPage === pageNum
                                    ? "#3b82f6"
                                    : "white",
                                color:
                                  classPagination.currentPage === pageNum
                                    ? "white"
                                    : "#374151",
                                border: "1px solid #d1d5db",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                                fontSize: "0.875rem",
                                transition: "all 0.2s ease",
                              }}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}

                  <button
                    onClick={() =>
                      setClassPagination((prev) => ({
                        ...prev,
                        currentPage: prev.currentPage + 1,
                      }))
                    }
                    disabled={
                      classPagination.currentPage ===
                        classPagination.totalPages || loading
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor:
                        classPagination.currentPage ===
                        classPagination.totalPages
                          ? "#f3f4f6"
                          : "white",
                      color:
                        classPagination.currentPage ===
                        classPagination.totalPages
                          ? "#9ca3af"
                          : "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      cursor:
                        classPagination.currentPage ===
                        classPagination.totalPages
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
          </>
        )}
      </div>

      {/* New Class Modal */}
      <ClassFormModal
        isEdit={false}
        showModal={showNewClassModal}
        setShowModal={setShowNewClassModal}
        classData={newClass}
        setClassData={setNewClass}
        allTeachers={allTeachers}
        handleSubmit={handleCreateClass}
        loading={loading}
      />
    </section>
  );
};

export default ClassManagement;
