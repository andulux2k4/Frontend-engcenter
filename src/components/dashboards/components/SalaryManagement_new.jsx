import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BiMoney,
  BiCalendar,
  BiUser,
  BiSearch,
  BiFilter,
} from "react-icons/bi";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiDollarSign,
} from "react-icons/fi";
import apiService from "../../../services/api";

// Mock data for development - replace with real API calls
const mockTeacherWages = [
  {
    id: 1,
    teacherId: "T001",
    teacherName: "Sarah Johnson",
    teacherEmail: "sarah@tttenglish.edu.vn",
    teacherPhone: "0912345678",
    sessionsCount: 20,
    wagePerSession: 200000,
    totalWage: 4000000,
    paidAmount: 4000000,
    remainingAmount: 0,
    month: 3,
    year: 2024,
    paymentStatus: "paid",
    paymentDate: "2024-03-15",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-15",
  },
  {
    id: 2,
    teacherId: "T002",
    teacherName: "John Smith",
    teacherEmail: "john@tttenglish.edu.vn",
    teacherPhone: "0923456789",
    sessionsCount: 18,
    wagePerSession: 180000,
    totalWage: 3240000,
    paidAmount: 3240000,
    remainingAmount: 0,
    month: 3,
    year: 2024,
    paymentStatus: "paid",
    paymentDate: "2024-03-14",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-14",
  },
  {
    id: 3,
    teacherId: "T003",
    teacherName: "Mary Wilson",
    teacherEmail: "mary@tttenglish.edu.vn",
    teacherPhone: "0934567890",
    sessionsCount: 15,
    wagePerSession: 220000,
    totalWage: 3300000,
    paidAmount: 1000000,
    remainingAmount: 2300000,
    month: 3,
    year: 2024,
    paymentStatus: "partial",
    paymentDate: null,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-10",
  },
  {
    id: 4,
    teacherId: "T004",
    teacherName: "Robert Brown",
    teacherEmail: "robert@tttenglish.edu.vn",
    teacherPhone: "0945678901",
    sessionsCount: 12,
    wagePerSession: 190000,
    totalWage: 2280000,
    paidAmount: 0,
    remainingAmount: 2280000,
    month: 3,
    year: 2024,
    paymentStatus: "unpaid",
    paymentDate: null,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01",
  },
  {
    id: 5,
    teacherId: "T005",
    teacherName: "Emma Davis",
    teacherEmail: "emma@tttenglish.edu.vn",
    teacherPhone: "0956789012",
    sessionsCount: 22,
    wagePerSession: 210000,
    totalWage: 4620000,
    paidAmount: 0,
    remainingAmount: 4620000,
    month: 4,
    year: 2024,
    paymentStatus: "unpaid",
    paymentDate: null,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01",
  },
];

const mockTeachers = [
  { id: "T001", name: "Sarah Johnson" },
  { id: "T002", name: "John Smith" },
  { id: "T003", name: "Mary Wilson" },
  { id: "T004", name: "Robert Brown" },
  { id: "T005", name: "Emma Davis" },
];

