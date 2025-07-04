import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiCheck,
  FiCalendar,
  FiRefreshCw,
} from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi";
import apiService from "../../../services/api";

const Overview = ({ user }) => {
  console.log("📊 Overview component rendered with user:", user);
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    totalRevenue: 0,
    expectedRevenue: 0,
    totalProfit: 0,
    netProfit: 0,
    totalPayments: 0,
    profitMargin: 0,
    collectionRate: 0,
    totalTeacherWages: 0,
    totalLessons: 0,
    paymentRecords: 0,
    collectionRatePercent: 0,
    currentMonthGrowth: 0,
    currentMonthNew: 0,
    currentMonthInactive: 0,
    newStudentsThisMonth: 0,
    inactiveStudentsThisMonth: 0,
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
          // Create filter object with only non-empty values
          const statisticsFilters = {};
          if (filters.month) statisticsFilters.month = filters.month;
          if (filters.year) statisticsFilters.year = filters.year;
          if (filters.startDate)
            statisticsFilters.startDate = filters.startDate;
          if (filters.endDate) statisticsFilters.endDate = filters.endDate;
          if (filters.classId) statisticsFilters.classId = filters.classId;
          if (filters.teacherId)
            statisticsFilters.teacherId = filters.teacherId;

          console.log("📋 Final statistics filters:", statisticsFilters);

          const response = await apiService.getStatistics(
            user.token,
            statisticsFilters
          );

          console.log("📈 Statistics API response:", response);

          // Handle both direct data response and wrapped success response
          const responseData = response.data || response;
          
          if (responseData && (responseData.success !== false)) {
            const apiData = responseData.data || responseData;
            console.log("📊 Processing API data:", apiData);
            
            // Calculate current month growth data
            const currentMonth = new Date().getMonth() + 1; // 1-12
            const currentYear = new Date().getFullYear();
            
            const currentMonthData = apiData.studentGrowth?.monthly?.find(
              month => month.month === currentMonth && month.year === currentYear
            ) || { newStudents: 0, inactiveStudents: 0, netGrowth: 0 };
            
            const newStats = {
              totalStudents: apiData.studentGrowth?.current?.totalStudents || 0,
              activeStudents: apiData.studentGrowth?.current?.activeStudents || 0,
              inactiveStudents: apiData.studentGrowth?.current?.inactiveStudents || 0,
              totalRevenue: apiData.studentPayments?.summary?.totalCollected || 0,
              expectedRevenue: apiData.studentPayments?.summary?.totalExpected || 0,
              totalProfit: apiData.overview?.totalProfit || 0,
              profitMargin: apiData.overview?.profitMargin || 0,
              collectionRate: apiData.overview?.collectionRate || 0,
              totalTeacherWages: apiData.teacherWages?.summary?.totalPaid || 0,
              totalLessons: apiData.teacherWages?.summary?.totalLessons || 0,
              paymentRecords: apiData.studentPayments?.summary?.totalPayments || 0,
              collectionRatePercent: (parseFloat(apiData.overview?.collectionRate || 0) * 100).toFixed(1),
              currentMonthGrowth: currentMonthData.netGrowth || 0,
              currentMonthNew: currentMonthData.newStudents || 0,
              currentMonthInactive: currentMonthData.inactiveStudents || 0,
            };
            console.log("✅ Setting stats:", newStats);
            setStats(newStats);
          } else {
            console.warn("⚠️ No data in statistics response:", response);
            throw new Error("No data returned from statistics API");
          }
        } catch (error) {
          console.error("❌ Error loading statistics:", error);
          setError("Không thể tải dữ liệu thống kê. Đang sử dụng dữ liệu mẫu.");
          // Use fallback data if API fails
          const fallbackStats = {
            totalStudents: 12,
            activeStudents: 3,
            inactiveStudents: 9,
            totalRevenue: 2260000,
            expectedRevenue: 6015803994,
            totalProfit: 2160000,
            profitMargin: 95.58,
            collectionRate: 0.04,
            totalTeacherWages: 100000,
            totalLessons: 1,
            paymentRecords: 16,
            collectionRatePercent: 4.0,
            currentMonthGrowth: 7,
            currentMonthNew: 7,
            currentMonthInactive: 0,
          };
          console.log("🔄 Using fallback stats:", fallbackStats);
          setStats(fallbackStats);
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

    const formatRevenue = (revenue) => {
      if (typeof revenue === "number") {
        // Format large numbers with appropriate units
        if (revenue >= 1000000000) {
          return (revenue / 1000000000).toFixed(1) + " tỷ";
        } else if (revenue >= 1000000) {
          return (revenue / 1000000).toFixed(1) + " triệu";
        } else if (revenue >= 1000) {
          return (revenue / 1000).toFixed(0) + " nghìn";
        }
        return new Intl.NumberFormat("vi-VN").format(revenue);
      }
      return revenue;
    };

    // Function to create filter summary
    const getFilterSummary = () => {
      const parts = [];
      if (filters.year) parts.push(`Năm ${filters.year}`);
      if (filters.month) parts.push(`Tháng ${filters.month}`);
      if (filters.startDate && filters.endDate) {
        parts.push(`${filters.startDate} → ${filters.endDate}`);
      }
      if (filters.teacherId) {
        const teacher = teachers.find(t => t.id === filters.teacherId);
        parts.push(`GV: ${teacher?.name || teacher?.fullName || 'N/A'}`);
      }
      if (filters.classId) {
        const selectedClass = classes.find(c => c.id === filters.classId);
        parts.push(`Lớp: ${selectedClass?.name || 'N/A'}`);
      }
      return parts.length > 0 ? parts.join(' • ') : 'Tất cả dữ liệu';
    };

    return (
      <section>
        {/* Enhanced Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "1rem",
            padding: "2rem",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "2rem",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              📊 Dashboard Analytics
            </h2>
            <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.9 }}>
              Theo dõi hiệu suất hoạt động của trung tâm một cách khoa học và chi tiết
            </p>
          </div>
          
          {/* Background Pattern */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* Enhanced Filter Section */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "1rem",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
                margin: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiBarChart2 style={{ marginRight: "0.75rem", color: "#3b82f6", fontSize: "1.5rem" }} />
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
          <div style={{ 
            display: "flex", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "0.75rem",
            border: "1px solid #e2e8f0"
          }}>
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
                backgroundColor: filters.month === (new Date().getMonth() + 1).toString() ? "#3b82f6" : "white",
                color: filters.month === (new Date().getMonth() + 1).toString() ? "white" : "#374151",
                border: "2px solid",
                borderColor: filters.month === (new Date().getMonth() + 1).toString() ? "#3b82f6" : "#e5e7eb",
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
              📅 Tháng này
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
                backgroundColor: filters.year === new Date().getFullYear().toString() && !filters.month ? "#10b981" : "white",
                color: filters.year === new Date().getFullYear().toString() && !filters.month ? "white" : "#374151",
                border: "2px solid",
                borderColor: filters.year === new Date().getFullYear().toString() && !filters.month ? "#10b981" : "#e5e7eb",
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
              📊 Năm này
            </button>
            <button
              onClick={() => {
                const now = new Date();
                const firstDayOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
                const lastDayOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 0);
                handleFilterChange("startDate", firstDayOfQuarter.toISOString().split('T')[0]);
                handleFilterChange("endDate", lastDayOfQuarter.toISOString().split('T')[0]);
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
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              📈 Quý này
            </button>
          </div>
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Tháng này
              </button>
              <button
                onClick={() => {
                  handleFilterChange("month", "");
                  handleFilterChange("year", new Date().getFullYear().toString());
                }}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: !filters.month && filters.year == new Date().getFullYear() ? "#3b82f6" : "#f3f4f6",
                  color: !filters.month && filters.year == new Date().getFullYear() ? "white" : "#374151",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Năm này
              </button>
            </div>
          </div>

          {/* Time Filters Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem",
              padding: "1.5rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
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
                📅 Năm học
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
                  transition: "border-color 0.2s ease",
                  ":focus": { borderColor: "#3b82f6", outline: "none" }
                }}
              >
                <option value="">Tất cả các năm</option>
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
                📆 Tháng
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
                <option value="">Tất cả các tháng</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
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
                📊 Từ ngày
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
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
                📊 Đến ngày
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
          </div>

          {/* Advanced Filters Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              alignItems: "end",
            }}
          >
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
                👨‍🏫 Giáo viên
              </label>
              <select
                value={filters.teacherId}
                onChange={(e) => handleFilterChange("teacherId", e.target.value)}
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
                <option value="">Tất cả giáo viên</option>
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
                🏫 Lớp học
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
                <option value="">Tất cả lớp học</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
                height: "fit-content",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#dc2626";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#ef4444";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <FiRefreshCw size={16} />
              Đặt lại bộ lọc
            </button>
          </div>

          {/* Filter Summary */}
          {(filters.month || filters.year || filters.startDate || filters.endDate || filters.teacherId || filters.classId) && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#dbeafe",
                borderRadius: "0.5rem",
                border: "1px solid #93c5fd",
              }}
            >
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e40af", fontWeight: "500" }}>
                📋 Bộ lọc đang áp dụng: {" "}
                {filters.year && `Năm ${filters.year}`}
                {filters.month && ` • Tháng ${filters.month}`}
                {filters.startDate && ` • Từ ${filters.startDate}`}
                {filters.endDate && ` • Đến ${filters.endDate}`}
                {filters.teacherId && ` • Giáo viên cụ thể`}
                {filters.classId && ` • Lớp học cụ thể`}
              </p>
            </div>
          )}
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
            <div className="spinner" style={{ color: "#b30000" }} />
            <span style={{ marginLeft: "0.5rem", color: "#6b7280" }}>
              Đang tải dữ liệu thống kê...
            </span>
          </div>
        )}

        {/* Enhanced Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* Total Students Card */}
          <StatCard
            icon={<FiUsers size={20} />}
            title="Tổng số học sinh"
            value={stats.totalStudents.toLocaleString()}
            subtitle={`✅ Hoạt động: ${stats.activeStudents} • ⏸️ Tạm dừng: ${stats.inactiveStudents}`}
            color="#6366f1"
            trend={stats.activeStudents > stats.inactiveStudents ? 5 : -2}
          />

          {/* Expected Revenue Card */}
          <StatCard
            icon={<FiBarChart2 size={20} />}
            title="Học phí dự kiến"
            value={`${formatRevenue(stats.expectedRevenue)}`}
            subtitle="Tổng số tiền học sinh cần đóng theo kế hoạch"
            color="#8b5cf6"
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Collected Revenue Card */}
          <StatCard
            icon={<BiMoney size={20} />}
            title="Học phí đã thu"
            value={`${formatRevenue(stats.totalRevenue)}`}
            subtitle={`📊 Tỷ lệ thu: ${stats.collectionRatePercent}% • 💰 Còn lại: ${formatRevenue(stats.expectedRevenue - stats.totalRevenue)}`}
            color="#10b981"
            trend={stats.collectionRatePercent > 80 ? 10 : stats.collectionRatePercent > 60 ? 5 : -5}
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Teacher Wages Card */}
          <StatCard
            icon={<HiAcademicCap size={20} />}
            title="Chi phí giáo viên"
            value={`${formatRevenue(stats.totalTeacherWages)}`}
            subtitle={`📚 Số buổi: ${stats.totalLessons} • 💼 TB/buổi: ${formatRevenue(stats.totalLessons > 0 ? stats.totalTeacherWages / stats.totalLessons : 0)}`}
            color="#f59e0b"
            valueStyle={{ fontSize: "1.8rem" }}
          />

          {/* Student Growth Card */}
          <StatCard
            icon={<FiCheck size={20} />}
            title="Tăng trưởng học sinh"
            value={`+${stats.newStudentsThisMonth}`}
            subtitle={`📈 Mới: ${stats.newStudentsThisMonth} • 📉 Dừng: ${stats.inactiveStudentsThisMonth} • 🎯 Ròng: ${stats.newStudentsThisMonth - stats.inactiveStudentsThisMonth}`}
            color="#ef4444"
            trend={stats.newStudentsThisMonth > stats.inactiveStudentsThisMonth ? 15 : -10}
          />

          {/* Net Profit Card */}
          <StatCard
            icon={<FiCalendar size={20} />}
            title="Lợi nhuận ròng"
            value={`${formatRevenue(stats.netProfit)}`}
            subtitle={`💹 Tỷ suất: ${stats.profitMargin}% • 💵 Tổng thu: ${formatRevenue(stats.totalPayments)}`}
            color="#06b6d4"
            trend={stats.profitMargin > 30 ? 8 : stats.profitMargin > 15 ? 3 : -5}
            valueStyle={{ fontSize: "1.8rem" }}
          />
        </div>
            title="Tăng trưởng học sinh tháng này"
            value={`+${stats.currentMonthGrowth}`}
            subtitle={`Tăng: ${stats.currentMonthNew} | Giảm: ${stats.currentMonthInactive} | Tăng ròng: ${stats.currentMonthGrowth}`}
            valueStyle={{ fontSize: "2.5rem" }}
          />

          {/* Net Profit */}
          <StatCard
            icon={<FiFileText className="icon" style={{ color: "#b30000" }} />}
            title="Lợi nhuận ròng"
            value={`${formatRevenue(stats.totalProfit)} VNĐ`}
            subtitle={`Tỷ suất lợi nhuận: ${stats.profitMargin}% | Tổng thanh toán: ${stats.paymentRecords}`}
            valueStyle={{ fontSize: "1.8rem" }}
          />        </div>

        {/* Performance Summary Footer */}
        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            borderRadius: "1rem",
            padding: "2rem",
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
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            📈 Tóm tắt hiệu suất
          </h4>
          
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Collection Rate Indicator */}
            <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>TỶ LỆ THU HỌC PHÍ</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "700", color: stats.collectionRatePercent > 80 ? "#10b981" : stats.collectionRatePercent > 60 ? "#f59e0b" : "#ef4444" }}>
                  {stats.collectionRatePercent}%
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(stats.collectionRatePercent, 100)}%`,
                    height: "100%",
                    backgroundColor: stats.collectionRatePercent > 80 ? "#10b981" : stats.collectionRatePercent > 60 ? "#f59e0b" : "#ef4444",
                    transition: "width 0.5s ease"
                  }}
                />
              </div>
            </div>

            {/* Profit Margin Indicator */}
            <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>TỶ SUẤT LỢI NHUẬN</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "700", color: stats.profitMargin > 30 ? "#10b981" : stats.profitMargin > 15 ? "#f59e0b" : "#ef4444" }}>
                  {stats.profitMargin}%
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "#e5e7eb", borderRadius: "4px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(stats.profitMargin, 100)}%`,
                    height: "100%",
                    backgroundColor: stats.profitMargin > 30 ? "#10b981" : stats.profitMargin > 15 ? "#f59e0b" : "#ef4444",
                    transition: "width 0.5s ease"
                  }}
                />
              </div>
            </div>

            {/* Growth Rate */}
            <div style={{ backgroundColor: "white", padding: "1.5rem", borderRadius: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" }}>TĂNG TRƯỞNG RÒNG</span>
                <span style={{ fontSize: "1.5rem", fontWeight: "700", color: (stats.newStudentsThisMonth - stats.inactiveStudentsThisMonth) > 0 ? "#10b981" : "#ef4444" }}>
                  {stats.newStudentsThisMonth - stats.inactiveStudentsThisMonth > 0 ? "+" : ""}{stats.newStudentsThisMonth - stats.inactiveStudentsThisMonth}
                </span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Mới: {stats.newStudentsThisMonth} • Dừng: {stats.inactiveStudentsThisMonth}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

// Enhanced StatCard component with scientific UI
const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  valueStyle = { fontSize: "2.5rem" },
  trend = null,
  color = "#3b82f6"
}) => {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e2e8f0",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 32px rgba(59, 130, 246, 0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              padding: "0.75rem",
              backgroundColor: `${color}20`,
              borderRadius: "0.75rem",
              color: color,
              fontSize: "1.25rem",
            }}
          >
            {icon}
          </div>
          {trend && (
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: "600",
                color: trend > 0 ? "#10b981" : trend < 0 ? "#ef4444" : "#6b7280",
                backgroundColor: trend > 0 ? "#ecfdf5" : trend < 0 ? "#fef2f2" : "#f3f4f6",
                padding: "0.25rem 0.5rem",
                borderRadius: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>

      <h3
        style={{
          margin: "0",
          fontSize: "0.875rem",
          fontWeight: "600",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h3>

      {/* Main Value */}
      <div
        style={{
          ...valueStyle,
          fontWeight: "800",
          color: color,
          margin: "0.5rem 0",
          lineHeight: "1",
          fontSize: valueStyle.fontSize || "2rem",
        }}
      >
        {value}
      </div>

      {/* Subtitle */}
      <p
        style={{
          color: "#64748b",
          fontSize: "0.8rem",
          margin: "0",
          lineHeight: "1.4",
          fontWeight: "500",
        }}
      >
        {subtitle}
      </p>

      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
    </div>
  );
};

export default Overview;
