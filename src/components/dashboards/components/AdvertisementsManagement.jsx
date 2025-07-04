import React, { useState, useEffect, useMemo, useCallback } from "react";
import { MdCampaign } from "react-icons/md";
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
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

const AdvertisementsManagement = ({ user }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [apiDisabled, setApiDisabled] = useState(false); // Flag to disable API calls

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Form state
  const [adForm, setAdForm] = useState({
    title: "",
    content: "",
    startDate: "",
    endDate: "",
    images: [],
    isActive: true,
  });

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [advertisementsPagination, setAdvertisementsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAdvertisements: 0,
    limit: 5,
  });

  // Mock advertisement data (matching API structure)
  const mockAdvertisements = [
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d0",
      title: "Khóa học IELTS Intensive",
      content:
        "Khóa học IELTS tăng tốc, cam kết đạt 6.5+ sau 3 tháng. Giảm 15% học phí cho học viên đăng ký trước 15/04/2024.",
      images: [
        {
          url: "https://picsum.photos/600/300?random=1",
          public_id: "ielts-intensive",
          format: "jpg",
        },
      ],
      startDate: "2024-03-20T00:00:00.000Z",
      endDate: "2024-04-15T00:00:00.000Z",
      isActive: true,
      createdAt: "2024-03-10T08:00:00.000Z",
      updatedAt: "2024-03-10T08:00:00.000Z",
      views: 120,
      clicks: 25,
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d1",
      title: "Khóa học TOEIC Online",
      content:
        "Học TOEIC online với giáo viên kinh nghiệm. Học phí chỉ từ 1.990.000đ cho 3 tháng. Tặng khóa luyện đề miễn phí.",
      images: [
        {
          url: "https://picsum.photos/600/300?random=2",
          public_id: "toeic-online",
          format: "jpg",
        },
      ],
      startDate: "2024-03-10T00:00:00.000Z",
      endDate: "2024-04-10T00:00:00.000Z",
      isActive: true,
      createdAt: "2024-03-05T08:00:00.000Z",
      updatedAt: "2024-03-05T08:00:00.000Z",
      views: 85,
      clicks: 18,
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d2",
      title: "Chương trình du học hè 2024",
      content:
        "Du học hè tại Anh, Mỹ, Singapore. Trải nghiệm môi trường học tập quốc tế, nâng cao kỹ năng tiếng Anh và khám phá văn hóa.",
      images: [
        {
          url: "https://picsum.photos/600/300?random=3",
          public_id: "summer-abroad",
          format: "jpg",
        },
      ],
      startDate: "2024-02-15T00:00:00.000Z",
      endDate: "2024-04-30T00:00:00.000Z",
      isActive: true,
      createdAt: "2024-02-10T08:00:00.000Z",
      updatedAt: "2024-02-10T08:00:00.000Z",
      views: 200,
      clicks: 45,
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d3",
      title: "Tuyển dụng giáo viên tiếng Anh",
      content:
        "Trung tâm đang tuyển dụng giáo viên tiếng Anh cho các khóa học IELTS, TOEIC và tiếng Anh cho trẻ em.",
      images: [
        {
          url: "https://picsum.photos/600/300?random=4",
          public_id: "teacher-recruitment",
          format: "jpg",
        },
      ],
      startDate: "2024-03-01T00:00:00.000Z",
      endDate: "2024-03-31T00:00:00.000Z",
      isActive: false,
      createdAt: "2024-02-25T08:00:00.000Z",
      updatedAt: "2024-03-31T08:00:00.000Z",
      views: 60,
      clicks: 10,
    },
    {
      _id: "64f8a5b2c3d4e5f6a7b8c9d4",
      title: "Khóa học tiếng Anh cho trẻ em",
      content:
        "Khóa học tiếng Anh dành cho trẻ em từ 4-12 tuổi. Phương pháp học thông qua các hoạt động vui chơi, giúp trẻ yêu thích ngôn ngữ.",
      images: [
        {
          url: "https://picsum.photos/600/300?random=5",
          public_id: "english-for-kids",
          format: "jpg",
        },
      ],
      startDate: "2024-03-15T00:00:00.000Z",
      endDate: "2024-05-15T00:00:00.000Z",
      isActive: true,
      createdAt: "2024-03-01T08:00:00.000Z",
      updatedAt: "2024-03-01T08:00:00.000Z",
      views: 150,
      clicks: 35,
    },
  ];

  // Fetch advertisements from API (non-blocking)
  const fetchAdvertisements = useCallback(async () => {
    if (!user?.token || isRequestInProgress || apiDisabled) {
      return;
    }

    setIsRequestInProgress(true);
    setLoading(true);
    setError(""); // Clear previous errors

    // Immediately show mock data to prevent blocking UI
    if (!initialLoad) {
      setAdvertisements(mockAdvertisements);
      setInitialLoad(true);
    }

    try {
      // Build API URL with proper query parameters
      const apiUrl = `/v1/api/advertisements?page=1&limit=10&isActive=&search=`;

      // Use Promise.race with shorter timeout for better UX
      const apiPromise = apiService.apiCall(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      // Create timeout promise - 5 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("API_TIMEOUT")), 5000); // 5 second timeout
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);

      if (response.success && response.data) {
        setAdvertisements(response.data);
        setError(""); // Clear error on success
      } else {
        setError("API không có dữ liệu. Hiển thị dữ liệu mẫu.");
      }
    } catch (error) {
      console.error("💥 Error fetching advertisements:", error);

      if (error.message === "API_TIMEOUT") {
        setError("API timeout sau 5 giây. Hiển thị dữ liệu mẫu.");
        // Disable API for this session after timeout
        setApiDisabled(true);
      } else {
        setError("Lỗi kết nối API. Hiển thị dữ liệu mẫu.");
      }

      // Keep mock data - don't reset
      if (advertisements.length === 0) {
        setAdvertisements(mockAdvertisements);
      }
    } finally {
      setIsRequestInProgress(false);
      setLoading(false);
    }
  }, [user?.token, initialLoad, apiDisabled]);

  // Filter advertisements based on status and search term
  const filteredAdvertisements = useMemo(() => {
    return advertisements.filter((ad) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && ad.isActive) ||
        (statusFilter === "inactive" && !ad.isActive);
      const matchesSearch =
        ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [advertisements, statusFilter, searchTerm]);

  // Calculate pagination
  useEffect(() => {
    const total = filteredAdvertisements.length;
    const pages = Math.ceil(total / advertisementsPagination.limit) || 1;

    setAdvertisementsPagination((prev) => ({
      ...prev,
      totalAdvertisements: total,
      totalPages: pages,
      currentPage: Math.min(prev.currentPage, pages),
    }));
  }, [filteredAdvertisements, advertisementsPagination.limit]); // Fixed dependencies

  // Get paginated advertisements
  const paginatedAdvertisements = useMemo(() => {
    return filteredAdvertisements.slice(
      (advertisementsPagination.currentPage - 1) *
        advertisementsPagination.limit,
      advertisementsPagination.currentPage * advertisementsPagination.limit
    );
  }, [
    filteredAdvertisements,
    advertisementsPagination.currentPage,
    advertisementsPagination.limit,
  ]);

  // Load initial data with delay to prevent blocking other API calls
  useEffect(() => {
    if (user?.token && !isRequestInProgress) {
      // Load mock data immediately for better UX
      if (!initialLoad) {
        setAdvertisements(mockAdvertisements);
        setInitialLoad(true);
      }

      // Then try to fetch real data in background with longer delay
      const timeoutId = setTimeout(() => {
        fetchAdvertisements();
      }, 2000); // 2 second delay to let other APIs load first

      return () => clearTimeout(timeoutId);
    }
  }, [user?.token]); // Only depend on user token

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Handle add advertisement
  const handleAddAdvertisement = () => {
    setAdForm({
      title: "",
      content: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      images: [],
      isActive: true,
    });
    setShowAddModal(true);
  };

  // Handle edit advertisement
  const handleEditAdvertisement = (ad) => {
    setSelectedAd(ad);
    setAdForm({
      title: ad.title,
      content: ad.content,
      startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
      endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
      images: ad.images || [],
      isActive: ad.isActive,
    });
    setShowEditModal(true);
  };

  // Handle view advertisement details
  const handleAdRowClick = (ad, e) => {
    // Don't open modal when clicking action buttons
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;

    setSelectedAd(ad);
    setShowDetailModal(true);
  };

  // Handle toggle advertisement status
  const handleToggleAdvertisementStatus = (adId) => {
    setAdvertisements((prev) =>
      prev.map((ad) =>
        ad._id === adId
          ? {
              ...ad,
              isActive: !ad.isActive,
            }
          : ad
      )
    );
  };

  // Handle delete advertisement
  const handleDeleteAdvertisement = async (adId) => {
    if (window.confirm("Bạn có chắc muốn xóa quảng cáo này?")) {
      try {
        // TODO: Replace with actual API call
        const response = await apiService.apiCall(
          `/v1/api/advertisements/${adId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.success) {
          setAdvertisements((prev) => prev.filter((ad) => ad._id !== adId));
        } else {
          setError(response.message || "Không thể xóa quảng cáo");
        }
      } catch (error) {
        console.error("Error deleting advertisement:", error);
        // Mock behavior for development
        setAdvertisements((prev) => prev.filter((ad) => ad._id !== adId));
      }
    }
  };

  // Handle form submission for adding advertisement
  const handleSubmitAddForm = async (e) => {
    e.preventDefault();

    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall("/v1/api/advertisements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: adForm.title,
          content: adForm.content,
          startDate: adForm.startDate
            ? new Date(adForm.startDate).toISOString()
            : null,
          endDate: adForm.endDate
            ? new Date(adForm.endDate).toISOString()
            : null,
          images: adForm.images,
        }),
      });

      if (response.success) {
        setAdvertisements((prev) => [response.data, ...prev]);
        setShowAddModal(false);
      } else {
        setError(response.message || "Không thể tạo quảng cáo");
      }
    } catch (error) {
      console.error("Error adding advertisement:", error);

      // Mock behavior for development
      setAdvertisements((prev) => [
        {
          ...adForm,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          clicks: 0,
          startDate: adForm.startDate
            ? new Date(adForm.startDate).toISOString()
            : null,
          endDate: adForm.endDate
            ? new Date(adForm.endDate).toISOString()
            : null,
        },
        ...prev,
      ]);
      setShowAddModal(false);
    }
  };

  // Handle form submission for editing advertisement
  const handleSubmitEditForm = async (e) => {
    e.preventDefault();

    if (!selectedAd) return;

    try {
      // TODO: Replace with actual API call
      const response = await apiService.apiCall(
        `/v1/api/advertisements/${selectedAd._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            title: adForm.title,
            content: adForm.content,
            startDate: adForm.startDate
              ? new Date(adForm.startDate).toISOString()
              : null,
            endDate: adForm.endDate
              ? new Date(adForm.endDate).toISOString()
              : null,
            isActive: adForm.isActive,
            images: adForm.images,
          }),
        }
      );

      if (response.success) {
        setAdvertisements((prev) =>
          prev.map((ad) => (ad._id === selectedAd._id ? response.data : ad))
        );
        setShowEditModal(false);
      } else {
        setError(response.message || "Không thể cập nhật quảng cáo");
      }
    } catch (error) {
      console.error("Error editing advertisement:", error);

      // Mock behavior for development
      setAdvertisements((prev) =>
        prev.map((ad) =>
          ad._id === selectedAd._id
            ? {
                ...ad,
                ...adForm,
                startDate: adForm.startDate
                  ? new Date(adForm.startDate).toISOString()
                  : null,
                endDate: adForm.endDate
                  ? new Date(adForm.endDate).toISOString()
                  : null,
                updatedAt: new Date().toISOString(),
              }
            : ad
        )
      );
      setShowEditModal(false);
    }
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
          <MdCampaign style={{ marginRight: "0.75rem", color: "#3b82f6" }} />
          Quản lý Quảng cáo
        </h2>
        <button
          className="btn btn-primary"
          onClick={handleAddAdvertisement}
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
          Thêm quảng cáo
        </button>
      </div>

      {/* Filter and search */}
      <div
        className="filter-bar"
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "0.75rem",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e7eb",
          flexWrap: "wrap",
        }}
      >
        <div className="filter-group" style={{ flex: "1", minWidth: "200px" }}>
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              backgroundColor: "white",
            }}
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <div className="search-group" style={{ flex: "1", minWidth: "200px" }}>
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
            placeholder="Tìm kiếm quảng cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          className="error-message"
          style={{
            padding: "1rem",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            border: "1px solid #fecaca",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{error}</span>
          {apiDisabled && (
            <button
              onClick={() => {
                setApiDisabled(false);
                setError("");
                fetchAdvertisements();
              }}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
            >
              Thử lại API
            </button>
          )}
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

      {/* Advertisements Cards */}
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
        ) : filteredAdvertisements.length === 0 ? (
          <div
            style={{
              padding: "1.5rem",
              textAlign: "center",
              color: "#6b7280",
              backgroundColor: "white",
            }}
          >
            Không có quảng cáo nào
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {paginatedAdvertisements.map((ad) => (
              <div
                key={ad._id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={(e) => handleAdRowClick(ad, e)}
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
                    height: "4px",
                    backgroundColor: ad.isActive ? "#22c55e" : "#ef4444",
                  }}
                ></div>

                {/* Header */}
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      margin: 0,
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#111827",
                      lineHeight: "1.3",
                    }}
                  >
                    {ad.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: ad.isActive ? "#f0fdf4" : "#fef2f2",
                        color: ad.isActive ? "#166534" : "#dc2626",
                      }}
                    >
                      {ad.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                    {ad.views && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          backgroundColor: "#f0f9ff",
                          color: "#1e40af",
                        }}
                      >
                        {ad.views} lượt xem
                      </span>
                    )}
                    {ad.clicks && (
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          backgroundColor: "#e0e7ff",
                          color: "#3730a3",
                        }}
                      >
                        {ad.clicks} lượt click
                      </span>
                    )}
                  </div>
                </div>

                {/* Image preview */}
                {ad.images && ad.images.length > 0 && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <img
                      src={ad.images[0].url}
                      alt={ad.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        // Fallback to a simple colored div if image fails to load
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      style={{
                        display: "none",
                        width: "100%",
                        height: "120px",
                        backgroundColor: "#f3f4f6",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6b7280",
                        fontSize: "0.875rem",
                      }}
                    >
                      📷 Hình ảnh
                    </div>
                  </div>
                )}

                {/* Content */}
                <div
                  style={{
                    marginBottom: "1rem",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                    maxHeight: "3rem",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {ad.content}
                </div>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "1rem",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                      }}
                    >
                      {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleEditAdvertisement(ad)}
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
                      <FiEdit style={{ fontSize: "0.875rem" }} />
                    </button>
                    <button
                      onClick={() => handleToggleAdvertisementStatus(ad._id)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: ad.isActive ? "#fef3c7" : "#dcfce7",
                        color: ad.isActive ? "#92400e" : "#166534",
                        border: ad.isActive
                          ? "1px solid #fbbf24"
                          : "1px solid #10b981",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {ad.isActive ? "Ngừng" : "Kích hoạt"}
                    </button>
                    <button
                      onClick={() => handleDeleteAdvertisement(ad._id)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#fef2f2",
                        color: "#dc2626",
                        border: "1px solid #fecaca",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiTrash2 style={{ fontSize: "0.875rem" }} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading &&
        filteredAdvertisements.length > 0 &&
        advertisementsPagination.totalPages > 1 && (
          <Pagination
            currentPage={advertisementsPagination.currentPage}
            totalPages={advertisementsPagination.totalPages}
            totalItems={advertisementsPagination.totalAdvertisements}
            limit={advertisementsPagination.limit}
            onPageChange={(newPage) =>
              setAdvertisementsPagination((prev) => ({
                ...prev,
                currentPage: newPage,
              }))
            }
            loading={loading}
            itemName="quảng cáo"
          />
        )}

      {/* Advertisement Detail Modal */}
      {showDetailModal && selectedAd && (
        <div className="modal">
          <div className="modal-content">
            <h3>Chi tiết quảng cáo</h3>

            <div className="ad-preview">
              {selectedAd.images && selectedAd.images.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <img
                    src={selectedAd.images[0].url}
                    alt={selectedAd.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                    }}
                  />
                  {selectedAd.images.length > 1 && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#6b7280",
                      }}
                    >
                      +{selectedAd.images.length - 1} ảnh khác
                    </div>
                  )}
                </div>
              )}
            </div>

            <table className="detail-table">
              <tbody>
                <tr>
                  <td>Tiêu đề</td>
                  <td>{selectedAd.title}</td>
                </tr>
                <tr>
                  <td>Nội dung</td>
                  <td>{selectedAd.content}</td>
                </tr>
                <tr>
                  <td>Thời gian hiển thị</td>
                  <td>
                    {formatDate(selectedAd.startDate)} -{" "}
                    {formatDate(selectedAd.endDate)}
                  </td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: selectedAd.isActive
                          ? "#f0fdf4"
                          : "#fef2f2",
                        color: selectedAd.isActive ? "#166534" : "#dc2626",
                      }}
                    >
                      {selectedAd.isActive ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </td>
                </tr>
                {selectedAd.views && (
                  <tr>
                    <td>Lượt xem</td>
                    <td>{selectedAd.views}</td>
                  </tr>
                )}
                {selectedAd.clicks && (
                  <tr>
                    <td>Lượt click</td>
                    <td>{selectedAd.clicks}</td>
                  </tr>
                )}
                <tr>
                  <td>Ngày tạo</td>
                  <td>{formatDate(selectedAd.createdAt)}</td>
                </tr>
                <tr>
                  <td>Ngày cập nhật</td>
                  <td>{formatDate(selectedAd.updatedAt)}</td>
                </tr>
              </tbody>
            </table>

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => handleEditAdvertisement(selectedAd)}
              >
                <FiEdit className="icon" /> Sửa
              </button>
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

      {/* Add Advertisement Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiPlus className="icon" /> Thêm quảng cáo mới
            </h3>
            <form onSubmit={handleSubmitAddForm}>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) =>
                    setAdForm({ ...adForm, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  required
                  value={adForm.content}
                  onChange={(e) =>
                    setAdForm({ ...adForm, content: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => {
                    if (e.target.value) {
                      setAdForm({
                        ...adForm,
                        images: [
                          {
                            url: e.target.value,
                            public_id: "temp",
                            format: "jpg",
                          },
                        ],
                      });
                    } else {
                      setAdForm({ ...adForm, images: [] });
                    }
                  }}
                />
                {/* Image Preview */}
                {adForm.images &&
                  adForm.images.length > 0 &&
                  adForm.images[0].url && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                        }}
                      >
                        Xem trước:
                      </label>
                      <img
                        src={adForm.images[0].url}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: "0.5rem",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f9fafb",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={adForm.startDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group half">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={adForm.endDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, endDate: e.target.value })
                    }
                    min={adForm.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={adForm.isActive}
                  onChange={(e) =>
                    setAdForm({
                      ...adForm,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Advertisement Modal */}
      {showEditModal && selectedAd && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              <FiEdit className="icon" /> Chỉnh sửa quảng cáo
            </h3>
            <form onSubmit={handleSubmitEditForm}>
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  required
                  value={adForm.title}
                  onChange={(e) =>
                    setAdForm({ ...adForm, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  required
                  value={adForm.content}
                  onChange={(e) =>
                    setAdForm({ ...adForm, content: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Ảnh (URL)</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={
                    adForm.images && adForm.images[0]
                      ? adForm.images[0].url
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setAdForm({
                        ...adForm,
                        images: [
                          {
                            url: e.target.value,
                            public_id: "temp",
                            format: "jpg",
                          },
                        ],
                      });
                    } else {
                      setAdForm({ ...adForm, images: [] });
                    }
                  }}
                />
                {/* Image Preview */}
                {adForm.images &&
                  adForm.images.length > 0 &&
                  adForm.images[0].url && (
                    <div style={{ marginTop: "0.5rem" }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                        }}
                      >
                        Xem trước:
                      </label>
                      <img
                        src={adForm.images[0].url}
                        alt="Preview"
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: "0.5rem",
                          border: "1px solid #e5e7eb",
                          backgroundColor: "#f9fafb",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={adForm.startDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, startDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group half">
                  <label>Ngày kết thúc</label>
                  <input
                    type="date"
                    value={adForm.endDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, endDate: e.target.value })
                    }
                    min={adForm.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={adForm.isActive}
                  onChange={(e) =>
                    setAdForm({
                      ...adForm,
                      isActive: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Hoạt động</option>
                  <option value="false">Không hoạt động</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdvertisementsManagement;
