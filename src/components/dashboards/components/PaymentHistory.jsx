import React, { useState, useMemo } from "react";
import { FaMoneyBillWave, FaUser, FaBook, FaDollarSign, FaCalendar, FaInfoCircle, FaCreditCard, FaSearch, FaFilter } from "react-icons/fa";

function PaymentHistory({ payments, currentPage, itemsPerPage, onPageChange, onOpenPaymentModal }) {
  const [nameFilter, setNameFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Filter payments based on name and month/year
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesName = !nameFilter || 
        (payment.childName || payment.child || '').toLowerCase().includes(nameFilter.toLowerCase()) ||
        (payment.className || payment.course || '').toLowerCase().includes(nameFilter.toLowerCase());
      
      const matchesMonth = !monthFilter || payment.month?.toString() === monthFilter;
      const matchesYear = !yearFilter || payment.year?.toString() === yearFilter;
      
      return matchesName && matchesMonth && matchesYear;
    });
  }, [payments, nameFilter, monthFilter, yearFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Generate month and year options
  const monthOptions = [
    { value: '', label: 'Tất cả tháng' },
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' }
  ];

  const yearOptions = [
    { value: '', label: 'Tất cả năm' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' }
  ];

  // Reset to first page when filters change
  const handleFilterChange = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handleNameFilterChange = (value) => {
    setNameFilter(value);
    handleFilterChange();
  };

  const handleMonthFilterChange = (value) => {
    setMonthFilter(value);
    handleFilterChange();
  };

  const handleYearFilterChange = (value) => {
    setYearFilter(value);
    handleFilterChange();
  };

  const clearFilters = () => {
    setNameFilter('');
    setMonthFilter('');
    setYearFilter('');
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  return (
    <section>
      <div className="parent-section-header">
        <h2 className="parent-section-title">
          <FaMoneyBillWave />
          Quản lý học phí
        </h2>
      </div>
      
      {/* Filter Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
        borderRadius: 12, 
        padding: '1.5rem', 
        marginBottom: '2rem',
        border: '1px solid #e9ecef'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <FaFilter style={{ color: '#b30000', fontSize: '1.2rem' }} />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#2d3748' }}>
            Bộ lọc tìm kiếm
          </h3>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          alignItems: 'end'
        }}>
          {/* Name Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: '#4a5568' 
            }}>
              <FaSearch style={{ marginRight: '0.5rem', color: '#b30000' }} />
              Tìm theo tên học sinh/lớp
            </label>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => handleNameFilterChange(e.target.value)}
              placeholder="Nhập tên học sinh hoặc tên lớp..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#b30000'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Month Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: '#4a5568' 
            }}>
              <FaCalendar style={{ marginRight: '0.5rem', color: '#b30000' }} />
              Tháng
            </label>
            <select
              value={monthFilter}
              onChange={(e) => handleMonthFilterChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              color: '#4a5568' 
            }}>
              <FaCalendar style={{ marginRight: '0.5rem', color: '#b30000' }} />
              Năm
            </label>
            <select
              value={yearFilter}
              onChange={(e) => handleYearFilterChange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          <div>
            <button
              onClick={clearFilters}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              <FaFilter />
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: 'rgba(179, 0, 0, 0.1)', 
          borderRadius: 8,
          border: '1px solid rgba(179, 0, 0, 0.2)'
        }}>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: '#b30000', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FaInfoCircle />
            Hiển thị {filteredPayments.length} trong tổng số {payments.length} bản ghi
            {(nameFilter || monthFilter || yearFilter) && (
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                (đã lọc)
              </span>
            )}
          </p>
        </div>
      </div>
      
      {/* No Results Message */}
      {filteredPayments.length === 0 && payments.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem 1rem', 
          background: 'linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)', 
          borderRadius: 12,
          border: '1px solid #feb2b2',
          marginBottom: '2rem'
        }}>
          <FaSearch style={{ fontSize: '3rem', color: '#b30000', marginBottom: '1rem', opacity: 0.6 }} />
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#b30000', fontSize: '1.2rem' }}>
            Không tìm thấy kết quả
          </h3>
          <p style={{ margin: 0, color: '#c53030', fontSize: '0.9rem' }}>
            Không có bản ghi nào phù hợp với bộ lọc hiện tại. Vui lòng thử lại với tiêu chí khác.
          </p>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', padding: '0.5rem 0', overflowX: 'auto', marginBottom: '2rem' }}>
        {currentItems.map(payment => (
          <div key={payment.id || payment._id} className="parent-card" style={{ minWidth: '300px', flex: '1', background: 'linear-gradient(135deg, #fff 0%, #fff5f5 100%)', border: '2px solid #ffebee', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'pointer' }}>
            <div className="card-content">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b30000', marginBottom: '1rem' }}>
                <FaUser />
                {payment.childName || payment.child || '-'}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaBook style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Lớp:</span>
                  <span>{payment.className || payment.course || '-'}</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaDollarSign style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Số tiền:</span>
                  <span>{payment.amountDue || payment.amount || payment.unpaidAmount || 0} VNĐ</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendar style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Tháng/Năm:</span>
                  <span>{payment.month && payment.year ? `${payment.month}/${payment.year}` : payment.dueDate || '-'}</span>
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaBook style={{ color: '#b30000', minWidth: '16px' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Số buổi:</span>
                  <span>{payment.totalLessons || '-'}</span>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <FaInfoCircle style={{ color: '#b30000' }} />
                  <span style={{ fontWeight: '600', minWidth: '80px' }}>Trạng thái:</span>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: payment.status === 'Đã thanh toán' ? '#d4edda' : '#fff3cd', color: payment.status === 'Đã thanh toán' ? '#155724' : '#856404', border: payment.status === 'Đã thanh toán' ? '1px solid #c3e6cb' : '1px solid #ffeaa7' }}>{payment.status || 'Chưa xác thực'}</span>
                </div>
              </div>
            </div>
            <div className="action-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1rem', borderTop: '1px solid #ffebee' }}>
              <button className="btn btn-secondary" style={{ backgroundColor: 'white', border: '1px solid #0066cc', padding: '0.5rem 1rem', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.3s ease' }} onClick={() => onOpenPaymentModal(payment)} disabled={payment.status === 'Chờ xác nhận' || payment.status === 'Đã thanh toán'}>
                <FaCreditCard />
                <span>Thanh toán</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{ padding: '0.5rem 1rem', border: '1px solid #b30000', backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white', color: currentPage === 1 ? '#999' : '#b30000', borderRadius: '5px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}>Trước</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
            <button key={pageNumber} onClick={() => onPageChange(pageNumber)} style={{ padding: '0.5rem 1rem', border: '1px solid #b30000', backgroundColor: currentPage === pageNumber ? '#b30000' : 'white', color: currentPage === pageNumber ? 'white' : '#b30000', borderRadius: '5px', cursor: 'pointer', transition: 'all 0.3s ease' }}>{pageNumber}</button>
          ))}
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: '0.5rem 1rem', border: '1px solid #b30000', backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white', color: currentPage === totalPages ? '#999' : '#b30000', borderRadius: '5px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}>Sau</button>
        </div>
      )}
    </section>
  );
}

export default PaymentHistory;
