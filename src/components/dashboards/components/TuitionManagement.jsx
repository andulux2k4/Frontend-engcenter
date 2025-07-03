import React, { useState, useEffect } from "react";
import { MdPayment } from "react-icons/md";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
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

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTuitions = filteredTuitionList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTuitionList.length / itemsPerPage);

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
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h2 className="section-title">
          <MdPayment className="icon" />
          Quản lý Học phí
        </h2>
        <button
          className="btn btn-primary"
          style={{ background: "#b30000" }}
          onClick={handleAddTuition}
          disabled={loading}
        >
          <FiPlus style={{ marginRight: "0.5rem" }} />
          Thêm khoản học phí
        </button>
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

      {/* Bộ lọc và tìm kiếm */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          marginBottom: "1.5rem",
          background: "#fff",
          padding: "1rem 1.5rem",
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <label
            style={{
              fontWeight: "500",
              color: "#374151",
              marginRight: "0.5rem",
            }}
          >
            Trạng thái:
          </label>
          <select
            value={tuitionStatusFilter}
            onChange={(e) => setTuitionStatusFilter(e.target.value)}
            style={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              fontSize: "0.875rem",
            }}
          >
            <option value="all">Tất cả</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Tìm kiếm học viên hoặc lớp học..."
            value={tuitionSearch}
            onChange={(e) => setTuitionSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              fontSize: "0.875rem",
            }}
          />
        </div>
        <div
          style={{ fontWeight: "600", color: "#166534", fontSize: "0.95rem" }}
        >
          Tổng thu: {totalPaid.toLocaleString()} VNĐ
        </div>
        <div
          style={{ fontWeight: "600", color: "#b91c1c", fontSize: "0.95rem" }}
        >
          Chưa thu: {totalUnpaid.toLocaleString()} VNĐ
        </div>
      </div>

      {/* Tuition table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Học viên</th>
              <th>Lớp</th>
              <th>Số buổi</th>
              <th>Tổng tiền</th>
              <th>Đã đóng</th>
              <th style={{ width: "10%" }}>Ngày</th>
              <th style={{ width: "15%" }}>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  <div className="loading-spinner"></div>
                  <div style={{ marginTop: "1rem", color: "#6b7280" }}>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
            ) : filteredTuitionList.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#b30000",
                  }}
                >
                  Không có dữ liệu học phí
                </td>
              </tr>
            ) : (
              paginatedTuitions.map((tuition) => (
                <tr
                  key={tuition.id}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleRowClick(tuition, e)}
                >
                  <td style={{ fontWeight: "500" }}>{tuition.student}</td>
                  <td>{tuition.class}</td>
                  <td style={{ textAlign: "center" }}>{tuition.sessions}</td>
                  <td style={{ color: "#b30000", fontWeight: "500" }}>
                    {tuition.amount?.toLocaleString()} VNĐ
                  </td>
                  <td style={{ color: "#166534", fontWeight: "500" }}>
                    {(tuition.paid || 0).toLocaleString()} VNĐ
                  </td>
                  <td>{tuition.date}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        tuition.status === "Đã duyệt"
                          ? "success"
                          : tuition.status === "Từ chối"
                          ? "danger"
                          : "warning"
                      }`}
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontWeight: "500",
                        fontSize: "0.75rem",
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
                            ? "#b91c1c"
                            : "#92400e",
                      }}
                    >
                      {tuition.status}
                    </span>
                  </td>
                  <td style={{ display: "flex", gap: "0.5rem" }}>
                    {tuition.status === "Chờ duyệt" && (
                      <>
                        <button
                          className="action-btn secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveTuition(tuition.id);
                          }}
                          disabled={loading}
                        >
                          <FiCheckCircle style={{ fontSize: "0.875rem" }} />
                          Duyệt
                        </button>
                        <button
                          className="action-btn danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRejectTuition(tuition.id);
                          }}
                          disabled={loading}
                        >
                          <FiTrash2 style={{ fontSize: "0.875rem" }} />
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      className="action-btn secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTuition(tuition);
                        setShowTuitionDetail(true);
                      }}
                      disabled={loading}
                    >
                      <FiEye style={{ fontSize: "0.875rem" }} />
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredTuitionList.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 1.5rem",
            borderTop: "1px solid #e5e7eb",
            backgroundColor: "white",
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#6b7280",
            }}
          >
            Hiển thị {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredTuitionList.length)} trong{" "}
            {filteredTuitionList.length} khoản học phí
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: currentPage === 1 ? "#f3f4f6" : "white",
                color: currentPage === 1 ? "#9ca3af" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
              }}
            >
              Trước
            </button>

            {totalPages > 1 && (
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => paginate(pageNum)}
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          currentPage === pageNum ? "#3b82f6" : "white",
                        color: currentPage === pageNum ? "white" : "#374151",
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
                })}
              </div>
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  currentPage === totalPages ? "#f3f4f6" : "white",
                color: currentPage === totalPages ? "#9ca3af" : "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                transition: "all 0.2s ease",
              }}
            >
              Sau
            </button>
          </div>
        </div>
      )}

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
