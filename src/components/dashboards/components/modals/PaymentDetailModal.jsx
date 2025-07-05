import React from "react";

function PaymentDetailModal({
  show,
  onClose,
  payment,
  paymentAmount,
  onAmountChange,
  onImageChange,
  verificationPreview,
  onSubmit,
  isSubmitting = false,
}) {
  if (!show || !payment) return null;

  // Kiểm tra trạng thái thanh toán
  const isPaymentCompleted =
    payment.status === "Đã thanh toán" || payment.status === "Chờ xác thực";
  const statusMessage = {
    "Đã thanh toán": "Học phí này đã được thanh toán.",
    "Chờ xác thực": "Đã có yêu cầu thanh toán đang chờ admin xác thực.",
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <form onSubmit={onSubmit}>
          <div
            className="modal-header"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <h3
              style={{
                marginBottom: "1.5rem",
                color: "#b30000",
                textAlign: "center",
                flex: 1,
              }}
            >
              Thanh toán học phí
            </h3>
          </div>
          <div className="modal-body">
            {/* Hiển thị cảnh báo nếu đã có yêu cầu thanh toán */}
            {isPaymentCompleted && (
              <div
                style={{
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffeaa7",
                  borderRadius: "6px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  color: "#856404",
                }}
              >
                <strong>⚠️ Thông báo:</strong>{" "}
                {statusMessage[payment.status] ||
                  "Học phí này không thể tạo yêu cầu thanh toán mới."}
              </div>
            )}

            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <label
                style={{
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Quét mã QR để chuyển khoản
              </label>
              <img
                src={payment?.qrImage}
                alt="QR code"
                style={{
                  width: "160px",
                  height: "160px",
                  objectFit: "contain",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  background: "#fafafa",
                  margin: "0 auto",
                }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: 600 }}>Nhập số tiền thanh toán</label>
              <input
                type="text"
                value={paymentAmount}
                onChange={onAmountChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "0.5rem",
                }}
                required
                disabled={isPaymentCompleted}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: 600 }}>
                Tải ảnh xác minh chuyển khoản
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                style={{ display: "block", marginTop: "0.5rem" }}
                required
                disabled={isPaymentCompleted}
              />
              {verificationPreview && (
                <img
                  src={verificationPreview}
                  alt="Xác minh"
                  style={{
                    marginTop: "0.5rem",
                    maxWidth: "100%",
                    maxHeight: "120px",
                    borderRadius: "6px",
                    border: "1px solid #eee",
                  }}
                />
              )}
            </div>
          </div>
          <div
            className="modal-footer"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ backgroundColor: "grey" }}
              disabled={isSubmitting}
            >
              {isPaymentCompleted ? "Đóng" : "Hủy"}
            </button>
            {!isPaymentCompleted && (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang gửi..." : "Xác nhận"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentDetailModal;
