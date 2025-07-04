import React, { useState, useEffect } from 'react';

function SalarySection({ userData, selectedSalaryMonth, setSelectedSalaryMonth, salaryPage, setSalaryPage, salaryPerPage }) {
  const [salaryData, setSalaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy teacherId ưu tiên từ userData prop
  const getTeacherId = () => {
    if (userData && userData.role === 'Teacher' && userData.roleId) {
      return userData.roleId;
    }
    // Thử lấy từ userData localStorage
    try {
      const userDataLS = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userDataLS.role === 'Teacher' && userDataLS.roleId) {
        return userDataLS.roleId;
      }
      if (userDataLS.id) return userDataLS.id;
      if (userDataLS._id) return userDataLS._id;
    } catch (e) {}
    // Thử lấy từ user localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'Teacher' && user.roleId) {
        return user.roleId;
      }
      if (user.id) return user.id;
      if (user._id) return user._id;
    } catch (e) {}
    // Thử lấy trực tiếp từ teacherId
    const teacherId = localStorage.getItem('teacherId');
    if (teacherId) return teacherId;
    return null;
  };

  // Fetch dữ liệu từ API
  const fetchSalaryData = async () => {
    console.log('🔄 Bắt đầu fetch salary data...');
    setLoading(true);
    setError(null);
    try {
      const teacherId = getTeacherId();
      console.log('👤 teacherId:', teacherId);
      console.log('👤 userData prop:', userData);
      if (!teacherId) {
        const errorMsg = 'Không tìm thấy teacherId';
        console.error('❌ Lỗi:', errorMsg);
        throw new Error(errorMsg);
      }
      const token = localStorage.getItem('token') || userData?.token;
      const url = `https://english-center-website.onrender.com/v1/api/teacher-wages/teacher/my-wages`;
      console.log('🌐 Calling API:', url);
      console.log('🔑 Token:', token);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('📊 API response data:', data);
      if (data && data.data) {
        // Map dữ liệu từ API response sang format component cần
        const mappedData = data.data.map(item => ({
          key: item._id,
          month: item.month,
          year: item.year,
          soBuoiDay: item.lessonTaught || 0,
          luongMoiBuoi: item.teacherId?.wagePerLesson || 0,
          daNhan: item.calculatedAmount || 0,
          conLai: item.remainingAmount || 0,
          paymentStatus: item.paymentStatus,
          className: item.classId?.className || 'N/A'
        }));
        console.log('🔄 Mapped data:', mappedData);
        setSalaryData(mappedData);
      } else {
        setSalaryData([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('🎯 SalarySection component mounted');
    console.log('📊 userData received:', userData);
    fetchSalaryData();
  }, [selectedSalaryMonth, salaryPage, salaryPerPage]);

  const filteredSalary = salaryData.filter(row => {
    const monthMatch = selectedSalaryMonth.month === 'all' || row.month?.toString() === selectedSalaryMonth.month;
    const yearMatch = selectedSalaryMonth.year === 'all' || row.year?.toString() === selectedSalaryMonth.year;
    return monthMatch && yearMatch;
  });
  console.log('🔎 selectedSalaryMonth:', selectedSalaryMonth);
  console.log('📋 Filtered salary:', filteredSalary);

  const paginatedSalary = filteredSalary.slice(
    (salaryPage - 1) * salaryPerPage, 
    salaryPage * salaryPerPage
  );

  const totalSalaryPages = Math.ceil(filteredSalary.length/salaryPerPage) || 1;

  return (
    <section>
      <div className="section-header">
        <h2 className="section-title">
          Lương của tôi
        </h2>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <select value={selectedSalaryMonth.month} onChange={e => {setSelectedSalaryMonth(s => ({...s, month: e.target.value})); setSalaryPage(1);}} style={{padding:'0.3rem 0.7rem',borderRadius:6,border:'1px solid #ccc'}}>
            <option value="all">Toàn bộ tháng</option>
            {Array.from({length:12},(_,i)=>(<option key={i+1} value={i+1}>Tháng {i+1}</option>))}
          </select>
          <select value={selectedSalaryMonth.year} onChange={e => {setSelectedSalaryMonth(s => ({...s, year: e.target.value})); setSalaryPage(1);}} style={{padding:'0.3rem 0.7rem',borderRadius:6,border:'1px solid #ccc'}}>
            <option value="all">Toàn bộ năm</option>
            {Array.from({length:5},(_,i)=>{
              const year = new Date().getFullYear() - 2 + i;
              return <option key={year} value={year}>{year}</option>
            })}
          </select>
          <button onClick={fetchSalaryData} disabled={loading} style={{padding:'0.3rem 0.7rem',borderRadius:6,border:'1px solid #ccc',background:'#f8f9fa'}}>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{background:'#fee2e2',color:'#dc2626',padding:'1rem',borderRadius:8,margin:'1rem 0'}}>
          Lỗi: {error}
        </div>
      )}

      <div className="table-container" style={{borderRadius:12,boxShadow:'0 2px 8px #b3000022',background:'#fff',padding:'1.5rem',margin:'2rem auto',maxWidth:'100%',minWidth:900,overflowX:'auto'}}>
        {loading && (
          <div style={{textAlign:'center',padding:'2rem',color:'#666'}}>
            Đang tải dữ liệu lương...
          </div>
        )}
        
        <table className="data-table" style={{width:'100%',minWidth:900,borderCollapse:'separate',borderSpacing:0,background:'#fff',borderRadius:12,overflow:'hidden'}}>
          <thead>
            <tr style={{background:'linear-gradient(90deg,#b30000 60%,#ffb3b3 100%)',color:'white',fontWeight:700}}>
              <th style={{padding:'1rem',textAlign:'center',fontSize:'1rem',letterSpacing:1,borderTopLeftRadius:12}}>Tháng/Năm</th>
              <th style={{textAlign:'center'}}>Lớp</th>
              <th style={{textAlign:'center'}}>Số buổi đã dạy</th>
              <th style={{textAlign:'center'}}>Lương/buổi</th>
              <th style={{textAlign:'center'}}>Đã nhận</th>
              <th style={{textAlign:'center'}}>Còn lại</th>
              <th style={{textAlign:'center',borderTopRightRadius:12,width:120}}>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSalary.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:'2rem',color:'#b30000',fontWeight:500}}>
                {loading ? 'Đang tải...' : error ? 'Có lỗi xảy ra' : 'Không có dữ liệu lương cho tháng này.'}
              </td></tr>
            ) : paginatedSalary.map(row => {
              let status = (row.conLai || 0) === 0 ? 'Trả hết' : (row.daNhan || 0) > 0 ? 'Còn thiếu' : 'Chưa trả';
              let badgeStyle = {
                backgroundColor: status === 'Trả hết' ? '#dcfce7' : status === 'Còn thiếu' ? '#fef3c7' : '#ffeaea',
                color: status === 'Trả hết' ? '#166534' : status === 'Còn thiếu' ? '#92400e' : '#b30000',
                border: status === 'Trả hết' ? '1px solid #16a34a' : status === 'Còn thiếu' ? '1px solid #f59e42' : '1px solid #b30000',
                fontWeight: 600,
                borderRadius: 8,
                padding: '2px 12px',
                display: 'inline-block',
                fontSize: '0.95em',
                minWidth: 0,
                maxWidth: '100%',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              };
              return (
                <tr key={row.key} style={{background:'#fff',transition:'background 0.2s',borderBottom:'1px solid #ffeaea',cursor:'pointer',height:48}} onMouseOver={e=>e.currentTarget.style.background='#fff5f5'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                  <td style={{textAlign:'center',fontWeight:600,color:'#b30000'}}>{String(row.month).padStart(2,'0')}/{row.year}</td>
                  <td style={{textAlign:'center'}}>{row.className}</td>
                  <td style={{textAlign:'center'}}>{row.soBuoiDay || 0}</td>
                  <td style={{textAlign:'center'}}>{(row.luongMoiBuoi || 0).toLocaleString('vi-VN')}đ</td>
                  <td style={{textAlign:'center'}}>{(row.daNhan || 0).toLocaleString('vi-VN')}đ</td>
                  <td style={{textAlign:'center'}}>{(row.conLai || 0).toLocaleString('vi-VN')}đ</td>
                  <td style={{textAlign:'center',width:120}}><span className={`status-badge ${status === 'Trả hết' ? 'success' : status === 'Còn thiếu' ? 'warning' : ''}`} style={badgeStyle}>{status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Pagination */}
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
          <button className="btn btn-secondary" onClick={()=>setSalaryPage(p=>Math.max(1,p-1))} disabled={salaryPage===1 || loading} style={{minWidth:90}}>Trước</button>
          <span style={{fontWeight:500}}>Trang {salaryPage}/{totalSalaryPages}</span>
          <button className="btn btn-secondary" onClick={()=>setSalaryPage(p=>Math.min(totalSalaryPages,p+1))} disabled={salaryPage===totalSalaryPages || loading} style={{minWidth:90}}>Sau</button>
        </div>
      </div>
    </section>
  );
}

export default SalarySection;

