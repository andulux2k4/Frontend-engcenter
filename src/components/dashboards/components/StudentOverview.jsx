import React from 'react';


import { FaChartPie, FaGraduationCap, FaBookOpen, FaCalendarCheck, FaUserCheck, FaFileAlt, FaCalendarDay, FaChartLine, FaStar, FaMixcloud } from 'react-icons/fa';

function StudentOverview({ stats }) {
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <FaChartPie />
          Tổng quan học tập
        </h2>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '1.5rem',
        padding: '0.5rem 0',
        overflowX: 'auto'
      }}>
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaGraduationCap />
              Khóa học
            </h3>
            <p className="stat" style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              color: '#b30000',
              margin: '1rem 0',
              textAlign: 'center'
            }}>
              <FaBookOpen />
              {stats?.totalCourses ?? 0}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Khóa học đang theo học</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaCalendarCheck />
              Tham gia
            </h3>
            <p className="stat" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaUserCheck />
              {stats?.attendanceRate !== undefined && stats?.attendanceRate !== null 
                ? (typeof stats.attendanceRate === 'string' ? stats.attendanceRate : `${stats.attendanceRate}%`)
                : "Chưa có dữ liệu"}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Tỷ lệ tham gia đầy đủ buổi học</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaCalendarDay />
              Buổi học
            </h3>
            <p className="stat" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaUserCheck />
              {stats?.attendedLessons !== undefined && stats?.attendedLessons !== null 
                ? stats.attendedLessons 
                : "Chưa có dữ liệu"}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Số ngày tham gia</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
        <div className="card" style={{
          minWidth: '200px',
          flex: '1',
          background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)',
          border: '2px solid #ffebee',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
          <div className="card-content">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000' }}>
              <FaCalendarCheck />
              Buổi nghỉ
            </h3>
            <p className="stat" style={{ fontSize: '1.8rem', fontWeight: '700', color: '#b30000', margin: '1rem 0', textAlign: 'center' }}>
              <FaCalendarDay />
              {stats?.absentLessons !== undefined && stats?.absentLessons !== null 
                ? stats.absentLessons 
                : "Chưa có dữ liệu"}
            </p>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', margin: '0' }}>Số ngày không tham gia</p>
          </div>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', backgroundColor: 'rgba(179, 0, 0, 0.1)', borderRadius: '50%', zIndex: 0 }}></div>
        </div>
      </div>
    </section>
  );
}

export default StudentOverview;
