import React from 'react';
import apiService from '../../../../services/api';
import styles from './AttendanceModal.module.css';

function AttendanceModal({ classData, onClose, attendance: attendanceProp = {}, onSaveAttendance }) {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [attendance, setAttendance] = React.useState(attendanceProp);
  const [saveMessage, setSaveMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [classSchedule, setClassSchedule] = React.useState(null);
  const [attendanceCount, setAttendanceCount] = React.useState(0);

  React.useEffect(() => {
    fetchClassStudents();
    fetchAttendanceCount();
  }, [classData]);

  // Lấy danh sách học sinh từ API
  const fetchClassStudents = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = apiService.getToken();
      if (!token) {
        setError('❌ Không có quyền truy cập. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      // Lấy thông tin chi tiết lớp bao gồm danh sách học sinh
      const response = await apiService.getClassById(token, classData.id || classData._id);
      
      if (response.success || response.data) {
        const classInfo = response.data || response;
        
        // Lưu lịch học của lớp
        setClassSchedule(classInfo.schedule || classInfo.scheduleFormatted);
        
        // Lấy danh sách học sinh từ studentList (không phải students)
        const studentList = classInfo.studentList || [];
        
        // Chuyển đổi dữ liệu học sinh để phù hợp với component
        // Cấu trúc: studentList[i].userId chứa thông tin học sinh
        const formattedStudents = studentList.map((student, index) => {
          const userInfo = student.userId || {};
          return {
            id: student._id, // ID của student record
            userId: userInfo._id, // ID của user
            name: userInfo.name || 'Chưa có tên',
            email: userInfo.email || 'Chưa có email',
            phoneNumber: userInfo.phoneNumber || 'Chưa có số điện thoại',
            parentId: student.parentId?._id || null,
            parentName: student.parentId?.userId?.name || 'Chưa có phụ huynh'
          };
        });
        
        setStudents(formattedStudents);
        
        // Khởi tạo trạng thái điểm danh
        if (attendanceProp && Object.keys(attendanceProp).length > 0) {
          setAttendance(attendanceProp);
        } else {
          const initial = {};
          formattedStudents.forEach(stu => { 
            initial[stu.id] = false; 
          });
          setAttendance(initial);
        }
      } else {
        setError('❌ Không thể tải danh sách học sinh. Vui lòng thử lại.');
      }
    } catch (error) {
      setError('❌ Có lỗi xảy ra khi tải danh sách học sinh.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy số buổi điểm danh đã có của lớp
  const fetchAttendanceCount = async () => {
    try {
      const token = apiService.getToken();
      if (!token) return;
      const classId = classData.id || classData._id;
      // Lấy tối đa 1000 buổi điểm danh (nếu nhiều hơn cần phân trang)
      const res = await apiService.getClassAttendance(token, classId, 1, 1000);
      if (res && res.data && Array.isArray(res.data)) {
        setAttendanceCount(res.data.length);
      } else if (res && res.attendance && Array.isArray(res.attendance)) {
        setAttendanceCount(res.attendance.length);
      } else {
        setAttendanceCount(0);
      }
    } catch (e) {
      setAttendanceCount(0);
    }
  };

  // Kiểm tra xem ngày có phải là ngày học không
  const isClassDay = (date) => {
    if (!classSchedule || !classSchedule.daysOfLessonInWeek) return false;
    
    const dayOfWeek = new Date(date).getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ...
    return classSchedule.daysOfLessonInWeek.includes(dayOfWeek);
  };

  // Kiểm tra xem ngày có trong khoảng thời gian của lớp không
  const isDateInClassRange = (date) => {
    if (!classData) return false;
    
    const selectedDate = new Date(date);
    
    // Thử nhiều field names khác nhau cho startDate
    const startDate = classData.startDate ? new Date(classData.startDate) : 
                     classData.startAt ? new Date(classData.startAt) :
                     classData.openingDate ? new Date(classData.openingDate) :
                     classData.createdAt ? new Date(classData.createdAt) : null;
    
    // Thử nhiều field names khác nhau cho endDate
    const endDate = classData.endDate ? new Date(classData.endDate) :
                   classData.endAt ? new Date(classData.endAt) :
                   classData.closingDate ? new Date(classData.closingDate) :
                   classData.finishDate ? new Date(classData.finishDate) : null;
    
    
    
    // Nếu không có ngày bắt đầu hoặc kết thúc, cho phép
    if (!startDate && !endDate) return true;
    
    // Kiểm tra ngày bắt đầu (ngày mở lớp)
    if (startDate && selectedDate < startDate) {
      return false;
    }
    
    // Kiểm tra ngày kết thúc (ngày đóng lớp)
    if (endDate && selectedDate > endDate) {
      return false;
    }
    
    return true;
  };

  // Kiểm tra xem ngày có hợp lệ để tạo điểm danh không
  const isValidAttendanceDate = (date) => {
    return isClassDay(date) && isDateInClassRange(date);
  };

  // Lấy thông báo lỗi cho ngày không hợp lệ
  const getDateValidationMessage = (date) => {
    if (!date) return '';
    
    const selectedDate = new Date(date);
    
    // Thử nhiều field names khác nhau cho startDate
    const startDate = classData.startDate ? new Date(classData.startDate) : 
                     classData.startAt ? new Date(classData.startAt) :
                     classData.openingDate ? new Date(classData.openingDate) :
                     classData.createdAt ? new Date(classData.createdAt) : null;
    
    // Thử nhiều field names khác nhau cho endDate
    const endDate = classData.endDate ? new Date(classData.endDate) :
                   classData.endAt ? new Date(classData.endAt) :
                   classData.closingDate ? new Date(classData.closingDate) :
                   classData.finishDate ? new Date(classData.finishDate) : null;
    
    // Kiểm tra ngày bắt đầu (ngày mở lớp)
    if (startDate && selectedDate < startDate) {
      return `❌ Không thể điểm danh: Ngày ${getDayName(date)} (${selectedDate.toLocaleDateString('vi-VN')}) sớm hơn ngày mở lớp (${startDate.toLocaleDateString('vi-VN')})`;
    }
    
    // Kiểm tra ngày kết thúc (ngày đóng lớp)
    if (endDate && selectedDate > endDate) {
      return `❌ Không thể điểm danh: Ngày ${getDayName(date)} (${selectedDate.toLocaleDateString('vi-VN')}) muộn hơn ngày đóng lớp (${endDate.toLocaleDateString('vi-VN')})`;
    }
    
    // Kiểm tra ngày học
    if (!isClassDay(date)) {
      return `❌ Không thể điểm danh: Ngày ${getDayName(date)} không phải là ngày học của lớp. Lịch học: ${getClassDays().join(', ')}`;
    }
    
    return '';
  };

  // Lấy tên ngày trong tuần
  const getDayName = (date) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[new Date(date).getDay()];
  };

  // Lấy danh sách ngày học trong tuần
  const getClassDays = () => {
    if (!classSchedule || !classSchedule.daysOfLessonInWeek) return [];
    
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return classSchedule.daysOfLessonInWeek.map(dayIndex => days[dayIndex]);
  };

  // Xử lý khi tick checkbox
  const handleCheck = (studentId) => {
    setAttendance(prev => ({ ...prev, [studentId]: !prev[studentId] }));
  };

  // Xử lý lưu điểm danh
  const handleSave = async () => {
    if (!selectedDate) {
      setError('❌ Vui lòng chọn ngày điểm danh.');
      return;
    }

    const validationMessage = getDateValidationMessage(selectedDate);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSaving(true);
    setSaveMessage('');
    setError('');
    
    try {
      const token = apiService.getToken();
      if (!token) {
        setError('❌ Không có quyền truy cập. Vui lòng đăng nhập lại.');
        setSaving(false);
        return;
      }

      const classId = classData.id || classData._id;
      
      // Tạo buổi điểm danh mới
      const attendanceData = {
        date: selectedDate,
        lessonNumber: attendanceCount + 1,
        note: `Điểm danh lớp ${classData.className} - ${getDayName(selectedDate)}`
      };

      const createResponse = await apiService.createAttendanceSession(token, classId, attendanceData);
      
      if (createResponse.success || createResponse.data) {
        const attendanceId = createResponse.data?._id || createResponse._id;
        
        // Chuyển đổi dữ liệu attendance để phù hợp với API
        const studentsAttendance = Object.entries(attendance).map(([studentId, isPresent]) => ({
          studentId: studentId,
          isAbsent: !isPresent // API sử dụng isAbsent, chúng ta đảo ngược logic
        }));

        // Đánh dấu điểm danh cho từng học sinh
        const markResponse = await apiService.markAttendance(token, attendanceId, {
          students: studentsAttendance
        });

        if (markResponse.success || markResponse.data) {
          setSaveMessage('✅ Lưu điểm danh thành công!');
          if (onSaveAttendance) {
            onSaveAttendance(classId, attendance);
          }
          setTimeout(() => {
            setSaveMessage('');
            onClose();
          }, 1500);
        } else {
          setError('❌ Có lỗi khi đánh dấu điểm danh. Vui lòng thử lại.');
        }
      } else {
        setError('❌ Có lỗi khi tạo buổi điểm danh. Vui lòng thử lại.');
      }
    } catch (error) {
      // Log chi tiết lỗi để debug
      console.error('Error saving attendance:', error, error?.message, error?.response);
      // Lấy message từ nhiều nguồn khác nhau
      const errorMsg = error?.response?.error || error?.response?.data?.error || error?.message || '';
      if (
        errorMsg.includes('duplicate key') || errorMsg.includes('E11000')
      ) {
        setError('❌ Đã tồn tại buổi điểm danh cho ngày này. Vui lòng chọn ngày khác hoặc kiểm tra lại danh sách điểm danh.');
      } else if (errorMsg.includes('không khớp với lịch học')) {
        setError('❌ Ngày điểm danh không khớp với lịch học của lớp. Vui lòng chọn ngày khác.');
      } else {
        setError('❌ Có lỗi xảy ra khi lưu điểm danh. Vui lòng thử lại.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal']}>
        <h2 className={styles['modal-title']}>Điểm danh - {classData.className}</h2>
        
        {error && (
          <div style={{
            textAlign: 'center',
            color: '#e74c3c',
            backgroundColor: '#fdf2f2',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Thông tin lịch học */}
        {classSchedule && (
          <div style={{ 
            backgroundColor: '#e8f4fd', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '15px',
            border: '1px solid #bee5eb'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '5px' }}>📅 Thông tin lớp học:</div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>
              <strong>📚 Lịch học:</strong> {getClassDays().join(', ')}
              {(() => {
                const startDate = classData.startDate ? new Date(classData.startDate) : null;
                const endDate = classData.endDate ? new Date(classData.endDate) : null;
                if (startDate || endDate) {
                  return (
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                      <strong>⏰ Thời gian hoạt động:</strong>
                      {startDate && (
                        <span style={{ color: '#27ae60' }}> Từ {startDate.toLocaleDateString('vi-VN')}</span>
                      )}
                      {endDate && (
                        <span style={{ color: '#e74c3c' }}> đến {endDate.toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        )}

        {/* Chọn ngày điểm danh */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Chọn ngày điểm danh:
          </label>
          {(() => {
            const startDate = classData.startDate ? new Date(classData.startDate) : null;
            const endDate = classData.endDate ? new Date(classData.endDate) : null;
            return (
              <div style={{ fontSize: '0.95rem', color: '#2980b9', margin: '6px 0 8px 0', fontWeight: 500 }}>
                {startDate && (
                  <span>⏰ Ngày mở lớp: <span style={{ color: '#27ae60' }}>{startDate.toLocaleDateString('vi-VN')}</span></span>
                )}
                {endDate && (
                  <span style={{ marginLeft: 16 }}>⏰ Ngày đóng lớp: <span style={{ color: '#e74c3c' }}>{endDate.toLocaleDateString('vi-VN')}</span></span>
                )}
              </div>
            );
          })()}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
          {selectedDate && (
            <div style={{ 
              fontSize: '0.9rem', 
              color: isValidAttendanceDate(selectedDate) ? '#27ae60' : '#e74c3c',
              marginTop: '5px',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: isValidAttendanceDate(selectedDate) ? '#d5f4e6' : '#fdf2f2',
              border: `1px solid ${isValidAttendanceDate(selectedDate) ? '#a8e6cf' : '#f5c6cb'}`
            }}>
              {isValidAttendanceDate(selectedDate) ? (
                `✅ ${getDayName(selectedDate)} - Ngày học hợp lệ`
              ) : (
                `❌ ${getDayName(selectedDate)} - ${getDateValidationMessage(selectedDate).replace('❌ Không thể điểm danh: ', '')}`
              )}
            </div>
          )}
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div>Đang tải danh sách học viên...</div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
              Lớp {classData.className}
            </div>
          </div>
        ) : students.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#666' }}>
            Không có học viên nào trong lớp này.
          </div>
        ) : (
          <table className={styles['attendance-table']}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên học viên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Phụ huynh</th>
                <th>Tích vắng</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr key={student.id || idx}>
                  <td>{idx + 1}</td>
                  <td style={{ fontWeight: '600' }}>{student.name}</td>
                  <td style={{ fontSize: '0.9rem', color: '#666' }}>
                    {student.email}
                  </td>
                  <td style={{ fontSize: '0.9rem', color: '#666' }}>
                    {student.phoneNumber}
                  </td>
                  <td style={{ fontSize: '0.9rem', color: '#666' }}>
                    {student.parentName}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!attendance[student.id]}
                      onChange={() => handleCheck(student.id)}
                      disabled={saving}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            className={`btn btn-secondary ${styles['save-btn']}`}
            onClick={onClose}
            disabled={saving}
            style={{ backgroundColor: '#95a5a6', border: 'none', color: 'white' }}
          >
            Hủy
          </button>
          <button
            className={`btn btn-primary ${styles['save-btn']}`}
            onClick={handleSave}
            disabled={saving || loading || students.length === 0 || !selectedDate || !isValidAttendanceDate(selectedDate)}
          >
            {saving ? 'Đang lưu...' : 'Lưu điểm danh'}
          </button>
        </div>
        
        {saveMessage && (
          <div style={{ 
            textAlign: 'center', 
            color: '#27ae60', 
            backgroundColor: '#d5f4e6', 
            padding: '10px', 
            borderRadius: '5px', 
            marginTop: '15px',
            border: '1px solid #a8e6cf'
          }}>
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceModal;