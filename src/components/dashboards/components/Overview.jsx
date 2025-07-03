import React from "react";
import {
  FiUsers,
  FiFileText,
  FiBarChart2,
  FiCheckCircle,
} from "react-icons/fi";
import { BiMoney } from "react-icons/bi";
import { HiAcademicCap } from "react-icons/hi";

const Overview = ({ stats }) => {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <i className="fas fa-chart-pie"></i>
          Tổng quan hệ thống
        </h2>
      </div>
      <div
        className="card-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 3 cột mỗi hàng, nếu muốn 1 hàng thì dùng repeat(6, 1fr)
          gap: "1.5rem",
          padding: "0.5rem 0",
        }}
      >
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <FiUsers className="icon" style={{ color: "#b30000" }} />
              Tổng số học sinh
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              {stats.totalStudents}
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Học sinh đang theo học
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>

        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <FiUsers className="icon" style={{ color: "#b30000" }} />
              Tổng số giáo viên
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              {stats.totalTeachers}
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Giáo viên đang giảng dạy
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>

        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <HiAcademicCap className="icon" style={{ color: "#b30000" }} />
              Lớp học hiện tại
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              {stats.activeClasses}
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Lớp học đang hoạt động
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>

        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <BiMoney className="icon" style={{ color: "#b30000" }} />
              Doanh thu tháng
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              {stats.revenue} VNĐ
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Tổng thu tháng 3/2024
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>

        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <FiCheckCircle className="icon" style={{ color: "#b30000" }} />
              Tỷ lệ hoàn thành
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              92%
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Bài tập đã hoàn thành trong tháng
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff 0%, #fff5f5 100%)",
            border: "2px solid #ffebee",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 10px 25px rgba(179, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
          }}
        >
          <div className="card-content">
            <h3>
              <FiFileText className="icon" style={{ color: "#b30000" }} />
              Số lượng tài liệu
            </h3>
            <p
              className="stat"
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "#b30000",
                margin: "1rem 0",
                textAlign: "center",
              }}
            >
              38
            </p>
            <p
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: "0.9rem",
                margin: "0",
              }}
            >
              Tài liệu học tập hiện có
            </p>
          </div>
          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              backgroundColor: "rgba(179, 0, 0, 0.1)",
              borderRadius: "50%",
              zIndex: 0,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
