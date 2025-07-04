import { HiAcademicCap, HiCash } from 'react-icons/hi';
import { FiBook, FiClock, FiMapPin, FiUsers, FiEye, FiX, FiBell } from 'react-icons/fi';
import { BsGraphUp } from 'react-icons/bs';
import ClassDetailModal from './modals/ClassDetailModal';
import AttendanceModal from './modals/AttendanceModal';
import React from 'react';
import CreateNoticeModal from './modals/CreateNoticeModal';

function ClassesList({ classes, loading, error, onRetry, onShowClassDetail, showClassDetail, selectedClass, onCloseClassDetail, getStatusBadge, formatSchedule }) {
  const [showAttendance, setShowAttendance] = React.useState(false);
  const [attendanceClass, setAttendanceClass] = React.useState(null);
  const [attendanceData, setAttendanceData] = React.useState({}); // { classId: { studentId: true/false } }
  const [showCreateNotice, setShowCreateNotice] = React.useState(false);
  const [noticeClass, setNoticeClass] = React.useState(null);

  // Helper function để chuẩn bị dữ liệu cho modal
  const prepareClassDataForModal = (classItem) => {
    return {
      // Các trường cơ bản
      id: classItem.id || classItem._id,
      className: classItem.className || classItem.name || 'Chưa có tên lớp',
      room: classItem.room || 'Chưa có thông tin',
      level: classItem.level || 'Chưa có thông tin',
      status: classItem.status,
      isAvailable: classItem.isAvailable,
      schedule: classItem.schedule,
      schedulePreview: classItem.schedulePreview,
      
      // Trường học sinh - có thể là số, mảng, hoặc object
      students: classItem.students || classItem.studentCount || 0,
      
      // Trường độ tuổi - có thể là object {min, max} hoặc string
      ageRange: classItem.ageRange || classItem.age || classItem.grade || null,
      
      // Trường phí mỗi buổi - có thể là số hoặc string
      feePerSession: classItem.feePerSession || classItem.feePerLesson || classItem.fee || classItem.price || null,
      
      // Các trường bổ sung nếu có
      teacher: classItem.teacher || classItem.teacherId,
      topic: classItem.topic,
      description: classItem.description,
      
      // Trường thời gian nếu có
      startDate: classItem.startDate,
      endDate: classItem.endDate,
      
      // Trường trạng thái chi tiết
      isActive: classItem.isActive,
      isCompleted: classItem.isCompleted,
      isCancelled: classItem.isCancelled
    };
  };

  // Helper function để format trạng thái
  const formatStatus = (isAvailable) => {
    if (isAvailable === true) return 'Đang hoạt động';
    if (isAvailable === false) return 'Đã kết thúc';
    return 'Chưa có thông tin';
  };

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <HiAcademicCap className="icon" />
          Lớp học của tôi
        </h2>
      </div>
      {loading ? (
        <div className="loading-container">
          <FiClock className="loading-spinner" />
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          {onRetry && <button className="btn btn-primary" onClick={onRetry}>Thử lại</button>}
        </div>
      ) : classes.length === 0 ? (
        <div className="no-data-container">
          <p>Bạn chưa được phân công lớp học nào.</p>
        </div>
      ) : null}

      {classes.length > 0 && (
        <>
          <div className="card-grid">
            {classes.map(classItem => (
              <div key={classItem.id || classItem._id} className="card" onClick={() => onShowClassDetail(prepareClassDataForModal(classItem))} style={{cursor:'pointer'}}>
                <div className="card-content">
                  <h3>
                    <FiBook className="icon" />
                    {classItem.className || classItem.name}
                  </h3>
                  <p>
                    <FiClock className="icon" />
                    <span>Lịch học:</span>
                    <span>{classItem.schedulePreview || formatSchedule(classItem.schedule) || 'Chưa có thông tin'}</span>
                  </p>
                  <p>
                    <HiAcademicCap className="icon" />
                    <span>Độ tuổi:</span>
                    <span>{classItem.ageRange || classItem.grade || 'Chưa có thông tin'}</span>
                  </p>
                  <p>
                    <FiUsers className="icon" />
                    <span>Học viên:</span>
                    <span>{classItem.students || classItem.studentCount || 0}</span>
                  </p>
                  <p>
                    <BsGraphUp className="icon" />
                    <span>Trạng thái:</span>
                    <span>{formatStatus(classItem.isAvailable)}</span>
                  </p>
                </div>
                <div className="action-buttons" style={{ justifyContent: 'flex-start', display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={e => { 
                    e.stopPropagation(); 
                    console.log('🟢 [Điểm danh] classItem:', classItem);
                    setAttendanceClass(prepareClassDataForModal(classItem)); 
                    setShowAttendance(true);
                  }}>
                    <FiBook className="icon" />
                    Điểm danh
                  </button>
                  <button className="btn btn-primary" style={{ backgroundColor: '#0984e3', borderColor: '#0984e3' }} onClick={e => { e.stopPropagation(); setNoticeClass(prepareClassDataForModal(classItem)); setShowCreateNotice(true); }}>
                    <FiBell className="icon" />
                    thông báo
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Modal hiển thị chi tiết lớp */}
          {showClassDetail && selectedClass && (
            <ClassDetailModal
              classData={selectedClass}
              onClose={onCloseClassDetail}
              getStatusBadge={getStatusBadge}
              formatSchedule={formatSchedule}
              showClassDetail={showClassDetail}
            />
          )}
          {/* Modal điểm danh */}
          {showAttendance && attendanceClass && (
            <>
              {console.log('🟡 [AttendanceModal] attendanceClass:', attendanceClass)}
              {console.log('🟡 [AttendanceModal] showAttendance:', showAttendance)}
              {console.log('🟡 [AttendanceModal] attendanceData:', attendanceData[attendanceClass.id || attendanceClass._id] || {})}
              <AttendanceModal
                classData={attendanceClass}
                onClose={() => setShowAttendance(false)}
                attendance={attendanceData[attendanceClass.id || attendanceClass._id] || {}}
                onSaveAttendance={(classId, data) => {
                  setAttendanceData(prev => ({
                    ...prev,
                    [classId]: data
                  }));
                }}
              />
            </>
          )}
          {/* Modal tạo thông báo */}
          {showCreateNotice && noticeClass && (
            <CreateNoticeModal
              classData={noticeClass}
              onClose={() => setShowCreateNotice(false)}
            />
          )}
        </>
      )}
    </section>
  );
}

export default ClassesList;
