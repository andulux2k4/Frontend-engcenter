import React from "react";
import { FiPlus, FiEdit, FiX } from "react-icons/fi";

const TuitionFormModal = ({
  show,
  onClose,
  onSubmit,
  editingTuition,
  loading,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          borderRadius: "0.5rem",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          padding: "1.5rem",
        }}
      >
        <div
          className="modal-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#b30000" }}>
            {editingTuition ? (
              <>
                <FiEdit style={{ marginRight: "0.5rem" }} />
                Sửa khoản học phí
              </>
            ) : (
              <>
                <FiPlus style={{ marginRight: "0.5rem" }} />
                Thêm khoản học phí
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6b7280",
              cursor: "pointer",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiX />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Get form data and submit
            const formData = {
              student: e.target.student.value,
              parent: e.target.parent.value,
              class: e.target.class.value,
              sessions: parseInt(e.target.sessions.value, 10),
              amount: parseInt(e.target.amount.value, 10),
              paid: parseInt(e.target.paid.value, 10) || 0,
              date: e.target.date.value,
            };
            if (editingTuition) {
              formData.id = editingTuition.id;
              formData.status = editingTuition.status;
              formData.proofImage = editingTuition.proofImage;
            }
            onSubmit(formData);
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="student"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Học viên:
              </label>
              <input
                type="text"
                id="student"
                name="student"
                required
                defaultValue={editingTuition?.student || ""}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="parent"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Phụ huynh:
              </label>
              <input
                type="text"
                id="parent"
                name="parent"
                required
                defaultValue={editingTuition?.parent || ""}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="class"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Lớp học:
            </label>
            <input
              type="text"
              id="class"
              name="class"
              required
              defaultValue={editingTuition?.class || ""}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="sessions"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Số buổi:
              </label>
              <input
                type="number"
                id="sessions"
                name="sessions"
                min="1"
                required
                defaultValue={editingTuition?.sessions || "1"}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="date"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Ngày:
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                defaultValue={
                  editingTuition?.date || new Date().toISOString().split("T")[0]
                }
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div className="form-group">
              <label
                htmlFor="amount"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Tổng tiền:
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                min="0"
                required
                defaultValue={editingTuition?.amount || "0"}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="paid"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151",
                }}
              >
                Đã đóng:
              </label>
              <input
                type="number"
                id="paid"
                name="paid"
                min="0"
                defaultValue={editingTuition?.paid || "0"}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "1.5rem",
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                backgroundColor: "#b30000",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              {editingTuition ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TuitionFormModal;
