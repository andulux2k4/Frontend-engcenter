import { FiCalendar, FiChevronLeft, FiChevronRight, FiClock, FiBook, FiMapPin, FiFileText, FiUsers, FiX } from 'react-icons/fi';

function ScheduleSection({ calendarDays, currentMonth, monthNames, onPrevMonth, onNextMonth, selectedDate, onDateClick, onCloseDateDetails, loading, error, onRetry, userRole, apiData }) {
  // Log the result of getSelectedDateSchedule for debugging
  if (apiData) {
    console.log('apiData:', apiData);
  }

  // Lấy danh sách lớp học trong ngày được chọn
  const getSelectedDateSchedule = () => {
    if (!selectedDate) return [];
    const found = calendarDays.find(day => day.fullDate.toDateString() === selectedDate.toDateString());
    return found && found.scheduleList ? found.scheduleList : [];
  };

  const selectedDateSchedule = getSelectedDateSchedule();

  // userRole: 'student' | 'teacher'
  return (
    <section>      
      <div className="section-header">
        <h2 className="section-title">
          <FiCalendar className="icon" />
          Lịch dạy
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
      ) : (
        <div className="calendar-monthly-container">
          {/* Calendar Header */}
          <div className="calendar-monthly-header">
            <button className="month-nav-btn" onClick={onPrevMonth}>
              <FiChevronLeft />
            </button>
            <h3 className="month-year">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button className="month-nav-btn" onClick={onNextMonth}>
              <FiChevronRight />
            </button>
          </div>
          {/* Days of week header */}
          <div className="calendar-weekdays">
            <div className="weekday">CN</div>
            <div className="weekday">T2</div>
            <div className="weekday">T3</div>
            <div className="weekday">T4</div>
            <div className="weekday">T5</div>
            <div className="weekday">T6</div>
            <div className="weekday">T7</div>
          </div>
          {/* Calendar Grid */}
          <div className="calendar-monthly-grid">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-monthly-day ${day.isCurrentMonth ? 'current-month' : 'other-month'} ${day.isToday ? 'today' : ''} ${day.hasSchedule ? 'has-schedule' : ''} ${selectedDate && selectedDate.toDateString() === day.fullDate.toDateString() ? 'selected' : ''}`}
                onClick={() => onDateClick(day)}
              >
                <span className="day-number" style={{ fontSize: '0.85rem' }}>{day.date}</span>
                {/* Hiển thị danh sách lớp học có lịch học trong ngày này */}
                {day.hasSchedule && day.isCurrentMonth && (
                  <div className="schedule-indicator" style={{flexDirection: 'column', alignItems: 'flex-start', marginTop: '0.5rem'}}>
                    {day.scheduleList.slice(0, 2).map((cls) => (
                      <span key={cls.id} style={{
                        background: '#ffeaea',
                        color: '#b30000',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '2px 6px',
                        marginBottom: '2px',
                        display: 'inline-block',
                        maxWidth: '100%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }} title={cls.class + (cls.time ? ' - ' + cls.time : '')}>
                        {cls.class}{cls.time ? ' (' + cls.time + ')' : ''}
                      </span>
                    ))}
                    {day.scheduleList.length > 2 && (
                      <span className="schedule-count" style={{color:'#b30000',fontWeight:700,fontSize:'0.75rem'}}>+{day.scheduleList.length - 2} lớp nữa</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="selected-date-details">
              <div className="details-header">
                <h4>
                  <FiCalendar className="icon" />
                  {selectedDate.toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h4>
                <button 
                  className="close-details"
                  onClick={onCloseDateDetails}
                >
                  <FiX />
                </button>
              </div>
              <div className="details-content">
                {/* Hiển thị cho học sinh từ scheduleSource - chỉ lọc theo ngày được chọn */}
                {userRole === 'student' && Array.isArray(apiData?.scheduleSource) ? (
                  apiData.scheduleSource.filter(item => {
                    // Lọc theo ngày được chọn
                    const selectedDateKey = selectedDate.toISOString().slice(0, 10);
                    const found = selectedDateSchedule.find(schedule => schedule.id === item.id);
                    return found !== undefined;
                  }).map((item) => (
                    <div key={item.id} className="detail-session">
                      <div className="session-header">
                        <div className="session-class">
                          <FiBook className="icon" />
                          {item.name}
                        </div>
                      </div>
                      <div className="session-details">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.97rem', color: '#333' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiUsers style={{ color: '#1976d2' }} />
                            <span><b>Giáo viên:</b> {item.teacher || item.teacherId?.name || '-'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiFileText style={{ color: '#b30000' }} />
                            <span><b>Trạng thái:</b> {item.status || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}

                {/* Hiển thị cho giáo viên từ classes - chỉ lọc theo ngày được chọn */}
                {userRole === 'teacher' && Array.isArray(apiData?.classes) ? (
                  apiData.classes.filter(item => {
                    // Lọc theo ngày được chọn
                    const selectedDateKey = selectedDate.toISOString().slice(0, 10);
                    const found = selectedDateSchedule.find(schedule => schedule.id === item._id || schedule.id === item.id);
                    return found !== undefined;
                  }).map((item) => (
                    <div key={item._id} className="detail-session">
                      <div className="session-header">
                        <div className="session-class">
                          <FiBook className="icon" />
                          {item.className}
                        </div>
                      </div>
                      <div className="session-details">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.97rem', color: '#333' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiUsers style={{ color: '#1976d2' }} />
                            <span><b>Sĩ số:</b> {item.studentCount ?? '-'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiMapPin style={{ color: '#1976d2' }} />
                            <span><b>Lịch học:</b> {item.schedulePreview || '-'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiFileText style={{ color: '#b30000' }} />
                            <span><b>Trạng thái:</b> {item.isAvailable === true ? 'Đang học' : (item.isAvailable === false ? 'Đã kết thúc' : '-')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default ScheduleSection;