const SalaryManagement = ({ user }) => {
  // State for wage data
  const [wagesList, setWagesList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    teacherId: "",
    paymentStatus: "",
    searchTerm: "",
    sortBy: "teacherName",
    sortOrder: "asc",
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Statistics
  const [stats, setStats] = useState({
    totalWages: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalTeachers: 0,
    paidTeachers: 0,
    unpaidTeachers: 0,
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [showCalculateModal, setShowCalculateModal] = useState(false);

  // Fetch teachers list
  const fetchTeachers = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await apiService.getTeachers(user.token);
      // setTeachersList(response.data);
      setTeachersList(mockTeachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }, [user]);

  // Fetch wage data with filters
  const fetchWageData = useCallback(async () => {
    if (!user?.token) return;

    setLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const params = {
      //   month: filters.month,
      //   year: filters.year,
      //   teacherId: filters.teacherId || undefined,
      //   paymentStatus: filters.paymentStatus || undefined,
      //   page: pagination.page,
      //   limit: pagination.limit,
      //   sort: `${filters.sortBy}:${filters.sortOrder}`,
      //   includeList: true,
      //   includeStats: true
      // };
      // const response = await apiService.getTeacherWages(user.token, params);

      // Mock implementation
      setTimeout(() => {
        let filteredData = [...mockTeacherWages];

        // Apply filters
        if (filters.month) {
          filteredData = filteredData.filter(
            (item) => item.month === parseInt(filters.month)
          );
        }
        if (filters.year) {
          filteredData = filteredData.filter(
            (item) => item.year === parseInt(filters.year)
          );
        }
        if (filters.teacherId) {
          filteredData = filteredData.filter(
            (item) => item.teacherId === filters.teacherId
          );
        }
        if (filters.paymentStatus) {
          filteredData = filteredData.filter(
            (item) => item.paymentStatus === filters.paymentStatus
          );
        }
        if (filters.searchTerm) {
          filteredData = filteredData.filter(
            (item) =>
              item.teacherName
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase()) ||
              item.teacherEmail
                .toLowerCase()
                .includes(filters.searchTerm.toLowerCase())
          );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
          let aValue = a[filters.sortBy];
          let bValue = b[filters.sortBy];

          if (filters.sortBy === "teacherName") {
            aValue = a.teacherName;
            bValue = b.teacherName;
          }

          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (filters.sortOrder === "asc") {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });

        // Calculate stats
        const totalWages = filteredData.reduce(
          (sum, item) => sum + item.totalWage,
          0
        );
        const totalPaid = filteredData.reduce(
          (sum, item) => sum + item.paidAmount,
          0
        );
        const totalRemaining = filteredData.reduce(
          (sum, item) => sum + item.remainingAmount,
          0
        );
        const paidTeachers = filteredData.filter(
          (item) => item.paymentStatus === "paid"
        ).length;
        const unpaidTeachers = filteredData.filter(
          (item) => item.paymentStatus === "unpaid"
        ).length;

        setStats({
          totalWages,
          totalPaid,
          totalRemaining,
          totalTeachers: filteredData.length,
          paidTeachers,
          unpaidTeachers,
        });

        // Apply pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setWagesList(paginatedData);
        setPagination((prev) => ({
          ...prev,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / pagination.limit),
        }));

        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching wage data:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  }, [user, filters, pagination.page, pagination.limit]);

  // Load initial data
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    fetchWageData();
  }, [fetchWageData]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Handle calculate wages
  const handleCalculateWages = async () => {
    if (!filters.month || !filters.year) {
      alert("Vui lòng chọn tháng và năm để tính lương");
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await apiService.calculateTeacherWages(user.token, {
      //   month: filters.month,
      //   year: filters.year
      // });

      // Mock implementation
      setTimeout(() => {
        alert("Tính lương thành công!");
        setShowCalculateModal(false);
        fetchWageData();
      }, 1000);
    } catch (error) {
      console.error("Error calculating wages:", error);
      alert("Lỗi khi tính lương. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  // Handle payment
  const handlePayment = async (paymentAmount) => {
    if (!paymentData) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await apiService.payTeacherWage(user.token, paymentData.id, {
      //   amount: paymentAmount
      // });

      // Mock implementation
      setTimeout(() => {
        setWagesList((prev) =>
          prev.map((item) => {
            if (item.id === paymentData.id) {
              const newPaidAmount = item.paidAmount + paymentAmount;
              const newRemainingAmount = item.totalWage - newPaidAmount;
              const newPaymentStatus =
                newRemainingAmount <= 0 ? "paid" : "partial";

              return {
                ...item,
                paidAmount: newPaidAmount,
                remainingAmount: newRemainingAmount,
                paymentStatus: newPaymentStatus,
                paymentDate:
                  newPaymentStatus === "paid"
                    ? new Date().toISOString().split("T")[0]
                    : item.paymentDate,
              };
            }
            return item;
          })
        );

        setShowPaymentModal(false);
        setPaymentData(null);
        fetchWageData();
      }, 500);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Lỗi khi thanh toán. Vui lòng thử lại.");
    }
    setLoading(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: "Đã trả", color: "#10b981", bgColor: "#ecfdf5" },
      partial: { label: "Trả một phần", color: "#f59e0b", bgColor: "#fffbeb" },
      unpaid: { label: "Chưa trả", color: "#ef4444", bgColor: "#fef2f2" },
    };

    const config = statusConfig[status] || statusConfig.unpaid;

    return (
      <span
        style={{
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: "500",
          color: config.color,
          backgroundColor: config.bgColor,
        }}
      >
        {config.label}
      </span>
    );
  };

  return (
    <section style={{ padding: "0", margin: "0" }}>
      {/* Header */}
      <div
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
          style={{
            display: "flex",
            alignItems: "center",
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          <BiMoney style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Thanh toán lương giáo viên
        </h2>
        <button
          onClick={() => setShowCalculateModal(true)}
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
          <BiCalendar />
          Tính lương
        </button>
      </div>

      {/* Statistics Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Tổng lương
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#111827",
                }}
              >
                {formatCurrency(stats.totalWages)}
              </p>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#dbeafe",
                borderRadius: "0.5rem",
              }}
            >
              <FiDollarSign style={{ color: "#3b82f6", fontSize: "1.5rem" }} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Đã thanh toán
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#10b981",
                }}
              >
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#dcfce7",
                borderRadius: "0.5rem",
              }}
            >
              <FiCheck style={{ color: "#10b981", fontSize: "1.5rem" }} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>
                Còn lại
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "#ef4444",
                }}
              >
                {formatCurrency(stats.totalRemaining)}
              </p>
            </div>
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#fef2f2",
                borderRadius: "0.5rem",
              }}
            >
              <FiX style={{ color: "#ef4444", fontSize: "1.5rem" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1", minWidth: "150px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Tháng:
          </label>
          <select
            value={filters.month}
            onChange={(e) =>
              handleFilterChange("month", parseInt(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "150px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Năm:
          </label>
          <select
            value={filters.year}
            onChange={(e) =>
              handleFilterChange("year", parseInt(e.target.value))
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Giáo viên:
          </label>
          <select
            value={filters.teacherId}
            onChange={(e) => handleFilterChange("teacherId", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="">Tất cả giáo viên</option>
            {teachersList.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Trạng thái:
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) =>
              handleFilterChange("paymentStatus", e.target.value)
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="paid">Đã trả</option>
            <option value="partial">Trả một phần</option>
            <option value="unpaid">Chưa trả</option>
          </select>
        </div>

        <div style={{ flex: "2", minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            Tìm kiếm:
          </label>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            border: "1px solid #fecaca",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              width: "2rem",
              height: "2rem",
              border: "3px solid #e5e7eb",
              borderTop: "3px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      )}

      {/* Data Table */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
              minWidth: "1000px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFilterChange("sortBy", "teacherName")}
                >
                  HỌ VÀ TÊN
                  {filters.sortBy === "teacherName" && (
                    <span style={{ marginLeft: "0.5rem" }}>
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFilterChange("sortBy", "sessionsCount")}
                >
                  SỐ BUỔI DẠY
                  {filters.sortBy === "sessionsCount" && (
                    <span style={{ marginLeft: "0.5rem" }}>
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFilterChange("sortBy", "wagePerSession")}
                >
                  LƯƠNG/BUỔI
                  {filters.sortBy === "wagePerSession" && (
                    <span style={{ marginLeft: "0.5rem" }}>
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFilterChange("sortBy", "totalWage")}
                >
                  TỔNG LƯƠNG
                  {filters.sortBy === "totalWage" && (
                    <span style={{ marginLeft: "0.5rem" }}>
                      {filters.sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  THỜI GIAN
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  TRẠNG THÁI
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  THAO TÁC
                </th>
              </tr>
            </thead>
            <tbody>
              {wagesList.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#6b7280",
                      fontStyle: "italic",
                    }}
                  >
                    {loading ? "Đang tải..." : "Không có dữ liệu"}
                  </td>
                </tr>
              ) : (
                wagesList.map((wage) => (
                  <tr
                    key={wage.id}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    onClick={() => {
                      setDetailData(wage);
                      setShowDetailModal(true);
                    }}
                  >
                    <td style={{ padding: "1rem" }}>
                      <div>
                        <div style={{ fontWeight: "600", color: "#111827" }}>
                          {wage.teacherName}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          {wage.teacherEmail}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span style={{ fontWeight: "600", color: "#111827" }}>
                        {wage.sessionsCount}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        {formatCurrency(wage.wagePerSession)}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                      <span style={{ fontWeight: "600", color: "#059669" }}>
                        {formatCurrency(wage.totalWage)}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <span style={{ color: "#6b7280" }}>
                        {wage.month}/{wage.year}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {getStatusBadge(wage.paymentStatus)}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          justifyContent: "center",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setDetailData(wage);
                            setShowDetailModal(true);
                          }}
                          style={{
                            padding: "0.5rem",
                            backgroundColor: "#f3f4f6",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FiEye style={{ fontSize: "0.875rem" }} />
                        </button>
                        {wage.paymentStatus !== "paid" && (
                          <button
                            onClick={() => {
                              setPaymentData(wage);
                              setShowPaymentModal(true);
                            }}
                            style={{
                              padding: "0.5rem",
                              backgroundColor: "#3b82f6",
                              color: "white",
                              border: "1px solid #3b82f6",
                              borderRadius: "0.375rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FiDollarSign style={{ fontSize: "0.875rem" }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.5rem",
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
            trong tổng số {pagination.total} kết quả
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: pagination.page === 1 ? "#f3f4f6" : "#3b82f6",
                color: pagination.page === 1 ? "#9ca3af" : "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor: pagination.page === 1 ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
              }}
            >
              Trang trước
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    pagination.page === i + 1 ? "#3b82f6" : "#f3f4f6",
                  color: pagination.page === i + 1 ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor:
                  pagination.page === pagination.totalPages
                    ? "#f3f4f6"
                    : "#3b82f6",
                color:
                  pagination.page === pagination.totalPages
                    ? "#9ca3af"
                    : "white",
                border: "none",
                borderRadius: "0.375rem",
                cursor:
                  pagination.page === pagination.totalPages
                    ? "not-allowed"
                    : "pointer",
                fontSize: "0.875rem",
              }}
            >
              Trang sau
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailData && (
        <DetailModal
          detailData={detailData}
          onClose={() => setShowDetailModal(false)}
          onPayment={(data) => {
            setShowDetailModal(false);
            setPaymentData(data);
            setShowPaymentModal(true);
          }}
          formatCurrency={formatCurrency}
          getStatusBadge={getStatusBadge}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentData && (
        <PaymentModal
          paymentData={paymentData}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentData(null);
          }}
          onPayment={handlePayment}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Calculate Wages Modal */}
      {showCalculateModal && (
        <CalculateModal
          onClose={() => setShowCalculateModal(false)}
          onCalculate={handleCalculateWages}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </section>
  );
};

// Detail Modal Component
const DetailModal = ({
  detailData,
  onClose,
  onPayment,
  formatCurrency,
  getStatusBadge,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            <BiMoney style={{ marginRight: "0.5rem", color: "#3b82f6" }} />
            Chi tiết lương giáo viên
          </h3>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.875rem",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Họ tên:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {detailData.teacherName}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Email:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {detailData.teacherEmail}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Số điện thoại:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {detailData.teacherPhone}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Số buổi dạy:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {detailData.sessionsCount} buổi
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Lương/buổi:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#059669",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {formatCurrency(detailData.wagePerSession)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Tổng lương:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#059669",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {formatCurrency(detailData.totalWage)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Đã thanh toán:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#10b981",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {formatCurrency(detailData.paidAmount)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Còn lại:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#ef4444",
                    fontWeight: "600",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {formatCurrency(detailData.remainingAmount)}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Thời gian:
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    color: "#111827",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Tháng {detailData.month}/{detailData.year}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "0.75rem",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Trạng thái:
                </td>
                <td style={{ padding: "0.75rem" }}>
                  {getStatusBadge(detailData.paymentStatus)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#f3f4f6",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
            }}
          >
            Đóng
          </button>
          {detailData.paymentStatus !== "paid" && (
            <button
              onClick={() => onPayment(detailData)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "1px solid #3b82f6",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Thanh toán
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({ paymentData, onClose, onPayment, formatCurrency }) => {
  const [paymentAmount, setPaymentAmount] = useState(
    paymentData.remainingAmount
  );
  const [paymentNote, setPaymentNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentAmount <= 0 || paymentAmount > paymentData.remainingAmount) {
      alert("Số tiền thanh toán không hợp lệ");
      return;
    }
    onPayment(paymentAmount);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            <FiDollarSign style={{ marginRight: "0.5rem", color: "#3b82f6" }} />
            Thanh toán lương
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "#f8fafc",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "600", color: "#374151" }}>
                  Giáo viên:
                </span>
                <span style={{ color: "#111827" }}>
                  {paymentData.teacherName}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "600", color: "#374151" }}>
                  Tổng lương:
                </span>
                <span style={{ color: "#059669", fontWeight: "600" }}>
                  {formatCurrency(paymentData.totalWage)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontWeight: "600", color: "#374151" }}>
                  Đã thanh toán:
                </span>
                <span style={{ color: "#10b981", fontWeight: "600" }}>
                  {formatCurrency(paymentData.paidAmount)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "600", color: "#374151" }}>
                  Còn lại:
                </span>
                <span style={{ color: "#ef4444", fontWeight: "600" }}>
                  {formatCurrency(paymentData.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Số tiền thanh toán:
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseInt(e.target.value))}
              max={paymentData.remainingAmount}
              min={1}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Ghi chú (tùy chọn):
            </label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              rows="3"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                resize: "vertical",
              }}
              placeholder="Ghi chú về thanh toán..."
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "1px solid #3b82f6",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Thanh toán
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Calculate Modal Component
const CalculateModal = ({ onClose, onCalculate, filters, setFilters }) => {
  const [selectedMonth, setSelectedMonth] = useState(filters.month);
  const [selectedYear, setSelectedYear] = useState(filters.year);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      month: selectedMonth,
      year: selectedYear,
    }));
    onCalculate();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "0.75rem",
          padding: "2rem",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "#111827",
            }}
          >
            <BiCalendar style={{ marginRight: "0.5rem", color: "#3b82f6" }} />
            Tính lương theo tháng
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Tháng:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                backgroundColor: "white",
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Năm:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                backgroundColor: "white",
              }}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "1px solid #3b82f6",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Tính lương
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryManagement;
