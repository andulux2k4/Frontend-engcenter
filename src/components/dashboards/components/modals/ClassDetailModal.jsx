import { FiBook, FiX, FiUsers, FiCalendar, FiDollarSign, FiClock, FiMapPin } from 'react-icons/fi';

function ClassDetailModal({ classData, onClose, getStatusBadge, formatSchedule }) {
  if (!classData) return null;

  console.log(classData);

  // Helper function để format độ tuổi
  const formatAgeRange = (ageRange) => {
    if (!ageRange) return 'Chưa có thông tin';
    if (typeof ageRange === 'string') return ageRange;
    if (ageRange.min && ageRange.max) {
      return `${ageRange.min} - ${ageRange.max} tuổi`;
    }
    return 'Chưa có thông tin';
  };

  // Helper function để format số học sinh
  const formatStudentCount = (students) => {
    if (!students) return '0';
    if (Array.isArray(students)) return students.length.toString();
    if (typeof students === 'number') return students.toString();
    if (typeof students === 'object' && students.length !== undefined) return students.length.toString();
    return '0';
  };

  // Helper function để format phí mỗi buổi
  const formatFeePerSession = (fee) => {
    if (!fee) return 'Chưa có thông tin';
    if (typeof fee === 'number') {
      return `${fee.toLocaleString('vi-VN')} VNĐ`;
    }
    if (typeof fee === 'string') {
      return fee;
    }
    return 'Chưa có thông tin';
  };

  // Helper function để format lịch học
  const formatScheduleDisplay = (schedulePreview, schedule) => {
    if (schedulePreview) return schedulePreview;
    if (schedule) return formatSchedule(schedule);
    return 'Chưa có thông tin';
  };

  // Helper function để format trạng thái
  const formatStatus = (isAvailable) => {
    if (isAvailable === true) return 'Đang hoạt động';
    if (isAvailable === false) return 'Đã kết thúc';
    return 'Chưa có thông tin';
  };

  // Styles
  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center'
  };
  const modalStyle = {
    background: '#fff', borderRadius: 16, maxWidth: 800, width: '95vw', maxHeight: '90vh', overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', padding: 0
  };
  const headerStyle = {
    background: 'linear-gradient(135deg, #b30000 0%, #800000 100%)', color: '#fff', padding: '1.5rem 2rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)'
  };
  const titleStyle = { margin: 0, fontSize: 24, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12 };
  const closeBtnStyle = {
    background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 20, transition: 'all 0.3s'
  };
  const bodyStyle = { padding: '2rem', flex: 1 };
  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24
  };
  const cardStyle = {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: 12, padding: 24, border: '1px solid #e9ecef',
    display: 'flex', alignItems: 'flex-start', gap: 16, transition: 'all 0.3s'
  };
  const iconStyle = {
    background: 'linear-gradient(135deg, #b30000 0%, #800000 100%)', color: '#fff', width: 44, height: 44, borderRadius: 12,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0
  };
  const contentStyle = { flex: 1 };
  const labelStyle = { margin: 0, fontSize: 14, fontWeight: 600, color: '#6c757d', textTransform: 'uppercase', letterSpacing: 0.5 };
  const valueStyle = { margin: 0, fontSize: 18, fontWeight: 600, color: '#2d3748', lineHeight: 1.4 };
  const footerStyle = {
    background: '#f8f9fa', padding: '1.5rem 2rem', borderTop: '1px solid #e9ecef', display: 'flex', justifyContent: 'flex-end', gap: 16
  };
  const btnStyle = {
    padding: '0.75rem 1.5rem', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 16,
    background: 'linear-gradient(135deg, #b30000 0%, #800000 100%)', color: '#fff', transition: 'all 0.3s'
  };

  // Responsive
  if (window.innerWidth < 768) {
    modalStyle.width = '98vw';
    modalStyle.maxHeight = '95vh';
    headerStyle.padding = '1rem 1.5rem';
    bodyStyle.padding = '1.2rem';
    gridStyle.gridTemplateColumns = '1fr';
    cardStyle.padding = 16;
    iconStyle.width = 36; iconStyle.height = 36; iconStyle.fontSize = 18;
    titleStyle.fontSize = 18;
    footerStyle.padding = '1rem 1.5rem';
    valueStyle.fontSize = 15;
    labelStyle.fontSize = 12;
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            <FiBook style={{marginRight: 8}} /> Thông tin chi tiết lớp học
          </h3>
        </div>
        <div style={bodyStyle}>
          <div style={gridStyle}>
            {/* Tên lớp */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiBook /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Tên lớp</div>
                <div style={valueStyle}>{classData.className || 'Chưa có thông tin'}</div>
              </div>
            </div>
            {/* Độ tuổi */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiUsers /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Độ tuổi</div>
                <div style={valueStyle}>{formatAgeRange(classData.ageRange || classData.grade)}</div>
              </div>
            </div>
            {/* Số học sinh */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiUsers /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Số học sinh</div>
                <div style={valueStyle}>{formatStudentCount(classData.students)}</div>
              </div>
            </div>
            {/* Lịch dạy */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiCalendar /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Lịch dạy</div>
                <div style={valueStyle}>{formatScheduleDisplay(classData.schedulePreview, classData.schedule)}</div>
              </div>
            </div>
            {/* Phí mỗi buổi */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiDollarSign /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Phí mỗi buổi</div>
                <div style={valueStyle}>{formatFeePerSession(classData.feePerSession)}</div>
              </div>
            </div>
            {/* Trạng thái */}
            <div style={cardStyle}>
              <div style={iconStyle}><FiClock /></div>
              <div style={contentStyle}>
                <div style={labelStyle}>Trạng thái</div>
                <div style={valueStyle}>
                  {getStatusBadge ? getStatusBadge(classData.isAvailable) : formatStatus(classData.isAvailable)}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={footerStyle}>
          <button style={btnStyle} onClick={onClose}>
            <FiX style={{marginRight: 6}} /> Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassDetailModal;
