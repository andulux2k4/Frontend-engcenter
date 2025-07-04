import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BiMoney, BiCalendar, BiUser, BiSearch, BiFilter } from "react-icons/bi";
import { FiEye, FiEdit, FiTrash2, FiCheck, FiX, FiDollarSign } from "react-icons/fi";
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
    updatedAt: "2024-03-15"
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
    updatedAt: "2024-03-14"
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
    updatedAt: "2024-03-10"
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
    updatedAt: "2024-03-01"
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
    updatedAt: "2024-04-01"
  }
];

const mockTeachers = [
  { id: "T001", name: "Sarah Johnson" },
  { id: "T002", name: "John Smith" },
  { id: "T003", name: "Mary Wilson" },
  { id: "T004", name: "Robert Brown" },
  { id: "T005", name: "Emma Davis" }
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
    sortOrder: "asc"
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    totalWages: 0,
    totalPaid: 0,
    totalRemaining: 0,
    totalTeachers: 0,
    paidTeachers: 0,
    unpaidTeachers: 0
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
          filteredData = filteredData.filter(item => item.month === parseInt(filters.month));
        }
        if (filters.year) {
          filteredData = filteredData.filter(item => item.year === parseInt(filters.year));
        }
        if (filters.teacherId) {
          filteredData = filteredData.filter(item => item.teacherId === filters.teacherId);
        }
        if (filters.paymentStatus) {
          filteredData = filteredData.filter(item => item.paymentStatus === filters.paymentStatus);
        }
        if (filters.searchTerm) {
          filteredData = filteredData.filter(item => 
            item.teacherName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            item.teacherEmail.toLowerCase().includes(filters.searchTerm.toLowerCase())
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
        const totalWages = filteredData.reduce((sum, item) => sum + item.totalWage, 0);
        const totalPaid = filteredData.reduce((sum, item) => sum + item.paidAmount, 0);
        const totalRemaining = filteredData.reduce((sum, item) => sum + item.remainingAmount, 0);
        const paidTeachers = filteredData.filter(item => item.paymentStatus === "paid").length;
        const unpaidTeachers = filteredData.filter(item => item.paymentStatus === "unpaid").length;

        setStats({
          totalWages,
          totalPaid,
          totalRemaining,
          totalTeachers: filteredData.length,
          paidTeachers,
          unpaidTeachers
        });

        // Apply pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setWagesList(paginatedData);
        setPagination(prev => ({
          ...prev,
          total: filteredData.length,
          totalPages: Math.ceil(filteredData.length / pagination.limit)
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
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
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
        setWagesList(prev => prev.map(item => {
          if (item.id === paymentData.id) {
            const newPaidAmount = item.paidAmount + paymentAmount;
            const newRemainingAmount = item.totalWage - newPaidAmount;
            const newPaymentStatus = newRemainingAmount <= 0 ? "paid" : "partial";
            
            return {
              ...item,
              paidAmount: newPaidAmount,
              remainingAmount: newRemainingAmount,
              paymentStatus: newPaymentStatus,
              paymentDate: newPaymentStatus === "paid" ? new Date().toISOString().split('T')[0] : item.paymentDate
            };
          }
          return item;
        }));
        
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: "Đã trả", color: "#10b981", bgColor: "#ecfdf5" },
      partial: { label: "Trả một phần", color: "#f59e0b", bgColor: "#fffbeb" },
      unpaid: { label: "Chưa trả", color: "#ef4444", bgColor: "#fef2f2" }
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
          backgroundColor: config.bgColor
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
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb"
        }}
      >
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#111827"
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
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
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
          marginBottom: "1.5rem"
        }}
      >
        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Tổng lương</p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#111827" }}>
                {formatCurrency(stats.totalWages)}
              </p>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "#dbeafe", borderRadius: "0.5rem" }}>
              <FiDollarSign style={{ color: "#3b82f6", fontSize: "1.5rem" }} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Đã thanh toán</p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#10b981" }}>
                {formatCurrency(stats.totalPaid)}
              </p>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "#dcfce7", borderRadius: "0.5rem" }}>
              <FiCheck style={{ color: "#10b981", fontSize: "1.5rem" }} />
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#6b7280" }}>Còn lại</p>
              <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: "600", color: "#ef4444" }}>
                {formatCurrency(stats.totalRemaining)}
              </p>
            </div>
            <div style={{ padding: "0.75rem", backgroundColor: "#fef2f2", borderRadius: "0.5rem" }}>
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
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          flexWrap: "wrap"
        }}
      >
        <div style={{ flex: "1", minWidth: "150px" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
            Tháng:
          </label>
          <select
            value={filters.month}
            onChange={(e) => handleFilterChange("month", parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white"
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
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
            Năm:
          </label>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange("year", parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white"
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
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
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
              backgroundColor: "white"
            }}
          >
            <option value="">Tất cả giáo viên</option>
            {teachersList.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1", minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
            Trạng thái:
          </label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white"
            }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="paid">Đã trả</option>
            <option value="partial">Trả một phần</option>
            <option value="unpaid">Chưa trả</option>
          </select>
        </div>

        <div style={{ flex: "2", minWidth: "200px" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "500", color: "#374151" }}>
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
              fontSize: "0.875rem"
            }}
          />
        </div>
      </div>
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
          <BiMoney style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Thanh toán lương giáo viên
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowMonthModal(true)}
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
          Tính lương
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="error-message"
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
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            className="loading-spinner"
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

      {/* Salary table */}
      <div
        style={{
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          marginBottom: "1.5rem",
        }}
      >
        <table
          className="data-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            backgroundColor: "white",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Họ và tên
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Số buổi dạy
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Lương/buổi
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <b>Tổng lương</b>
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                <b>Thời gian</b>
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "left",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  backgroundColor: "#f8fafc",
                  fontWeight: "600",
                  color: "#374151",
                  borderBottom: "2px solid #e2e8f0",
                }}
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table">
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              filteredSalaries.map((teacher) => {
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
