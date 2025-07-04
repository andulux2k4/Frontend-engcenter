import React from 'react';


import { FaStar, FaBook, FaFileAlt, FaComment } from 'react-icons/fa';

function GradeReport({ grades, onViewDetail }) {
  if (!grades || grades.length === 0) {
    return (
      <section>
        <div className="section-header">
          <h2 className="section-title">
            <FaStar /> Báo cáo điểm
          </h2>
        </div>
        <div style={{ padding: '1rem', color: '#888' }}>Chưa có dữ liệu điểm.</div>
      </section>
    );
  }
  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          <FaStar /> Báo cáo điểm
        </h2>
      </div>
      <div className="grade-report-table" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ background: '#fff5f5', color: '#b30000' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ffebee' }}><FaBook /> Khóa học</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ffebee' }}><FaFileAlt /> Bài kiểm tra</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ffebee' }}><FaStar /> Điểm</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ffebee' }}><FaComment /> Nhận xét</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, idx) => (
              <tr key={g.id || idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fff8f8' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #ffebee', fontWeight: 600 }}>{g.course}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ffebee' }}>{g.assessment}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ffebee', color: '#b30000', fontWeight: 700 }}>{g.score}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ffebee' }}>{g.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GradeReport;
