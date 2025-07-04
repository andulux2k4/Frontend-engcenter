import React, { useState, useEffect } from 'react';
import '../../styles/dashboard/parent.css';
import ParentBurgerIcon from '../common/ParentBurgerIcon';
import qrImage from '../../assets/QR_CODE.png';
import ParentOverview from './components/ParentOverview';
import ChildrenList from './components/ChildrenList';
import PaymentHistory from './components/PaymentHistory';
import PaymentDetailModal from './components/modals/PaymentDetailModal';
import { FaUserFriends, FaChartLine, FaChild, FaMoneyBillWave } from 'react-icons/fa';
import { FiUser, FiHome, FiLogOut } from 'react-icons/fi';
import { MdNotifications } from 'react-icons/md';
import apiService from '../../services/api';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './components/modals/ProfileModal';
import NotificationModal from './components/modals/NotificationModal';

function ParentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  // State cho tổng quan lấy từ API
  const [overviewStats, setOverviewStats] = useState({
    totalChildren: 0,
    totalCourses: 0,
    nextPayment: '',
    totalFees: 0
  });
  // ... giữ lại các state khác nếu cần ...


  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  // const [verificationImage, setVerificationImage] = useState(null); // Đã comment vì không dùng trực tiếp
  const [verificationPreview, setVerificationPreview] = useState(null);
  const [payments, setPayments] = useState([]);
  // State để lưu danh sách children lấy từ API
  const [childrenList, setChildrenList] = useState([]);
  // State để lưu danh sách payments chưa đóng lấy từ API
  const [unpaidPayments, setUnpaidPayments] = useState([]);
  // State để loading khi gửi payment request
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('User info:', user);
    console.log('User token:', user?.token);
    console.log('apiService token:', apiService.getToken());
  }, [user]);

  // Reset lại trang và payments khi chuyển tab
  useEffect(() => {
    if (activeTab === 'payments') {
      setCurrentPage(1);
      // Có thể fetch lại payments từ API nếu muốn, hiện tại không cần đồng bộ với mockData
    }
  }, [activeTab]);

  useEffect(() => {
    if (user && user.roleId) {
      const token = apiService.getToken && apiService.getToken();
      
      console.log('=== PARENT CHILDREN DETAILS API CALL ===');
      console.log('User:', user);
      console.log('User roleId:', user.roleId);
      console.log('Token:', token);
      console.log('API URL 1:', `https://english-center-website.onrender.com/v1/api/parents/${user.roleId}/children-details`);
      console.log('API URL 2:', `https://english-center-website.onrender.com/v1/api/parents/my-children-details`);
      
      // 1. Test endpoint với parentId
      apiService.getParentChildrenDetails(token, user.roleId).then(res => {
        console.log('=== CHILDREN DETAILS API RESPONSE (with parentId) ===');
        console.log('Full response:', res);
        console.log('Response data:', res?.data);
        console.log('Response status:', res?.status);
        console.log('Response headers:', res?.headers);
        
        // Lấy tổng số học sinh (student) từ mảng data trả về
        const childrenData = res?.data || [];
        console.log('Children data array:', childrenData);
        console.log('Number of children:', childrenData.length);
        
        setChildrenList(childrenData); // Lưu children vào state để truyền cho ChildrenList
        const totalStudents = childrenData.length;
        console.log('Total students:', totalStudents);
        
        // Nếu muốn lấy tổng số lớp học từ attendanceSummary của từng học sinh:
        let totalClasses = 0;
        childrenData.forEach((child, index) => {
          console.log(`Child ${index + 1}:`, child);
          if (child.attendanceSummary && typeof child.attendanceSummary.totalClasses === 'number') {
            totalClasses += child.attendanceSummary.totalClasses;
            console.log(`Child ${index + 1} attendance summary:`, child.attendanceSummary);
          }
        });
        console.log('Total classes calculated:', totalClasses);

        setOverviewStats(prev => ({
          ...prev,
          totalChildren: totalStudents,
          totalCourses: totalClasses
        }));
        
        console.log('=== CHILDREN DETAILS API CALL COMPLETED (with parentId) ===');
      }).catch(err => {
        console.error('=== CHILDREN DETAILS API ERROR (with parentId) ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Error response:', err.response);
        console.error('Error response data:', err.response?.data);
        console.error('Error response status:', err.response?.status);
        console.error('Error response headers:', err.response?.headers);
        console.error('API /v1/api/parents/:parentId/children-details error', err);
      });

      // 2. Test endpoint my-children-details
      console.log('=== MY CHILDREN DETAILS API CALL ===');
      apiService.getMyChildrenDetails(token).then(res => {
        console.log('=== MY CHILDREN DETAILS API RESPONSE ===');
        console.log('Full response:', res);
        console.log('Response data:', res?.data);
        console.log('Response status:', res?.status);
        console.log('Response headers:', res?.headers);
        
        const myChildrenData = res?.data || [];
        console.log('My children data array:', myChildrenData);
        console.log('Number of my children:', myChildrenData.length);
        
        console.log('=== MY CHILDREN DETAILS API CALL COMPLETED ===');
      }).catch(err => {
        console.error('=== MY CHILDREN DETAILS API ERROR ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Error response:', err.response);
        console.error('Error response data:', err.response?.data);
        console.error('Error response status:', err.response?.status);
        console.error('Error response headers:', err.response?.headers);
        console.error('API /v1/api/parents/my-children-details error', err);
      });
      
      // 3. Unpaid payments
      console.log('=== UNPAID PAYMENTS API CALL ===');
      console.log('Calling unpaid payments API...');
      
      apiService.getUnpaidPayments(token, user.roleId).then(res => {
        console.log('=== UNPAID PAYMENTS API RESPONSE ===');
        console.log('Full response:', res);
        console.log('Response data:', res?.data);
        
        // Lấy hạn thanh toán và tổng học phí chưa đóng từ dữ liệu trả về
        const data = res?.data || {};
        let nextPayment = '';
        let totalFees = 0;
        let allUnpaid = [];
        // Lấy unpaid payments của từng học sinh
        if (Array.isArray(data.children) && data.children.length > 0) {
          data.children.forEach(child => {
            if (Array.isArray(child.unpaidPayments)) {
              allUnpaid = allUnpaid.concat(child.unpaidPayments.map(p => ({...p, childName: child.name})));
            }
          });
          if (allUnpaid.length > 0) {
            allUnpaid.sort((a, b) => (b.year - a.year) || (b.month - a.month));
            nextPayment = `${allUnpaid[0].month}/${allUnpaid[0].year}`;
          }
        }
        // Lưu danh sách unpaid payments vào state
        setUnpaidPayments(allUnpaid);
        // Lấy tổng học phí chưa đóng
        totalFees = data.totalUnpaidAmount || 0;
        setOverviewStats(prev => ({
          ...prev,
          nextPayment,
          totalFees
        }));
        
        console.log('=== UNPAID PAYMENTS API CALL COMPLETED ===');
      }).catch(err => {
        console.error('=== UNPAID PAYMENTS API ERROR ===');
        console.error('Error object:', err);
        console.error('Error message:', err.message);
        console.error('Error response:', err.response);
        console.error('API /v1/api/parents/:parentId/unpaid-payments error', err);
      });
    }
  }, [user]);

  // Lấy thông báo mới nhất khi load dashboard
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const token = apiService.getToken();
        const res = await apiService.getNotificationsForRole(token); // Lấy thông báo theo vai trò
        if (res && res.data && Array.isArray(res.data)) {
          setNotifications(res.data);
        } else if (res && res.notifications && Array.isArray(res.notifications)) {
          setNotifications(res.notifications);
        } else {
          setNotifications([]);
        }
      } catch (e) {
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  const renderHeader = () => (
    <header className="parent-header">
      <h1>
        <FaUserFriends />
        Phụ huynh
      </h1>
      <div className="parent-info">
        <span> Xin chào, {user?.name}</span>
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className="sidebar">
      <nav className="nav-menu">
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartLine style={{marginRight: 8}} /> Tổng quan
        </button>
        <button 
          className={`nav-item ${activeTab === 'children' ? 'active' : ''}`}
          onClick={() => setActiveTab('children')}
        >
          <FaChild style={{marginRight: 8}} /> Con em
        </button>
        <button 
          className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <FaMoneyBillWave style={{marginRight: 8}} /> Học phí
        </button>
      </nav>
      
      {/* Navigation menu ở góc dưới sidebar */}
      <div className="sidebar-bottom-nav">
      <button 
          className="nav-item"
          onClick={() => setShowProfileModal(true)}
        >
          <FiUser className="icon" />
          Hồ sơ
        </button>
        <button
          className="nav-item"
          style={{ position: 'relative' }}
          onClick={() => setShowNotificationModal(true)}
        >
          <MdNotifications className="icon" />
          Thông báo
          {notifications.length > 0 && (
            <span style={{
              position: 'absolute',
              top: 8,
              right: 12,
              background: '#b30000',
              color: 'white',
              borderRadius: '50%',
              fontSize: '0.8rem',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>{notifications.length}</span>
          )}
        </button>
        
        <button 
          className="nav-item"
          onClick={() => navigate('/')}
        >
          <FiHome className="icon" />
          Trang chủ
        </button>
        <button 
          className="nav-item"
          onClick={() => onLogout()}
        >
          <FiLogOut className="icon" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );

  const handleOpenPaymentModal = (payment) => {
    console.log('Open payment modal for:', payment);
    console.log('Payment ID:', payment._id || payment.id);
    setSelectedPayment(payment);
    // Ưu tiên lấy amount, amountDue, unpaidAmount, hoặc 0
    setPaymentAmount(
      payment.amount || payment.amountDue || payment.unpaidAmount || ''
    );
    setShowPaymentModal(true);
    setVerificationPreview(null);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentAmount('');
    // setVerificationImage(null); // Đã loại bỏ biến không dùng
    setVerificationPreview(null);
  };

  const handleVerificationImageChange = (e) => {
    const file = e.target.files[0];
    // setVerificationImage(file); // Đã loại bỏ biến không dùng
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVerificationPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVerificationPreview(null);
    }
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    console.log('Confirming payment for:', selectedPayment);
    
    if (!selectedPayment) {
      alert('Không có thông tin thanh toán được chọn!');
      return;
    }

    setIsSubmittingPayment(true);

    try {
      // Sử dụng apiService để lấy token
      const token = apiService.getToken() || user?.token;
      console.log('Token sources:', {
        apiServiceToken: apiService.getToken(),
        userToken: user?.token
      });
      
      if (!token) {
        console.error('No token found');
        alert('Vui lòng đăng nhập lại!');
        return;
      }

      // Chuẩn bị dữ liệu cho API theo format multipart/form-data
      const formData = new FormData();
      formData.append('paymentId', selectedPayment._id);
      formData.append('amount', (parseInt(paymentAmount) || selectedPayment.amount || selectedPayment.amountDue || selectedPayment.unpaidAmount).toString());

      const amount = parseInt(paymentAmount) || selectedPayment.amount || selectedPayment.amountDue || selectedPayment.unpaidAmount;
      
      console.log('Sending payment request:', {
        paymentId: selectedPayment._id,
        amount: amount,
        selectedPayment: selectedPayment
      });
      
      const parentId = user?.roleId;
      const requestUrl = `https://english-center-website.onrender.com/v1/api/parents/${parentId}/payment-request`;
      
      console.log('Request URL:', requestUrl);
      console.log('Parent ID:', parentId);
      console.log('Request method: POST with FormData');
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Gọi API tạo yêu cầu thanh toán
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Không set Content-Type, để browser tự động set cho FormData
        },
        body: formData,
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment API error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        throw new Error(`Lỗi API: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Payment API success:', result);

      // Cập nhật trạng thái local sau khi API thành công
      setUnpaidPayments(prev => {
        const updated = prev.map(p => {
          const match = (p._id && selectedPayment._id && p._id === selectedPayment._id)
            || (p.id && selectedPayment.id && p.id === selectedPayment.id);
          
          if (match) {
            console.log('Updating payment status for:', p);
            return { ...p, status: 'Chờ xác thực' };
          }
          return p;
        });
        return updated;
      });

      alert('Đã gửi yêu cầu thanh toán thành công! Vui lòng chờ xác nhận từ admin.');
      handleClosePaymentModal();

    } catch (error) {
      console.error('Payment confirmation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Lỗi khi gửi yêu cầu thanh toán: ${error.message || 'Lỗi không xác định'}`);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ParentOverview stats={overviewStats} />;
      case 'children':
        return <ChildrenList children={childrenList} currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} />;
      case 'payments':
        return <PaymentHistory payments={unpaidPayments} currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChange={handlePageChange} onOpenPaymentModal={handleOpenPaymentModal} />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard parent-dashboard">
      {renderHeader()}
      <div className="dashboard-content" style={{margin:0}}>
        {renderSidebar()}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
      <PaymentDetailModal
        show={showPaymentModal}
        onClose={handleClosePaymentModal}
        payment={{ ...selectedPayment, qrImage }}
        paymentAmount={paymentAmount}
        onAmountChange={e => setPaymentAmount(e.target.value)}
        onImageChange={handleVerificationImageChange}
        verificationPreview={verificationPreview}
        onSubmit={handleConfirmPayment}
        isSubmitting={isSubmittingPayment}
      />
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <PaymentDetailModal
              show={showPaymentModal}
              onClose={handleClosePaymentModal}
              payment={{ ...selectedPayment, qrImage }}
              paymentAmount={paymentAmount}
              onAmountChange={e => setPaymentAmount(e.target.value)}
              onImageChange={handleVerificationImageChange}
              verificationPreview={verificationPreview}
              onSubmit={handleConfirmPayment}
              isSubmitting={isSubmittingPayment}
            />
          </div>
        </div>
      )}
      
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal user={user} onClose={() => setShowProfileModal(false)} />
      )}

      {/* Notification Modal */}
      <NotificationModal 
        isOpen={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)} 
        user={user}
      />
    </div>
  );
}

export default ParentDashboard;