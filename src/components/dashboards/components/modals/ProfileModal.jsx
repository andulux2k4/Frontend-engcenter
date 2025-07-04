import { FiUser, FiX, FiLock, FiEye, FiEyeOff, FiEdit3, FiSave } from 'react-icons/fi';
import { useState } from 'react';
import apiService from '../../../../services/api';

function ProfileModal({ user, onClose }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form data for editing profile
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    gender: user?.gender || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      // Chỉ gửi những trường có thay đổi
      const originalData = {
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
        gender: user?.gender || ''
      };

      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          // Đảm bảo không gửi giá trị null hoặc undefined
          changedFields[key] = formData[key] || '';
        }
      });
      
      // Thêm validation cơ bản
      if (changedFields.name && changedFields.name.trim().length < 2) {
        return { success: false, message: 'Tên phải có ít nhất 2 ký tự' };
      }
      
      if (changedFields.email && !changedFields.email.includes('@')) {
        return { success: false, message: 'Email không hợp lệ' };
      }
      
      if (changedFields.phoneNumber && changedFields.phoneNumber.length < 10) {
        return { success: false, message: 'Số điện thoại phải có ít nhất 10 số' };
      }

      // Kiểm tra xem có trường nào thay đổi không
      if (Object.keys(changedFields).length === 0) {
        return { success: false, message: 'Không có thông tin nào thay đổi' };
      }

      console.log('🔄 Updating profile with changed fields:', changedFields);
      console.log('🔑 Token being used:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('👤 Original user data:', originalData);
      console.log('📝 Current form data:', formData);
      
      // Test connection first
      try {
        console.log('🔗 Testing API connection...');
        const testResponse = await apiService.getProfile(token);
        console.log('✅ API connection test successful:', testResponse);
      } catch (testError) {
        console.log('❌ API connection test failed:', testError);
        return { success: false, message: `Lỗi kết nối: ${testError.message}` };
      }
      
      const response = await apiService.updateProfile(token, changedFields);
      console.log('📥 Update profile response:', response);
      
      // API trả về {msg: '...', data: {...}} thay vì {success: true/false}
      if (response.msg && response.msg.includes('thành công')) {
        const fieldNames = {
          name: 'Họ và tên',
          email: 'Email',
          phoneNumber: 'Số điện thoại',
          address: 'Địa chỉ',
          gender: 'Giới tính'
        };
        
        const updatedFields = Object.keys(changedFields).map(key => fieldNames[key]).join(', ');
        return { success: true, message: `Cập nhật ${updatedFields}` };
      } else {
        return { success: false, message: response.msg || response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ' };
      }
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return { success: false, message: error.message || 'Có lỗi xảy ra khi cập nhật hồ sơ' };
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, message: 'Vui lòng điền đầy đủ thông tin' };
    }
    
    if (newPassword !== confirmPassword) {
      return { success: false, message: 'Mật khẩu mới không khớp' };
    }
    
    if (newPassword.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
    }
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }

      console.log('🔐 Changing password...');
      const response = await apiService.changePassword(token, currentPassword, newPassword, confirmPassword);
      console.log('🔐 Change password response:', response);
      
      // API trả về {msg: '...', data: {...}} thay vì {success: true/false}
      if (response.msg && response.msg.includes('thành công')) {
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Đổi mật khẩu thành công -> logout user
        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }, 1500);
        
        return { success: true, message: 'Đổi mật khẩu thành công. Đang đăng xuất...' };
      } else {
        return { success: false, message: response.msg || response.message || 'Có lỗi xảy ra khi đổi mật khẩu' };
      }
    } catch (error) {
      console.error('❌ Change password error:', error);
      return { success: false, message: error.message || 'Có lỗi xảy ra khi đổi mật khẩu' };
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowChangePassword(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
      gender: user?.gender || ''
    });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const getRoleDisplayName = (role) => {
    switch(role) {
      case 'Admin': return 'Quản trị viên';
      case 'Teacher': return 'Giáo viên';
      case 'Student': return 'Học viên';
      case 'Parent': return 'Phụ huynh';
      default: return role || '';
    }
  };

  const getChangedFieldsList = (originalData, formData) => {
    const fieldNames = {
      name: 'Họ và tên',
      email: 'Email',
      phoneNumber: 'Số điện thoại',
      address: 'Địa chỉ',
      gender: 'Giới tính'
    };
    
    const changedFields = [];
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalData[key]) {
        changedFields.push(fieldNames[key]);
      }
    });
    
    return changedFields;
  };

  return (
    <div className="modal" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="modal-content" style={{
        background: 'white',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '2.5rem',
        minWidth: 500,
        maxWidth: 600,
        width: '100%',
        position: 'relative',
        animation: 'fadeIn .3s',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
      
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%)',
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 2px 8px rgba(179,0,0,0.08)'
          }}>
            <FiUser style={{ fontSize: 38, color: '#b30000' }} />
          </div>
          <h3 style={{ color: '#b30000', fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: 0.5 }}>
            {isEditing ? 'Chỉnh sửa hồ sơ' : 'Hồ sơ cá nhân'}
          </h3>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '12px',
            borderRadius: 6,
            fontSize: 14,
            border: '1px solid #c3e6cb',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: 6,
            fontSize: 14,
            border: '1px solid #f5c6cb',
            marginBottom: 20,
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="profile-details" style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Name */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Họ và tên:
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.name : (user?.name || '')} 
              onChange={(e) => handleInputChange('name', e.target.value)}
              readOnly={!isEditing}
              style={{ 
                flex: 1, 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: '12px 16px', 
                background: isEditing ? 'white' : '#fafafa', 
                fontSize: 16,
                cursor: isEditing ? 'text' : 'default'
              }} 
            />
          </div>

          {/* Email */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Email:
            </label>
            <input 
              type="email" 
              value={isEditing ? formData.email : (user?.email || '')} 
              onChange={(e) => handleInputChange('email', e.target.value)}
              readOnly={!isEditing}
              style={{ 
                flex: 1, 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: '12px 16px', 
                background: isEditing ? 'white' : '#fafafa', 
                fontSize: 16,
                cursor: isEditing ? 'text' : 'default'
              }} 
            />
          </div>

          {/* Phone Number */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Số điện thoại:
            </label>
            <input 
              type="tel" 
              value={isEditing ? formData.phoneNumber : (user?.phoneNumber || '')} 
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              readOnly={!isEditing}
              style={{ 
                flex: 1, 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: '12px 16px', 
                background: isEditing ? 'white' : '#fafafa', 
                fontSize: 16,
                cursor: isEditing ? 'text' : 'default'
              }} 
            />
          </div>

          {/* Gender */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Giới tính:
            </label>
            {isEditing ? (
              <select 
                value={formData.gender} 
                onChange={(e) => handleInputChange('gender', e.target.value)}
                style={{ 
                  flex: 1, 
                  border: '1px solid #eee', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  background: 'white', 
                  fontSize: 16
                }}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <input 
                type="text" 
                value={user?.gender || 'Chưa cập nhật'} 
                readOnly
                style={{ 
                  flex: 1, 
                  border: '1px solid #eee', 
                  borderRadius: 8, 
                  padding: '12px 16px', 
                  background: '#fafafa', 
                  fontSize: 16
                }} 
              />
            )}
          </div>

          {/* Role */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Vai trò:
            </label>
            <input 
              type="text" 
              value={getRoleDisplayName(user?.role)} 
              readOnly
              style={{ 
                flex: 1, 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: '12px 16px', 
                background: '#fafafa', 
                fontSize: 16
              }} 
            />
          </div>

          {/* Address */}
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label style={{ fontWeight: 600, color: '#b30000', minWidth: 120, fontSize: 16, textAlign: 'right' }}>
              Địa chỉ:
            </label>
            <input 
              type="text" 
              value={isEditing ? formData.address : (user?.address || 'Chưa cập nhật')} 
              onChange={(e) => handleInputChange('address', e.target.value)}
              readOnly={!isEditing}
              style={{ 
                flex: 1, 
                border: '1px solid #eee', 
                borderRadius: 8, 
                padding: '12px 16px', 
                background: isEditing ? 'white' : '#fafafa', 
                fontSize: 16,
                cursor: isEditing ? 'text' : 'default'
              }} 
            />
          </div>
        </div>

        {/* Change Password Section - Only show when editing */}
        {isEditing && (
          <div style={{ marginBottom: 24, padding: '20px', background: '#f8f9fa', borderRadius: 10, border: '1px solid #e9ecef' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <FiLock style={{ color: '#007bff', marginRight: 8 }} />
              <h4 style={{ color: '#007bff', margin: 0, fontSize: 18 }}>Đổi mật khẩu (tùy chọn)</h4>
              <button
                type="button"
                onClick={() => setShowChangePassword(!showChangePassword)}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#007bff',
                  cursor: 'pointer',
                  fontSize: 14,
                  textDecoration: 'underline'
                }}
              >
                {showChangePassword ? 'Ẩn' : 'Hiện'}
              </button>
            </div>

            {showChangePassword && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Current Password */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, color: '#333', fontSize: 14, marginBottom: 6, display: 'block' }}>
                    Mật khẩu hiện tại:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        padding: '12px 40px 12px 16px',
                        fontSize: 16,
                        boxSizing: 'border-box'
                      }}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, color: '#333', fontSize: 14, marginBottom: 6, display: 'block' }}>
                    Mật khẩu mới:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        padding: '12px 40px 12px 16px',
                        fontSize: 16,
                        boxSizing: 'border-box'
                      }}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div style={{ position: 'relative' }}>
                  <label style={{ fontWeight: 600, color: '#333', fontSize: 14, marginBottom: 6, display: 'block' }}>
                    Xác nhận mật khẩu mới:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1px solid #ddd',
                        borderRadius: 8,
                        padding: '12px 40px 12px 16px',
                        fontSize: 16,
                        boxSizing: 'border-box'
                      }}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions" style={{ textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}>
          {!isEditing ? (
            // View Mode Buttons
            <>
              <button 
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(40,167,69,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <FiEdit3 style={{ fontSize: 16 }} />
                Chỉnh sửa
              </button>
              <button 
                onClick={onClose} 
                style={{
                  background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: 6,
                  padding: '12px 24px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(108,117,125,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <FiX style={{ fontSize: 16 }} />
            Đóng
          </button>
            </>
          ) : (
            // Edit Mode Buttons
            <>
                             <button 
                 onClick={async () => {
                   // Xóa messages cũ trước khi bắt đầu
                   setError('');
                   setSuccess('');
                   setIsLoading(true);
                   
                   console.log('🚀 Starting save process...');
                   
                   try {
                     // Kiểm tra thay đổi hồ sơ
                     const originalData = {
                       name: user?.name || '',
                       email: user?.email || '',
                       phoneNumber: user?.phoneNumber || '',
                       address: user?.address || '',
                       gender: user?.gender || ''
                     };
                     
                     const changedProfileFields = getChangedFieldsList(originalData, formData);
                     const hasProfileChanges = changedProfileFields.length > 0;
                     
                     // Kiểm tra thay đổi mật khẩu
                     const hasPasswordChanges = showChangePassword && currentPassword && newPassword && confirmPassword;
                     
                     // Nếu không có thay đổi gì
                     if (!hasProfileChanges && !hasPasswordChanges) {
                       setError('Không có thông tin nào thay đổi');
                       return;
                     }
                     
                     let successMessages = [];
                     let errorMessages = [];
                     
                     // Xử lý đổi mật khẩu trước (nếu có)
                     if (hasPasswordChanges) {
                       console.log('🔐 Starting password change...');
                       const passwordResult = await handleChangePassword({ preventDefault: () => {} });
                       console.log('🔐 Password result:', passwordResult);
                       
                       if (passwordResult && passwordResult.success) {
                         successMessages.push(passwordResult.message);
                         console.log('✅ Password change successful');
                       } else {
                         errorMessages.push(passwordResult?.message || 'Lỗi đổi mật khẩu không xác định');
                         console.log('❌ Password change failed:', passwordResult);
                       }
                     }
                     
                     // Xử lý cập nhật hồ sơ (nếu có)
                     if (hasProfileChanges) {
                       console.log('👤 Starting profile update...');
                       const profileResult = await handleSaveProfile();
                       console.log('👤 Profile result:', profileResult);
                       
                       if (profileResult && profileResult.success) {
                         successMessages.push(profileResult.message);
                         console.log('✅ Profile update successful');
                       } else {
                         errorMessages.push(profileResult?.message || 'Lỗi cập nhật hồ sơ không xác định');
                         console.log('❌ Profile update failed:', profileResult);
                       }
                     }
                     
                     // Hiển thị kết quả
                     console.log('📊 Final results:', {
                       successMessages,
                       errorMessages,
                       hasProfileChanges,
                       hasPasswordChanges
                     });
                     
                     if (errorMessages.length > 0) {
                       console.log('❌ Setting error:', errorMessages.join(', '));
                       setError(errorMessages.join(', '));
                     }
                     
                                                                 if (successMessages.length > 0) {
                       console.log('✅ Setting success:', `Thành công: ${successMessages.join(' và ')}`);
                       setSuccess(`Thành công: ${successMessages.join(' và ')}`);
                       if (errorMessages.length === 0) {
                         console.log('🎉 All successful, closing modal...');
                         // Reset form state
                         setShowChangePassword(false);
                         setCurrentPassword('');
                         setNewPassword('');
                         setConfirmPassword('');
                         setIsEditing(false);
                         
                         // Nếu có đổi mật khẩu thành công, không reload mà để logout tự động
                         const hasPasswordSuccess = successMessages.some(msg => msg.includes('mật khẩu'));
                         if (!hasPasswordSuccess) {
                           console.log('🔄 Profile only update, reloading page...');
                           setTimeout(() => {
                             window.location.reload();
                           }, 1500);
                         } else {
                           console.log('🔐 Password changed, logout will happen automatically...');
                         }
                       } else {
                         console.log('⚠️ Partial success, keeping modal open');
                       }
                     } else if (errorMessages.length === 0) {
                       console.log('⚠️ No success or error messages - this should not happen');
                       setError('Không có phản hồi từ server');
                     }
                   } catch (err) {
                     console.error('Error during save:', err);
                     setError('Có lỗi không mong muốn xảy ra');
                   } finally {
                     setIsLoading(false);
                   }
                 }}
                disabled={isLoading}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <FiSave style={{ fontSize: 16 }} />
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button 
                onClick={handleCancel}
                disabled={isLoading}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(108,117,125,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <FiX style={{ fontSize: 16 }} />
                Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;

