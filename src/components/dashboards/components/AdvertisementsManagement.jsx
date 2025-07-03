import React, { useState, useEffect } from "react";
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

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Form state
  const [adForm, setAdForm] = useState({
    title: "",
    description: "",
    url: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    target: "all", // all, student, parent, teacher
    position: "homepage", // homepage, dashboard, sidebar
    status: "Hoạt động",
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

  // Mock advertisement data
  const mockAdvertisements = [
    {
      id: 1,
      title: "Khóa học IELTS Intensive",
      description:
        "Khóa học IELTS tăng tốc, cam kết đạt 6.5+ sau 3 tháng. Giảm 15% học phí cho học viên đăng ký trước 15/04/2024.",
      url: "https://tttenglish.edu.vn/ielts-intensive",
      imageUrl: "https://via.placeholder.com/600x300?text=IELTS+Intensive",
      startDate: "2024-03-20",
      endDate: "2024-04-15",
      target: "all",
      position: "homepage",
      status: "Hoạt động",
    },
    {
      id: 2,
      title: "Khóa học TOEIC Online",
      description:
        "Học TOEIC online với giáo viên kinh nghiệm. Học phí chỉ từ 1.990.000đ cho 3 tháng. Tặng khóa luyện đề miễn phí.",
      url: "https://tttenglish.edu.vn/toeic-online",
      imageUrl: "https://via.placeholder.com/600x300?text=TOEIC+Online",
      startDate: "2024-03-10",
      endDate: "2024-04-10",
      target: "student",
      position: "dashboard",
      status: "Hoạt động",
    },
    {
      id: 3,
      title: "Chương trình du học hè 2024",
      description:
        "Du học hè tại Anh, Mỹ, Singapore. Trải nghiệm môi trường học tập quốc tế, nâng cao kỹ năng tiếng Anh và khám phá văn hóa.",
      url: "https://tttenglish.edu.vn/summer-abroad",
      imageUrl: "https://via.placeholder.com/600x300?text=Summer+Abroad",
      startDate: "2024-02-15",
      endDate: "2024-04-30",
      target: "parent",
      position: "homepage",
      status: "Hoạt động",
    },
    {
      id: 4,
      title: "Tuyển dụng giáo viên tiếng Anh",
      description:
        "Trung tâm đang tuyển dụng giáo viên tiếng Anh cho các khóa học IELTS, TOEIC và tiếng Anh cho trẻ em.",
      url: "https://tttenglish.edu.vn/careers",
      imageUrl: "https://via.placeholder.com/600x300?text=Teacher+Recruitment",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      target: "teacher",
      position: "sidebar",
      status: "Đã kết thúc",
    },
    {
      id: 5,
      title: "Khóa học tiếng Anh cho trẻ em",
      description:
        "Khóa học tiếng Anh dành cho trẻ em từ 4-12 tuổi. Phương pháp học thông qua các hoạt động vui chơi, giúp trẻ yêu thích ngôn ngữ.",
      url: "https://tttenglish.edu.vn/english-for-kids",
      imageUrl: "https://via.placeholder.com/600x300?text=English+For+Kids",
      startDate: "2024-03-15",
      endDate: "2024-05-15",
      target: "parent",
      position: "homepage",
      status: "Hoạt động",
    },
  ];

  // Fetch advertisements from API
  const fetchAdvertisements = async () => {
    if (!user?.token) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call when available
      // const response = await apiService.getAdvertisements(user.token);
      // if (response.success) {
      //   setAdvertisements(response.data);
      // } else {
      //   setError(response.message || "Không thể tải dữ liệu quảng cáo");
      // }

      // Using mock data for now
      setTimeout(() => {
        setAdvertisements(mockAdvertisements);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching advertisements:", error);
      setError("Lỗi kết nối. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  // Filter advertisements based on status and search term
  const filteredAdvertisements = advertisements.filter((ad) => {
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter;
    const matchesSearch =
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
  }, [filteredAdvertisements, advertisementsPagination.limit]);

  // Get paginated advertisements
  const paginatedAdvertisements = filteredAdvertisements.slice(
    (advertisementsPagination.currentPage - 1) * advertisementsPagination.limit,
    advertisementsPagination.currentPage * advertisementsPagination.limit
  );

  // Load initial data
  useEffect(() => {
    fetchAdvertisements();
  }, [user?.token]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Handle add advertisement
  const handleAddAdvertisement = () => {
    setAdForm({
      title: "",
      description: "",
      url: "",
      imageUrl: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      target: "all",
      position: "homepage",
      status: "Hoạt động",
    });
    setShowAddModal(true);
  };

  // Handle edit advertisement
  const handleEditAdvertisement = (ad) => {
    setSelectedAd(ad);
    setAdForm({
      title: ad.title,
      description: ad.description,
      url: ad.url,
      imageUrl: ad.imageUrl,
      startDate: ad.startDate,
      endDate: ad.endDate,
      target: ad.target,
      position: ad.position,
      status: ad.status,
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
        ad.id === adId
          ? {
              ...ad,
              status: ad.status === "Hoạt động" ? "Đã kết thúc" : "Hoạt động",
            }
          : ad
      )
    );
  };

  // Handle delete advertisement
  const handleDeleteAdvertisement = (adId) => {
    if (window.confirm("Bạn có chắc muốn xóa quảng cáo này?")) {
      setAdvertisements((prev) => prev.filter((ad) => ad.id !== adId));
    }
  };

  // Handle form submission for adding advertisement
  const handleSubmitAddForm = (e) => {
    e.preventDefault();

    // Add new advertisement to the list with a generated ID
    setAdvertisements((prev) => [
      {
        ...adForm,
        id: Date.now(),
      },
      ...prev,
    ]);

    setShowAddModal(false);
  };

  // Handle form submission for editing advertisement
  const handleSubmitEditForm = (e) => {
    e.preventDefault();

    if (!selectedAd) return;

    // Update the advertisement in the list
    setAdvertisements((prev) =>
      prev.map((ad) => (ad.id === selectedAd.id ? { ...ad, ...adForm } : ad))
    );

    setShowEditModal(false);
  };

  // Helper function to get target audience display name
  const getTargetDisplay = (target) => {
    switch (target) {
      case "all":
        return "Tất cả";
      case "student":
        return "Học sinh";
      case "parent":
        return "Phụ huynh";
      case "teacher":
        return "Giáo viên";
      default:
        return target;
    }
  };

  // Helper function to get position display name
  const getPositionDisplay = (position) => {
    switch (position) {
      case "homepage":
        return "Trang chủ";
      case "dashboard":
        return "Dashboard";
      case "sidebar":
        return "Sidebar";
      default:
        return position;
    }
  };

  return (
    <section className="advertisements-section">
      <div className="section-header">
        <h2 className="section-title">
          <MdCampaign className="icon" />
          Quản lý Quảng cáo
        </h2>
        <button className="btn btn-primary" onClick={handleAddAdvertisement}>
          <FiPlus className="icon" /> Thêm quảng cáo
        </button>
      </div>

      {/* Filter and search */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Hoạt động">Hoạt động</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Tìm kiếm quảng cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Loading state */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Advertisements table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Đối tượng</th>
              <th>Vị trí</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvertisements.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-table">
                  {loading ? "Đang tải..." : "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              paginatedAdvertisements.map((ad) => (
                <tr key={ad.id} onClick={(e) => handleAdRowClick(ad, e)}>
                  <td className="ad-title">{ad.title}</td>
                  <td>{formatDate(ad.startDate)}</td>
                  <td>{formatDate(ad.endDate)}</td>
                  <td>{getTargetDisplay(ad.target)}</td>
                  <td>{getPositionDisplay(ad.position)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        ad.status === "Hoạt động" ? "success" : ""
                      }`}
                    >
                      {ad.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEditAdvertisement(ad)}
                      >
                        <FiEdit className="icon" /> Sửa
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleToggleAdvertisementStatus(ad.id)}
                      >
                        {ad.status === "Hoạt động" ? "Ngừng" : "Kích hoạt"}
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteAdvertisement(ad.id)}
                      >
                        <FiTrash2 className="icon" /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
              {selectedAd.imageUrl && (
                <img
                  src={selectedAd.imageUrl}
                  alt={selectedAd.title}
                  className="ad-image"
                />
              )}
            </div>

            <table className="detail-table">
              <tbody>
                <tr>
                  <td>Tiêu đề</td>
                  <td>{selectedAd.title}</td>
                </tr>
                <tr>
                  <td>Mô tả</td>
                  <td>{selectedAd.description}</td>
                </tr>
                <tr>
                  <td>URL</td>
                  <td>
                    <a
                      href={selectedAd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedAd.url}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Thời gian hiển thị</td>
                  <td>
                    {formatDate(selectedAd.startDate)} -{" "}
                    {formatDate(selectedAd.endDate)}
                  </td>
                </tr>
                <tr>
                  <td>Đối tượng</td>
                  <td>{getTargetDisplay(selectedAd.target)}</td>
                </tr>
                <tr>
                  <td>Vị trí</td>
                  <td>{getPositionDisplay(selectedAd.position)}</td>
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td>
                    <span
                      className={`status-badge ${
                        selectedAd.status === "Hoạt động" ? "success" : ""
                      }`}
                    >
                      {selectedAd.status}
                    </span>
                  </td>
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
                <label>Mô tả</label>
                <textarea
                  required
                  value={adForm.description}
                  onChange={(e) =>
                    setAdForm({ ...adForm, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  required
                  value={adForm.url}
                  onChange={(e) =>
                    setAdForm({ ...adForm, url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>URL ảnh</label>
                <input
                  type="url"
                  value={adForm.imageUrl}
                  onChange={(e) =>
                    setAdForm({ ...adForm, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
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
                    required
                    value={adForm.endDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, endDate: e.target.value })
                    }
                    min={adForm.startDate}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Đối tượng</label>
                  <select
                    required
                    value={adForm.target}
                    onChange={(e) =>
                      setAdForm({ ...adForm, target: e.target.value })
                    }
                  >
                    <option value="all">Tất cả</option>
                    <option value="student">Học sinh</option>
                    <option value="parent">Phụ huynh</option>
                    <option value="teacher">Giáo viên</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Vị trí</label>
                  <select
                    required
                    value={adForm.position}
                    onChange={(e) =>
                      setAdForm({ ...adForm, position: e.target.value })
                    }
                  >
                    <option value="homepage">Trang chủ</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
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
                <label>Mô tả</label>
                <textarea
                  required
                  value={adForm.description}
                  onChange={(e) =>
                    setAdForm({ ...adForm, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  required
                  value={adForm.url}
                  onChange={(e) =>
                    setAdForm({ ...adForm, url: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label>URL ảnh</label>
                <input
                  type="url"
                  value={adForm.imageUrl}
                  onChange={(e) =>
                    setAdForm({ ...adForm, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Ngày bắt đầu</label>
                  <input
                    type="date"
                    required
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
                    required
                    value={adForm.endDate}
                    onChange={(e) =>
                      setAdForm({ ...adForm, endDate: e.target.value })
                    }
                    min={adForm.startDate}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Đối tượng</label>
                  <select
                    required
                    value={adForm.target}
                    onChange={(e) =>
                      setAdForm({ ...adForm, target: e.target.value })
                    }
                  >
                    <option value="all">Tất cả</option>
                    <option value="student">Học sinh</option>
                    <option value="parent">Phụ huynh</option>
                    <option value="teacher">Giáo viên</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Vị trí</label>
                  <select
                    required
                    value={adForm.position}
                    onChange={(e) =>
                      setAdForm({ ...adForm, position: e.target.value })
                    }
                  >
                    <option value="homepage">Trang chủ</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  required
                  value={adForm.status}
                  onChange={(e) =>
                    setAdForm({ ...adForm, status: e.target.value })
                  }
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
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
