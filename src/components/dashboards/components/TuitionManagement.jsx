import React, { useState, useEffect } from "react";
import { MdPayment } from "react-icons/md";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiCheck, FiX } from "react-icons/fi";
import TuitionDetailModal from "./modals/TuitionDetailModal";
import TuitionFormModal from "./modals/TuitionFormModal";

const TuitionManagement = ({ user, loading, error, setError }) => {
  // State for tuition data
  const [tuitionList, setTuitionList] = useState([
    {
      id: 1,
      student: "Alice Brown",
      parent: "Mrs. Brown",
      class: "IELTS Advanced",
      sessions: 20,
      amount: 5000000,
      paid: 5000000,
      date: "2024-03-15",
      status: "Đã duyệt",
      proofImage: "",
    },
    {
      id: 2,
      student: "Bob Wilson",
      parent: "Mr. Wilson",
      class: "TOEIC Preparation",
      sessions: 18,
      amount: 5000000,
      paid: 0,
      date: "2024-03-14",
      status: "Chờ duyệt",
      proofImage: "",
    },
    {
      id: 3,
      student: "Charlie Davis",
      parent: "Mr. Davis",
      class: "TOEIC Basic",
      sessions: 15,
      amount: 4000000,
      paid: 2000000,
      date: "2024-03-13",
      status: "Chờ duyệt",
      proofImage: "",
    },
    {
      id: 4,
      student: "Diana Evans",
      parent: "Mrs. Evans",
      class: "IELTS Foundation",
      sessions: 22,
      amount: 6000000,
      paid: 6000000,
      date: "2024-03-12",
      status: "Đã duyệt",
      proofImage: "",
    },
  ]);

  // State for filter and search
  const [tuitionStatusFilter, setTuitionStatusFilter] = useState("all");
  const [tuitionSearch, setTuitionSearch] = useState("");

  // State for modals
  const [showTuitionDetail, setShowTuitionDetail] = useState(false);
  const [selectedTuition, setSelectedTuition] = useState(null);
  const [showTuitionForm, setShowTuitionForm] = useState(false);
  const [editingTuition, setEditingTuition] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Calculated values
  const totalPaid = tuitionList.reduce(
    (sum, item) => sum + (item.paid || 0),
    0
  );
  const totalUnpaid = tuitionList.reduce(
    (sum, item) => sum + item.amount - (item.paid || 0),
    0
  );

  // Filter tuition list based on status and search
  const filteredTuitionList = tuitionList.filter((tuition) => {
    const matchesStatus =
      tuitionStatusFilter === "all" || tuition.status === tuitionStatusFilter;
    const matchesSearch =
      tuition.student.toLowerCase().includes(tuitionSearch.toLowerCase()) ||
      tuition.class.toLowerCase().includes(tuitionSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Use all filtered tuitions without pagination
  const displayedTuitions = filteredTuitionList;

  // Handle adding new tuition
  const handleAddTuition = () => {
    setEditingTuition(null);
    setShowTuitionForm(true);
  };

  // Handle row click to view details
  const handleRowClick = (tuition, e) => {
    // Don't open detail if clicked on action buttons
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;

    setSelectedTuition(tuition);
    setShowTuitionDetail(true);
  };

  // Handle approve tuition
  const handleApproveTuition = (id) => {
    setTuitionList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Đã duyệt" } : item
      )
    );
  };

  // Handle reject tuition
  const handleRejectTuition = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn từ chối khoản học phí này?")) {
      setTuitionList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Từ chối" } : item
        )
      );
    }
  };

  // Handle submit tuition form
  const handleSubmitTuition = (formData) => {
    if (editingTuition) {
      // Update existing tuition
      setTuitionList((prev) =>
        prev.map((item) =>
          item.id === editingTuition.id ? { ...formData, id: item.id } : item
        )
      );
    } else {
      // Add new tuition
      setTuitionList((prev) => [
        { ...formData, id: Date.now(), status: "Chờ duyệt" },
        ...prev,
      ]);
    }

    setShowTuitionForm(false);
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
          <MdPayment style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Quản lý Học phí
        </h2>
        <div className="section-actions">
          <button
            className="btn btn-primary"
            onClick={handleAddTuition}
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
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow:
                "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            }}
          >
            <FiPlus style={{ fontSize: "1rem" }} />
            Thêm khoản học phí
          </button>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fecaca",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Filter and Search Section */}
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
        {/* Status Filter */}
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
            value={tuitionStatusFilter}
            onChange={(e) => setTuitionStatusFilter(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
              minWidth: "120px",
            }}
          >
            <option value="all">Tất cả</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>

        {/* Search Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            minWidth: "300px",
            flex: 1,
          }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm học viên hoặc lớp học..."
            value={tuitionSearch}
            onChange={(e) => setTuitionSearch(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              flex: 1,
            }}
          />
        </div>

        {/* Summary Stats */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginLeft: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f0fdf4",
              borderRadius: "0.375rem",
              border: "1px solid #bbf7d0",
            }}
          >
            <span
              style={{
                fontWeight: "500",
                color: "#166534",
                fontSize: "0.875rem",
              }}
            >
              Đã thu:
            </span>
            <span
              style={{
                fontWeight: "600",
                color: "#166534",
                fontSize: "0.875rem",
              }}
            >
              {totalPaid.toLocaleString()} VNĐ
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#fef2f2",
              borderRadius: "0.375rem",
              border: "1px solid #fecaca",
            }}
          >
            <span
              style={{
                fontWeight: "500",
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              Chưa thu:
            </span>
            <span
              style={{
                fontWeight: "600",
                color: "#dc2626",
                fontSize: "0.875rem",
              }}
            >
              {totalUnpaid.toLocaleString()} VNĐ
            </span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div
        className="table-container"
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table
          className="data-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Học viên
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "left",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Lớp học
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Số buổi
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Tổng tiền
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Đã đóng
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Ngày
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  color: "#6b7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  <div className="loading-spinner"></div>
                  <div style={{ marginTop: "1rem" }}>Đang tải dữ liệu...</div>
                </td>
              </tr>
            ) : filteredTuitionList.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                  }}
                >
                  Không tìm thấy dữ liệu học phí
                </td>
              </tr>
            ) : (
              displayedTuitions.map((tuition) => (
                <tr
                  key={tuition.id}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onClick={(e) => handleRowClick(tuition, e)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#111827",
                      fontWeight: "500",
                    }}
                  >
                    {tuition.student}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                    }}
                  >
                    {tuition.class}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    {tuition.sessions}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#dc2626",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {tuition.amount?.toLocaleString()} VNĐ
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#059669",
                      fontWeight: "500",
                      textAlign: "right",
                    }}
                  >
                    {(tuition.paid || 0).toLocaleString()} VNĐ
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    {tuition.date}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor:
                          tuition.status === "Đã duyệt"
                            ? "#dcfce7"
                            : tuition.status === "Từ chối"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          tuition.status === "Đã duyệt"
                            ? "#166534"
                            : tuition.status === "Từ chối"
                            ? "#dc2626"
                            : "#92400e",
                      }}
                    >
                      {tuition.status}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem 0.75rem",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      {tuition.status === "Chờ duyệt" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveTuition(tuition.id);
                            }}
                            disabled={loading}
                            style={{
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              backgroundColor: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <FiCheck style={{ fontSize: "0.875rem" }} />
                            Duyệt
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectTuition(tuition.id);
                            }}
                            disabled={loading}
                            style={{
                              padding: "0.375rem 0.75rem",
                              fontSize: "0.75rem",
                              fontWeight: "500",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <FiX style={{ fontSize: "0.875rem" }} />
                            Từ chối
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTuition(tuition);
                          setShowTuitionDetail(true);
                        }}
                        disabled={loading}
                        style={{
                          padding: "0.375rem 0.75rem",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          backgroundColor: "#3b82f6",
                          color: "white",
                          border: "none",
                          borderRadius: "0.375rem",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <FiEye style={{ fontSize: "0.875rem" }} />
                        Xem
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tuition Detail Modal */}
      {showTuitionDetail && selectedTuition && (
        <TuitionDetailModal
          tuition={selectedTuition}
          onClose={() => setShowTuitionDetail(false)}
        />
      )}

      {/* Tuition Form Modal */}
      {showTuitionForm && (
        <TuitionFormModal
          show={showTuitionForm}
          onClose={() => setShowTuitionForm(false)}
          onSubmit={handleSubmitTuition}
          editingTuition={editingTuition}
          loading={loading}
        />
      )}
    </section>
  );
};

export default TuitionManagement;
