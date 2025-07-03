import React from "react";
import { FiX } from "react-icons/fi";

const TuitionDetailModal = ({ tuition, onClose }) => {
  if (!tuition) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Chi tiết khoản học phí</h3>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <table className="detail-table">
            <tbody>
              <tr>
                <td>Tên học viên</td>
                <td>{tuition.student}</td>
              </tr>
              <tr>
                <td>Tên phụ huynh</td>
                <td>{tuition.parent || "Không có thông tin"}</td>
              </tr>
              <tr>
                <td>Tên lớp</td>
                <td>{tuition.class}</td>
              </tr>
              <tr>
                <td>Số buổi học</td>
                <td>{tuition.sessions}</td>
              </tr>
              <tr>
                <td>Tổng số tiền</td>
                <td>{tuition.amount?.toLocaleString()} VNĐ</td>
              </tr>
              <tr>
                <td>Tiền đã đóng</td>
                <td>{(tuition.paid || 0).toLocaleString()} VNĐ</td>
              </tr>
              <tr>
                <td>Ngày</td>
                <td>{tuition.date}</td>
              </tr>
              <tr>
                <td>Trạng thái</td>
                <td>
                  <span
                    className={`status-badge ${
                      tuition.status === "Đã duyệt"
                        ? "success"
                        : tuition.status === "Từ chối"
                        ? "danger"
                        : "warning"
                    }`}
                  >
                    {tuition.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Ảnh minh chứng</td>
                <td>
                  {tuition.proofImage ? (
                    <img
                      src={tuition.proofImage}
                      alt="minh chứng"
                      className="proof-image"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    <span className="no-proof">Chưa có</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default TuitionDetailModal;
