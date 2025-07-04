import React, { useEffect, useState } from 'react';
import apiService from '../../../../services/api';
import './NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      // Try multiple token sources
      let token = apiService.getToken();
      if (!token) {
        token = localStorage.getItem('token');
      }
      if (!token) {
        token = localStorage.getItem('authToken');
      }
      
      console.log('NotificationModal - Token sources:', {
        apiServiceToken: apiService.getToken() ? 'exists' : 'none',
        localStorageToken: localStorage.getItem('token') ? 'exists' : 'none',
        localStorageAuthToken: localStorage.getItem('authToken') ? 'exists' : 'none',
        finalToken: token ? 'exists' : 'none'
      });
      
      if (!token) {
        setError('Vui lòng đăng nhập lại để xem thông báo.');
        return;
      }
      
      // Try to call API with the token
      let response;
      try {
        // Check user role to determine which endpoint to use
        const userRole = user?.role;
        if (userRole === 'Admin') {
          // Admin users should use my-notifications endpoint
          response = await apiService.getMyNotifications(token);
        } else {
          // Other roles use for-role endpoint
          response = await apiService.getNotificationsForRole(token);
        }
        console.log('NotificationModal - API Response:', response);
        setNotifications(response.data || response.notifications || []);
      } catch (apiError) {
        console.log('First token failed, trying alternative token...');
        // If first token fails, try with user token from props if available
        const userToken = user?.token;
        if (userToken && userToken !== token) {
          try {
            const userRole = user?.role;
            if (userRole === 'Admin') {
              response = await apiService.getMyNotifications(userToken);
            } else {
              response = await apiService.getNotificationsForRole(userToken);
            }
            console.log('NotificationModal - API Response with user token:', response);
            setNotifications(response.data || response.notifications || []);
          } catch (secondError) {
            // If both tokens fail, try direct API call
            console.log('Both tokens failed, trying direct API call...');
            try {
              const directResponse = await fetch('https://english-center-website.onrender.com/v1/api/notifications/for-role', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (!directResponse.ok) {
                throw new Error(`Direct API call failed: ${directResponse.status}`);
              }
              
              const directData = await directResponse.json();
              console.log('NotificationModal - Direct API Response:', directData);
              setNotifications(directData.data || directData.notifications || []);
            } catch (directError) {
              throw apiError; // Throw original error
            }
          }
        } else {
          throw apiError;
        }
      }
          } catch (err) {
        console.error('Error fetching notifications:', err);
        if (err.message.includes('403') || err.message.includes('Invalid token')) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải thông báo. Vui lòng thử lại.');
          // Show sample notifications for demo purposes
          setNotifications([
            {
              _id: 'demo1',
              title: 'Thông báo mẫu',
              content: 'Đây là thông báo mẫu để hiển thị giao diện. API thông báo hiện tại đang gặp sự cố.',
              type: 'General',
              createdAt: new Date().toISOString()
            },
            {
              _id: 'demo2',
              title: 'Lịch học tuần tới',
              content: 'Lớp học sẽ diễn ra bình thường vào tuần tới. Vui lòng chuẩn bị bài vở đầy đủ.',
              type: 'Schedule',
              createdAt: new Date(Date.now() - 86400000).toISOString()
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="notification-modal-header">
          <h2>Thông báo</h2>
          <button className="notification-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="notification-modal-body">
          {loading && (
            <div className="notification-loading">
              <p>Đang tải thông báo...</p>
            </div>
          )}

          {error && (
            <div className="notification-error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="notification-empty">
              <p>Không có thông báo nào</p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification._id} className="notification-item">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className="notification-date">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                  <div className="notification-content">
                    {notification.content}
                  </div>
                  {notification.type && (
                    <div className="notification-type">
                      <span className={`notification-badge notification-${notification.type.toLowerCase()}`}>
                        {notification.type}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal; 