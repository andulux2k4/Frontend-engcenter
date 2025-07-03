import React, { useState, useEffect } from "react";
import { BiMoney } from "react-icons/bi";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import apiService from "../../../services/api";

// Reusable Pagination Component (if not available globally)
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  loading = false,
  itemName = "items",
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} {itemName}
      </div>

      <div className="pagination-buttons">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="pagination-button"
        >
          Trang trước
        </button>

        {/* Page numbers */}
        <div className="page-numbers">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageToShow;
            if (totalPages <= 5) {
              pageToShow = i + 1;
            } else if (currentPage <= 3) {
              pageToShow = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageToShow = totalPages - 4 + i;
            } else {
              pageToShow = currentPage - 2 + i;
            }

            return (
              <button
                key={pageToShow}
                onClick={() => onPageChange(pageToShow)}
                disabled={loading}
                className={`page-number ${
                  currentPage === pageToShow ? "active" : ""
                }`}
              >
                {pageToShow}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="pagination-button"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

const SalaryManagement = ({ user }) => {
  const [salaryList, setSalaryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [salaryModalData, setSalaryModalData] = useState(null);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Pagination state
  const [salaryPagination, setSalaryPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalSalaries: 0,
    limit: 10,
  });

  // Mock data for testing
  const mockTeacherData = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@tttenglish.edu.vn",
      phone: "0912345678",
      sessions: 20,
      wage: 200000,
      paidAmount: 4000000,
      period: "Tháng 3/2024",
    },
    {
      id: 2,
      name: "John Smith",
      email: "john@tttenglish.edu.vn",
      phone: "0923456789",
      sessions: 18,
      wage: 180000,
      paidAmount: 3240000,
      period: "Tháng 3/2024",
    },
    {
      id: 3,
      name: "Mary Wilson",
      email: "mary@tttenglish.edu.vn",
      phone: "0934567890",
      sessions: 15,
      wage: 220000,
      paidAmount: 1000000,
      period: "Tháng 3/2024",
    },
    {
      id: 4,
      name: "Robert Brown",
      email: "robert@tttenglish.edu.vn",
      phone: "0945678901",
      sessions: 12,
      wage: 190000,
      paidAmount: 0,
      period: "Tháng 3/2024",
    },
  ];

  // Fetch salary data from API
  const fetchSalaryData = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call when available
      // const response = await apiService.getTeacherSalaries(user.token);
      // if (response.success) {
      //   setSalaryList(response.data);
      // } else {
      //   setError(response.message || "Không thể tải dữ liệu lương");
      // }

      // Using mock data for now
      setTimeout(() => {
        setSalaryList(mockTeacherData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching salary data:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Calculate pagination
  useEffect(() => {
    const total = salaryList.length;
    const pages = Math.ceil(total / salaryPagination.limit) || 1;

    setSalaryPagination((prev) => ({
      ...prev,
      totalSalaries: total,
      totalPages: pages,
      currentPage: Math.min(prev.currentPage, pages),
    }));
  }, [salaryList, salaryPagination.limit]);

  // Get paginated salaries
  const paginatedSalaries = salaryList.slice(
    (salaryPagination.currentPage - 1) * salaryPagination.limit,
    salaryPagination.currentPage * salaryPagination.limit
  );

  // Load initial data
  useEffect(() => {
    fetchSalaryData();
  }, [user?.token]);

  // Handle calculating salary for a specific month
  const handleCalculateSalary = () => {
    if (!selectedMonth) {
      alert("Vui lòng chọn tháng để tính lương");
      return;
    }

    // TODO: Replace with actual API call when available
    // In a real implementation, this would fetch attendance data for the selected month
    // and calculate teacher salaries based on that

    // For now, just close the modal
    setShowMonthModal(false);

    // And update the period for all teachers
    setSalaryList((prev) =>
      prev.map((teacher) => ({
        ...teacher,
        period: `Tháng ${selectedMonth}/${selectedYear}`,
      }))
    );
  };

  // Handle payment for a teacher
  const handlePaySalary = () => {
    if (!salaryModalData) return;

    const { teacher, amount } = salaryModalData;

    // Update the paid amount for this teacher
    setSalaryList((prev) =>
      prev.map((t) =>
        t.id === teacher.id
          ? { ...t, paidAmount: (t.paidAmount || 0) + Number(amount) }
          : t
      )
    );

    setShowSalaryModal(false);
  };

  // Handle editing teacher salary information
  const handleEditSalary = () => {
    if (!editData) return;

    // Update the teacher in the list
    setSalaryList((prev) =>
      prev.map((t) => (t.id === editData.id ? { ...editData } : t))
    );

    setShowEditModal(false);
  };

  return (
    <section className="salary-section">
      <div className="section-header">
        <h2 className="section-title">
          <BiMoney className="icon" />
          Thanh toán lương giáo viên
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowMonthModal(true)}
        >
          Tính lương
        </button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Salary table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Số buổi dạy</th>
              <th>Lương/buổi</th>
              <th>
                <b>Tổng lương</b>
              </th>
              <th>
                <b>Thời gian</b>
              </th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {salaryList.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table">
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              paginatedSalaries.map((teacher) => {
                const total = teacher.sessions * teacher.wage;
                let status = "Chưa trả";
                if (teacher.paidAmount >= total) status = "Trả hết";
                else if (teacher.paidAmount > 0) status = "Còn thiếu";

                return (
                  <tr
                    key={teacher.id}
                    onClick={(e) => {
                      // Don't open modal when clicking action buttons
                      if (
                        e.target.tagName === "BUTTON" ||
                        e.target.closest("button")
                      )
                        return;
                      setDetailData(teacher);
                      setShowDetailModal(true);
                    }}
                  >
                    <td className="teacher-name">{teacher.name}</td>
                    <td className="center">{teacher.sessions}</td>
                    <td className="salary">
                      {teacher.wage.toLocaleString()} VNĐ
                    </td>
                    <td className="total-salary">
                      {total.toLocaleString()} VNĐ
                    </td>
                    <td>{teacher.period || ""}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          status === "Trả hết"
                            ? "success"
                            : status === "Còn thiếu"
                            ? "warning"
                            : ""
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {status === "Trả hết" ? (
                          <button
                            className="btn btn-secondary disabled"
                            disabled
                          >
                            Đã trả hết
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSalaryModal(true);
                              setSalaryModalData({
                                teacher,
                                amount: total - (teacher.paidAmount || 0),
                              });
                            }}
                          >
                            Thanh toán
                          </button>
                        )}

                        <button
                          className="btn btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditData({ ...teacher });
                            setShowEditModal(true);
                          }}
                        >
                          <FiEdit className="icon" /> Sửa
                        </button>

                        <button
                          className="btn btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Bạn có chắc muốn xóa giáo viên này khỏi bảng lương?"
                              )
                            ) {
                              setSalaryList((list) =>
                                list.filter((t) => t.id !== teacher.id)
                              );
                            }
                          }}
                        >
                          <FiTrash2 className="icon" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && salaryList.length > 0 && salaryPagination.totalPages > 1 && (
        <Pagination
          currentPage={salaryPagination.currentPage}
          totalPages={salaryPagination.totalPages}
          totalItems={salaryPagination.totalSalaries}
          limit={salaryPagination.limit}
          onPageChange={(newPage) =>
            setSalaryPagination((prev) => ({ ...prev, currentPage: newPage }))
          }
          loading={loading}
          itemName="giáo viên"
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && detailData && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <BiMoney className="icon" /> Chi tiết lương giáo viên
            </h3>
            <table className="detail-table">
              <tbody>
                <tr>
                  <td>Họ tên</td>
                  <td>{detailData.name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{detailData.email}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>{detailData.phone}</td>
                </tr>
                <tr>
                  <td>Số buổi dạy</td>
                  <td>{detailData.sessions}</td>
                </tr>
                <tr>
                  <td>Lương/buổi</td>
                  <td className="salary">
                    {detailData.wage?.toLocaleString()} VNĐ
                  </td>
                </tr>
                <tr>
                  <td>Tổng lương</td>
                  <td className="total-salary">
                    {(detailData.sessions * detailData.wage)?.toLocaleString()}{" "}
                    VNĐ
                  </td>
                </tr>
                <tr>
                  <td>Đã trả</td>
                  <td className="paid-amount">
                    {detailData.paidAmount?.toLocaleString()} VNĐ
                  </td>
                </tr>
                <tr>
                  <td>Thời gian</td>
                  <td>{detailData.period || ""}</td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td
                    className={
                      detailData.paidAmount >=
                      detailData.sessions * detailData.wage
                        ? "status-paid"
                        : detailData.paidAmount > 0
                        ? "status-partial"
                        : "status-unpaid"
                    }
                  >
                    {detailData.paidAmount >=
                    detailData.sessions * detailData.wage
                      ? "Trả hết"
                      : detailData.paidAmount > 0
                      ? "Còn thiếu"
                      : "Chưa trả"}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editData && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiEdit className="icon" /> Chỉnh sửa thông tin lương
            </h3>
            <div className="form-group">
              <label>Tên giáo viên</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                value={editData.phone}
                onChange={(e) =>
                  setEditData({ ...editData, phone: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Số buổi dạy</label>
              <input
                type="number"
                value={editData.sessions}
                onChange={(e) =>
                  setEditData({ ...editData, sessions: Number(e.target.value) })
                }
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Lương/buổi (VNĐ)</label>
              <input
                type="number"
                value={editData.wage}
                onChange={(e) =>
                  setEditData({ ...editData, wage: Number(e.target.value) })
                }
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Đã trả (VNĐ)</label>
              <input
                type="number"
                value={editData.paidAmount}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    paidAmount: Number(e.target.value),
                  })
                }
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Thời gian</label>
              <input
                type="text"
                value={editData.period}
                onChange={(e) =>
                  setEditData({ ...editData, period: e.target.value })
                }
                placeholder="Ví dụ: Tháng 3/2024"
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleEditSalary}>
                Lưu
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showSalaryModal && salaryModalData && (
        <div className="modal">
          <div className="modal-content">
            <h3>Thanh toán lương</h3>
            <p>
              Giáo viên: <strong>{salaryModalData.teacher.name}</strong>
            </p>
            <p>
              Tổng lương:{" "}
              <strong>
                {(
                  salaryModalData.teacher.sessions *
                  salaryModalData.teacher.wage
                ).toLocaleString()}{" "}
                VNĐ
              </strong>
            </p>
            <p>
              Đã trả:{" "}
              <strong>
                {(salaryModalData.teacher.paidAmount || 0).toLocaleString()} VNĐ
              </strong>
            </p>
            <p>
              Còn lại:{" "}
              <strong>{salaryModalData.amount.toLocaleString()} VNĐ</strong>
            </p>

            <div className="form-group">
              <label>Số tiền thanh toán (VNĐ)</label>
              <input
                type="number"
                value={salaryModalData.amount}
                onChange={(e) =>
                  setSalaryModalData({
                    ...salaryModalData,
                    amount: Number(e.target.value),
                  })
                }
                min="0"
                max={salaryModalData.amount}
                required
              />
            </div>

            <div className="form-group">
              <label>Ghi chú</label>
              <textarea
                placeholder="Nhập ghi chú nếu cần thiết"
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handlePaySalary}>
                Xác nhận thanh toán
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowSalaryModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month Selection Modal */}
      {showMonthModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chọn tháng tính lương</h3>
            <div className="form-group">
              <label>Tháng</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                required
              >
                <option value="">Chọn tháng</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Năm</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                required
              >
                {[2023, 2024, 2025].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleCalculateSalary}
              >
                Tính lương
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowMonthModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SalaryManagement;
