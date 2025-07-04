import { FaChartPie, FaChild, FaUserFriends, FaBook, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";

function ParentOverview({ stats }) {

  return (
    <section>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaChartPie />
          Tổng quan
        </h2>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1.5rem',
          width: '100%',
          minWidth: 0,
        }}
      >
        <div className="parent-card" style={{ minWidth: 0, background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', border: '2px solid #ffebee', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '170px' }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', justifyContent: 'center' }}>
              <FaChild />
              Số con em
            </h3>
            <p className="stat" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaUserFriends />
              {stats.totalChildren}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Con em đang theo học</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="parent-card" style={{ minWidth: 0, background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', border: '2px solid #ffebee', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '170px' }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', justifyContent: 'center' }}>
              <FaBook />
              Tổng khóa học
            </h3>
            <p className="stat" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaBook />
              {stats.totalCourses}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Khóa học đang tham gia</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="parent-card" style={{ minWidth: 0, background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', border: '2px solid #ffebee', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '170px' }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', justifyContent: 'center' }}>
              <FaCalendarAlt />
              Thanh toán tới
            </h3>
            <p className="stat" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaCalendarAlt />
              {stats.nextPayment}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Hạn thanh toán</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="parent-card" style={{ minWidth: 0, background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', border: '2px solid #ffebee', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '170px' }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', justifyContent: 'center' }}>
              <FaMoneyBillWave />
              Tổng học phí
            </h3>
            <p className="stat" style={{ fontSize: '1.4rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              {stats.totalFees ? stats.totalFees.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ'}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Học phí tháng này</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
      </div>
    </section>
  );
}

export default ParentOverview;

