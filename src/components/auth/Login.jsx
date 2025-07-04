import React, { useState, useEffect } from 'react'
import apiService from '../../services/api'
import '../../styles/auth/Login.css'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: email, 2: verify code, 3: new password
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('')
  const [captchaCode, setCaptchaCode] = useState('')
  const [userCaptchaInput, setUserCaptchaInput] = useState('')

  // Generate captcha code
  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Initialize captcha when component mounts or when switching to forgot password
  useEffect(() => {
    if (isForgotPassword) {
      setCaptchaCode(generateCaptcha())
      setUserCaptchaInput('')
    }
  }, [isForgotPassword])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call login API
      const loginResponse = await apiService.login(formData.email, formData.password)
      
      // Backend returns: {msg, token, user} instead of {success, data: {token, user}}
      if (loginResponse.token && loginResponse.user) {
        // Store token using apiService method
        apiService.setToken(loginResponse.token)
        
        // Get user profile
        const profileResponse = await apiService.getProfile(loginResponse.token)
        
        if (profileResponse.success || profileResponse.data) {
          // Call parent component with user data
          onLogin({
            ...(profileResponse.data || profileResponse),
            token: loginResponse.token
          })
        } else {
          // Use user data from login response if profile fails
          onLogin({
            ...loginResponse.user,
            token: loginResponse.token
          })
        }
      } else {
        setError(loginResponse.msg || loginResponse.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Tên đăng nhập hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPasswordStep1 = async (e) => {
    e.preventDefault()
    setError('')
    setForgotPasswordSuccess('')
    
    // Validate captcha
    if (userCaptchaInput.toUpperCase() !== captchaCode) {
      setError('Mã xác thực không đúng. Vui lòng thử lại.')
      setUserCaptchaInput('')
      setCaptchaCode(generateCaptcha())
      return
    }

    setLoading(true)

    try {
      // Call forgot password API
      const response = await apiService.forgotPassword(forgotPasswordEmail)
      
      if (response.success || response.msg) {
        setForgotPasswordSuccess('Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.')
        setForgotPasswordStep(2)
        setUserCaptchaInput('')
        setCaptchaCode(generateCaptcha())
      } else {
        setError(response.message || 'Không thể gửi mã xác thực. Vui lòng thử lại.')
        setUserCaptchaInput('')
        setCaptchaCode(generateCaptcha())
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Email không tồn tại hoặc có lỗi xảy ra. Vui lòng thử lại.')
      setUserCaptchaInput('')
      setCaptchaCode(generateCaptcha())
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call verify reset code API
      const response = await apiService.verifyResetCode(forgotPasswordEmail, resetCode)
      
      if (response.success || response.msg) {
        setForgotPasswordSuccess('Mã xác thực đúng. Vui lòng nhập mật khẩu mới.')
        setForgotPasswordStep(3)
      } else {
        setError(response.message || 'Mã xác thực không đúng. Vui lòng thử lại.')
        setResetCode('')
      }
    } catch (error) {
      console.error('Verify code error:', error)
      setError('Mã xác thực không đúng hoặc đã hết hạn. Vui lòng thử lại.')
      setResetCode('')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }

    setLoading(true)

    try {
      // Call reset password API
      const response = await apiService.resetPassword(forgotPasswordEmail, resetCode, newPassword, confirmPassword)
      
      if (response.success || response.msg) {
        setForgotPasswordSuccess('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.')
        setTimeout(() => {
          switchToLogin()
        }, 3000)
      } else {
        setError(response.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const switchToForgotPassword = () => {
    setIsForgotPassword(true)
    setForgotPasswordStep(1)
    setError('')
    setForgotPasswordSuccess('')
  }

  const switchToLogin = () => {
    setIsForgotPassword(false)
    setForgotPasswordStep(1)
    setError('')
    setForgotPasswordSuccess('')
    setForgotPasswordEmail('')
    setResetCode('')
    setNewPassword('')
    setConfirmPassword('')
    setUserCaptchaInput('')
  }

  const refreshCaptcha = () => {
    setCaptchaCode(generateCaptcha())
    setUserCaptchaInput('')
  }

  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1:
        return (
          <form onSubmit={handleForgotPasswordStep1}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
              />
            </div>
            
            {/* Captcha Section */}
            <div className="captcha-section">
              <div className="captcha-display">
                <div className="captcha-code">{captchaCode}</div>
                <button 
                  type="button" 
                  className="refresh-captcha"
                  onClick={refreshCaptcha}
                >
                  🔄
                </button>
              </div>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <input
                  type="text"
                  value={userCaptchaInput}
                  onChange={(e) => setUserCaptchaInput(e.target.value)}
                  placeholder="Nhập mã xác thực"
                  required
                  maxLength={6}
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
            </div>
            
            <div className="button-group">
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </button>
            </div>
            <div className="forgot-password">
              <a href="#" onClick={switchToLogin}>Quay lại đăng nhập</a>
            </div>
          </form>
        )
      
      case 2:
        return (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Nhập mã xác thực từ email"
                required
                maxLength={6}
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Mã Xác Thực'}
              </button>
            </div>
            <div className="forgot-password">
              <a href="#" onClick={() => setForgotPasswordStep(1)}>Quay lại bước trước</a>
            </div>
          </form>
        )
      
      case 3:
        return (
          <form onSubmit={handleResetPassword}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới"
                required
                minLength={6}
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                required
                minLength={6}
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
              </button>
            </div>
            <div className="forgot-password">
              <a href="#" onClick={() => setForgotPasswordStep(2)}>Quay lại bước trước</a>
            </div>
          </form>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="login-container">
      <div className="logo-section">
        <div className="logo-content">
          <img src="/fakeLogo-removebg-preview.png" alt="School Logo" className="school-logo" />
          <h1>TRUNG TÂM QUẢN LÝ TIẾNG ANH EPISTEME</h1>
          <p>EPISTEME TRAINING MANAGEMENT SYSTEM</p>
        </div>
      </div>
      <div className="login-box">
        <h2>
          {isForgotPassword 
            ? forgotPasswordStep === 1 
              ? 'Quên mật khẩu' 
              : forgotPasswordStep === 2 
                ? 'Mã xác thực' 
                : 'Đặt lại mật khẩu'
            : 'Đăng nhập'
          }
        </h2>
        {error && <div className="error-message">{error}</div>}
        {forgotPasswordSuccess && <div className="success-message">{forgotPasswordSuccess}</div>}
        
        {isForgotPassword ? renderForgotPasswordForm() : (
          // Login Form
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email đăng nhập"
                required
              />
            </div>
            <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                required
              />
            </div>
            <div className="forgot-password">
              <a href="#" onClick={switchToForgotPassword}>Quên mật khẩu?</a>
            </div>
            <div className="button-group">
              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login