import React, { useState } from 'react'
import apiService from '../../services/api'
import '../../styles/auth/Login.css'

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="login-container">
      <div className="logo-section">
        <div className="logo-content">
          <img src="/ieltsFighter-removebg-preview.png" alt="School Logo" className="school-logo" />
          <h1>TRUNG TÂM QUẢN LÝ TIẾNG ANH</h1>
          <p>TRAINING MANAGEMENT SYSTEM</p>
        </div>
      </div>
      <div className="login-box">
        <h2>Đăng nhập</h2>
        {error && <div className="error-message">{error}</div>}
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
            <a href="#">Quên mật khẩu?</a>
          </div>
          <div className="button-group">
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login