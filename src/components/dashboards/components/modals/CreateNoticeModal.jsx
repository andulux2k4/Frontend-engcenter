import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import styles from './AttendanceModal.module.css';

function CreateNoticeModal({ classData, onClose }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRole: 'Student',
    type: 'General',
    method: 'web',
    classId: classData.id || classData._id || ''
  });
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  // Debug classData
  console.log('CreateNoticeModal - classData:', classData);
  console.log('CreateNoticeModal - classId:', classData.id || classData._id);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setMessage('');
    
    try {
      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('=== Gửi thông báo ===');
      console.log('Form data:', form);
      console.log('Token:', token ? `Có token: ${token.substring(0, 20)}...` : 'Không có token');
      
      const requestBody = JSON.stringify(form);
      console.log('Request body:', requestBody);
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      console.log('Headers:', headers);
      
      const response = await fetch('https://english-center-website.onrender.com/v1/api/notifications', {
        method: 'POST',
        headers: headers,
        body: requestBody
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.log('Không thể parse response JSON:', parseError);
        const responseText = await response.text();
        console.log('Response text:', responseText);
        responseData = { message: 'Lỗi server không trả về JSON hợp lệ' };
      }

      if (response.ok) {
        console.log('✅ Gửi thông báo thành công!');
        setMessage('Gửi thông báo thành công!');
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 1000);
      } else {
        console.log('❌ Lỗi gửi thông báo:', responseData);
        setMessage(`Lỗi ${response.status}: ${responseData.message || 'Không thể gửi thông báo'}`);
      }
    } catch (error) {
      console.error('💥 Error sending notification:', error);
      setMessage('Lỗi kết nối! Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal']} style={{ maxWidth: 420 }}>
        <button className={styles['modal-close']} onClick={onClose}><FiX /></button>
        <h2 style={{ textAlign: 'center', marginBottom: 18 , marginTop: 10 }}>Tạo thông báo</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Nội dung</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Đối tượng</label>
            <select name="targetRole" value={form.targetRole} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}>
              <option value="Student">Học sinh</option>
              <option value="Teacher">Giảng viên</option>
              <option value="Parent">Phụ huynh</option>
              <option value="All">Tất cả</option>
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Loại thông báo</label>
            <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}>
              <option value="General">Chung</option>
              <option value="Event">Sự kiện</option>
            </select>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label>Phương thức</label>
            <select name="method" value={form.method} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}>
              <option value="web">Web</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%' }}>
            {sending ? 'Đang gửi...' : 'Gửi thông báo'}
          </button>
          {message && (
            <div style={{ 
              textAlign: 'center', 
              color: message.includes('Lỗi') ? '#e74c3c' : '#0984e3', 
              marginTop: 10 
            }}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateNoticeModal; 