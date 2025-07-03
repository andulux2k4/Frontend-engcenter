import React, { useState, useEffect } from "react";
import apiService from "../../../services/api";

const Overview = ({ user }) => {
  console.log("📊 Overview component rendered with user:", user);

  const [stats, setStats] = useState({
    // System Overview
    totalUsers: 0,
    totalActiveUsers: 0,
    totalInactiveUsers: 0,
    userActivePercentage: 0,

    // Students
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    studentActivePercentage: 0,

    // Teachers
    totalTeachers: 0,
    activeTeachers: 0,
    inactiveTeachers: 0,
    teacherActivePercentage: 0,

    // Classes
    totalClasses: 0,
    activeClasses: 0,
    inactiveClasses: 0,
    classActivePercentage: 0,

    // Teacher Wages
    totalTeacherWages: 0,
    totalLessons: 0,
    averageWagePerLesson: 0,
    paymentRate: 0,

    // Student Payments
    totalExpected: 0,
    totalCollected: 0,
    totalRemaining: 0,
    collectionRate: 0,
    totalPayments: 0,

    // Financial Overview
    totalProfit: 0,
    profitMargin: 0,

    // Student Growth
    newStudentsThisMonth: 0,
    inactiveStudentsThisMonth: 0,
    netGrowthThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: "",
    year: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
    classId: "",
    teacherId: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  // Load teachers and classes for filter dropdowns
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        if (user?.token) {
          console.log("🔍 Loading filter data...");
          const [teachersResponse, classesResponse] = await Promise.all([
            apiService.getUsers(user.token, { role: "teacher" }),
            apiService.getClasses(user.token),
          ]);

          console.log("👨‍🏫 Teachers response:", teachersResponse);
          console.log("🏫 Classes response:", classesResponse);

          if (teachersResponse.data) {
            setTeachers(teachersResponse.data);
          }
          if (classesResponse.data) {
            setClasses(classesResponse.data);
          }
        }
      } catch (error) {
        console.error("❌ Error loading filter data:", error);
      }
    };

    loadFilterData();
  }, [user?.token]);

  // Load statistics whenever filters change
  useEffect(() => {
    const loadStatistics = async () => {
      if (!user?.token) {
        console.log("⚠️ No user token available for statistics");
        return;
      }

      console.log("📊 Loading statistics with filters:", filters);
      setLoading(true);
      setError(null);

      try {
        const statisticsFilters = {};
        if (filters.month) statisticsFilters.month = filters.month;
        if (filters.year) statisticsFilters.year = filters.year;
        if (filters.startDate) statisticsFilters.startDate = filters.startDate;
        if (filters.endDate) statisticsFilters.endDate = filters.endDate;
        if (filters.classId) statisticsFilters.classId = filters.classId;
        if (filters.teacherId) statisticsFilters.teacherId = filters.teacherId;

        const response = await apiService.getStatistics(
          user.token,
          statisticsFilters
        );
        console.log("📈 Statistics API response:", response);

        const responseData = response.data || response;
        console.log("📊 Response data structure:", responseData);

        // More flexible validation - check if we have data regardless of success flag
        let apiData = null;
        if (responseData && responseData.data) {
          apiData = responseData.data;
        } else if (responseData && typeof responseData === "object") {
          // Sometimes the API returns data directly without a wrapper
          apiData = responseData;
        }

        if (apiData) {
          console.log("📊 Processing API data:", apiData);

          // Get current month data for growth
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();

          const currentMonthGrowth = apiData.studentGrowth?.monthly?.find(
            (month) =>
              month.month === currentMonth && month.year === currentYear
          ) || { newStudents: 0, inactiveStudents: 0, netGrowth: 0 };

          const newStats = {
            // System Overview
            totalUsers: apiData.systemOverview?.users?.totalUsers || 0,
            totalActiveUsers:
              apiData.systemOverview?.users?.totalActiveUsers || 0,
            totalInactiveUsers:
              apiData.systemOverview?.users?.totalInactiveUsers || 0,
            userActivePercentage: parseFloat(
              apiData.systemOverview?.users?.userActivePercentage || 0
            ),

            // Students
            totalStudents: apiData.systemOverview?.students?.total || 0,
            activeStudents: apiData.systemOverview?.students?.active || 0,
            inactiveStudents: apiData.systemOverview?.students?.inactive || 0,
            studentActivePercentage: parseFloat(
              apiData.systemOverview?.students?.activePercentage || 0
            ),

            // Teachers
            totalTeachers: apiData.systemOverview?.teachers?.total || 0,
            activeTeachers: apiData.systemOverview?.teachers?.active || 0,
            inactiveTeachers: apiData.systemOverview?.teachers?.inactive || 0,
            teacherActivePercentage: parseFloat(
              apiData.systemOverview?.teachers?.activePercentage || 0
            ),

            // Classes
            totalClasses: apiData.systemOverview?.classes?.total || 0,
            activeClasses: apiData.systemOverview?.classes?.active || 0,
            inactiveClasses: apiData.systemOverview?.classes?.inactive || 0,
            classActivePercentage: parseFloat(
              apiData.systemOverview?.classes?.activePercentage || 0
            ),

            // Teacher Wages
            totalTeacherWages: apiData.teacherWages?.summary?.totalPaid || 0,
            totalLessons: apiData.teacherWages?.summary?.totalLessons || 0,
            averageWagePerLesson: parseFloat(
              apiData.teacherWages?.summary?.averageWagePerLesson || 0
            ),
            paymentRate: parseFloat(
              apiData.teacherWages?.summary?.paymentRate || 0
            ),

            // Student Payments
            totalExpected: apiData.studentPayments?.summary?.totalExpected || 0,
            totalCollected:
              apiData.studentPayments?.summary?.totalCollected || 0,
            totalRemaining:
              apiData.studentPayments?.summary?.totalRemaining || 0,
            collectionRate:
              parseFloat(
                apiData.studentPayments?.summary?.collectionRate || 0
              ) * 100,
            totalPayments: apiData.studentPayments?.summary?.totalPayments || 0,

            // Financial Overview
            totalProfit: apiData.financialOverview?.totalProfit || 0,
            profitMargin: parseFloat(
              apiData.financialOverview?.profitMargin || 0
            ),

            // Student Growth
            newStudentsThisMonth: currentMonthGrowth.newStudents || 0,
            inactiveStudentsThisMonth: currentMonthGrowth.inactiveStudents || 0,
            netGrowthThisMonth: currentMonthGrowth.netGrowth || 0,
          };

          console.log("✅ Setting stats:", newStats);
          setStats(newStats);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("❌ Error loading statistics:", error);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [user?.token, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      month: "",
      year: new Date().getFullYear().toString(),
      startDate: "",
      endDate: "",
      classId: "",
      teacherId: "",
    });
  };

  const formatCurrency = (amount) => {
    if (typeof amount === "number") {
      if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + " tỷ";
      } else if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + " triệu";
      } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + " nghìn";
      }
      return new Intl.NumberFormat("vi-VN").format(amount);
    }
    return amount;
  };

  const getFilterSummary = () => {
    const parts = [];
    if (filters.year) parts.push(`Năm ${filters.year}`);
    if (filters.month) parts.push(`Tháng ${filters.month}`);
    if (filters.startDate && filters.endDate) {
      parts.push(`${filters.startDate} → ${filters.endDate}`);
    }
    if (filters.teacherId) {
      const teacher = teachers.find((t) => t.id === filters.teacherId);
      parts.push(`GV: ${teacher?.name || teacher?.fullName || "N/A"}`);
    }
    if (filters.classId) {
      const selectedClass = classes.find((c) => c.id === filters.classId);
      parts.push(`Lớp: ${selectedClass?.name || "N/A"}`);
    }
    return parts.length > 0 ? parts.join(" • ") : "Tất cả dữ liệu";
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* Content container */}
      <div
        style={{
          width: "100%",
          margin: "0",
          padding: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#374151",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            color: "white",
          }}
        >
          <h2
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.75rem",
              fontWeight: "700",
            }}
          >
            Tổng quan hệ thống
          </h2>
          <p style={{ margin: 0, fontSize: "1rem", opacity: 0.9 }}>
            Theo dõi và quản lý hoạt động của trung tâm một cách hiệu quả
          </p>
        </div>

        {/* Enhanced Filter Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              gap: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
                margin: 0,
              }}
            >
              Bộ lọc thống kê
            </h3>

            {/* Filter Summary */}
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                backgroundColor: "#f0f9ff",
                padding: "0.5rem 1rem",
                borderRadius: "2rem",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📈 {getFilterSummary()}
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
            }}
          >
            <button
              onClick={() => {
                const now = new Date();
                handleFilterChange("month", (now.getMonth() + 1).toString());
                handleFilterChange("year", now.getFullYear().toString());
                handleFilterChange("startDate", "");
                handleFilterChange("endDate", "");
              }}
              style={{
                padding: "0.75rem 1.25rem",
                backgroundColor:
                  filters.month === (new Date().getMonth() + 1).toString()
                    ? "#3b82f6"
                    : "white",
                color:
                  filters.month === (new Date().getMonth() + 1).toString()
                    ? "white"
                    : "#374151",
                border: "2px solid",
                borderColor:
                  filters.month === (new Date().getMonth() + 1).toString()
                    ? "#3b82f6"
                    : "#e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              Tháng này
            </button>
            <button
              onClick={() => {
                const now = new Date();
                handleFilterChange("year", now.getFullYear().toString());
                handleFilterChange("month", "");
                handleFilterChange("startDate", "");
                handleFilterChange("endDate", "");
              }}
              style={{
                padding: "0.75rem 1.25rem",
                backgroundColor:
                  filters.year === new Date().getFullYear().toString() &&
                  !filters.month
                    ? "#10b981"
                    : "white",
                color:
                  filters.year === new Date().getFullYear().toString() &&
                  !filters.month
                    ? "white"
                    : "#374151",
                border: "2px solid",
                borderColor:
                  filters.year === new Date().getFullYear().toString() &&
                  !filters.month
                    ? "#10b981"
                    : "#e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Năm này
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDayOfQuarter = new Date(
                  now.getFullYear(),
                  Math.floor(now.getMonth() / 3) * 3,
                  1
                );
                const lastDayOfQuarter = new Date(
                  now.getFullYear(),
                  Math.floor(now.getMonth() / 3) * 3 + 3,
                  0
                );
                handleFilterChange(
                  "startDate",
                  firstDayOfQuarter.toISOString().split("T")[0]
                );
                handleFilterChange(
                  "endDate",
                  lastDayOfQuarter.toISOString().split("T")[0]
                );
                handleFilterChange("month", "");
                handleFilterChange("year", "");
              }}
              style={{
                padding: "0.75rem 1.25rem",
                backgroundColor: "white",
                color: "#374151",
                border: "2px solid #e5e7eb",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Quý này
            </button>
          </div>

          {/* Filter Controls Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Year Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Năm
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <option key="all-years" value="">
                  Tất cả các năm
                </option>
                {[...Array(5)].map((_, i) => {
                  const year = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={year} value={year}>
                      Năm {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Tháng
              </label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange("month", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <option key="all-months" value="">
                  Tất cả các tháng
                </option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              />
            </div>

            {/* End Date */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Đến ngày
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              />
            </div>

            {/* Teacher Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Giáo viên
              </label>
              <select
                value={filters.teacherId}
                onChange={(e) =>
                  handleFilterChange("teacherId", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <option key="all-teachers" value="">
                  Tất cả giáo viên
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name || teacher.fullName}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: "600",
                  color: "#374151",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Lớp học
              </label>
              <select
                value={filters.classId}
                onChange={(e) => handleFilterChange("classId", e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #d1d5db",
                  borderRadius: "0.5rem",
                  backgroundColor: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                <option key="all-classes" value="">
                  Tất cả lớp học
                </option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleResetFilters}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Đặt lại bộ lọc
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              color: "#dc2626",
              marginBottom: "1.5rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="spinner" style={{ color: "#3b82f6" }} />
            <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
              Đang tải dữ liệu thống kê...
            </span>
          </div>
        )}

        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Total Students Card */}
          <StatCard
            title="Tổng số học sinh"
            value={stats.totalStudents.toLocaleString()}
            subtitle={`Hoạt động: ${stats.activeStudents} • Tạm dừng: ${stats.inactiveStudents}`}
            color="#6366f1"
            trend={stats.activeStudents > stats.inactiveStudents ? 5 : -2}
          />

          {/* Expected Revenue Card */}
          <StatCard
            title="Học phí dự kiến"
            value={`${formatCurrency(stats.totalExpected)}`}
            subtitle="Tổng số tiền học sinh cần đóng theo kế hoạch"
            color="#4f46e5"
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Collected Revenue Card */}
          <StatCard
            title="Học phí đã thu"
            value={`${formatCurrency(stats.totalCollected)}`}
            subtitle={`Tỷ lệ thu: ${Math.round(
              stats.collectionRate
            )}% • Còn lại: ${formatCurrency(stats.totalRemaining)}`}
            color="#059669"
            trend={
              stats.collectionRate > 80
                ? 10
                : stats.collectionRate > 60
                ? 5
                : -5
            }
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Teacher Wages Card */}
          <StatCard
            title="Chi phí giáo viên"
            value={`${formatCurrency(stats.totalTeacherWages)}`}
            subtitle={`Số buổi: ${
              stats.totalLessons
            } • TB/buổi: ${formatCurrency(stats.averageWagePerLesson)}`}
            color="#d97706"
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Student Growth Card */}
          <StatCard
            title="Tăng trưởng học sinh"
            value={`+${stats.newStudentsThisMonth}`}
            subtitle={`Mới: ${stats.newStudentsThisMonth} • Dừng: ${stats.inactiveStudentsThisMonth} • Ròng: ${stats.netGrowthThisMonth}`}
            color="#dc2626"
            trend={stats.netGrowthThisMonth > 0 ? 15 : -10}
          />

          {/* Net Profit Card */}
          <StatCard
            title="Lợi nhuận ròng"
            value={`${formatCurrency(stats.totalProfit)}`}
            subtitle={`Tỷ suất: ${Math.round(
              stats.profitMargin
            )}% • Tổng thu: ${formatCurrency(stats.totalPayments)}`}
            color="#0891b2"
            trend={
              stats.profitMargin > 30 ? 8 : stats.profitMargin > 15 ? 3 : -5
            }
            valueStyle={{ fontSize: "1.8rem" }}
          />
        </div>

        {/* Performance Summary Footer */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRadius: "0.75rem",
            padding: "1.5rem",
            marginTop: "2rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <h4
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.25rem",
              fontWeight: "700",
              color: "#1f2937",
            }}
          >
            Tóm tắt hiệu suất
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Collection Rate Indicator */}
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  TỶ LỆ THU HỌC PHÍ
                </span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color:
                      stats.collectionRate > 80
                        ? "#10b981"
                        : stats.collectionRate > 60
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  {Math.round(stats.collectionRate)}%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(stats.collectionRate, 100)}%`,
                    height: "100%",
                    backgroundColor:
                      stats.collectionRate > 80
                        ? "#10b981"
                        : stats.collectionRate > 60
                        ? "#f59e0b"
                        : "#ef4444",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Profit Margin Indicator */}
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  TỶ SUẤT LỢI NHUẬN
                </span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color:
                      stats.profitMargin > 30
                        ? "#10b981"
                        : stats.profitMargin > 15
                        ? "#f59e0b"
                        : "#ef4444",
                  }}
                >
                  {stats.profitMargin}%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#e5e7eb",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(stats.profitMargin, 100)}%`,
                    height: "100%",
                    backgroundColor:
                      stats.profitMargin > 30
                        ? "#10b981"
                        : stats.profitMargin > 15
                        ? "#f59e0b"
                        : "#ef4444",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Growth Rate */}
            <div
              style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  TĂNG TRƯỞNG RÒNG
                </span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color:
                      stats.newStudentsThisMonth -
                        stats.inactiveStudentsThisMonth >
                      0
                        ? "#10b981"
                        : "#ef4444",
                  }}
                >
                  {stats.newStudentsThisMonth -
                    stats.inactiveStudentsThisMonth >
                  0
                    ? "+"
                    : ""}
                  {stats.newStudentsThisMonth - stats.inactiveStudentsThisMonth}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Mới: {stats.newStudentsThisMonth} • Dừng:{" "}
                {stats.inactiveStudentsThisMonth}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified StatCard component with scientific UI
const StatCard = ({
  title,
  value,
  subtitle,
  valueStyle = { fontSize: "2rem" },
  trend = null,
  color = "#4b5563",
}) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "0.5rem",
        padding: "1.5rem",
        border: "1px solid #e5e7eb",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header with trend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <h3
          style={{
            margin: "0",
            fontSize: "0.875rem",
            fontWeight: "600",
            color: "#4b5563",
            textTransform: "uppercase",
            letterSpacing: "0.025em",
          }}
        >
          {title}
        </h3>
        {trend && (
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: "500",
              color: trend > 0 ? "#059669" : trend < 0 ? "#dc2626" : "#6b7280",
              backgroundColor:
                trend > 0 ? "#f0fdf4" : trend < 0 ? "#fef2f2" : "#f9fafb",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
            }}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>

      {/* Main Value */}
      <div
        style={{
          ...valueStyle,
          fontWeight: "700",
          color: "#111827",
          margin: "0.75rem 0",
          lineHeight: "1.1",
        }}
      >
        {value}
      </div>

      {/* Subtitle */}
      <p
        style={{
          color: "#6b7280",
          fontSize: "0.875rem",
          margin: "0",
          lineHeight: "1.4",
          fontWeight: "400",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default Overview;
