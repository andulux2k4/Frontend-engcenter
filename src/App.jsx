import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/auth/Login'
import AdminDashboard from './components/dashboards/AdminDashboard'
import TeacherDashboard from './components/dashboards/TeacherDashboard'
import StudentDashboard from './components/dashboards/StudentDashboard'
import ParentDashboard from './components/dashboards/ParentDashboard'
import LandingPage from './components/common/LandingPage'
import apiService from './services/api'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

    const checkAuthStatus = async () => {
    try {
      const token = apiService.getToken()
      
      if (token && apiService.isTokenValid()) {
        const profileResponse = await apiService.getProfile(token)
          
          if (profileResponse.success) {
            setUser({
            ...profileResponse.data,
              token: token
          })
          } else {
          apiService.removeToken()
        }
          }
        } catch (error) {
      console.error('Auth check error:', error)
      apiService.removeToken()
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    apiService.removeToken()
    setUser(null)
  }

  const handleGoHome = () => {
    // Chuyển về trang chủ nhưng vẫn giữ user để có thể quay lại dashboard
    // Không làm gì cả, chỉ để component tự navigate
  }

  if (loading) {
    return <div className="loading">Đang tải...</div>
  }

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" />

    switch (user.role?.toLowerCase()) {
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
      case 'teacher':
        return <TeacherDashboard user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
      case 'student':
        return <StudentDashboard user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
      case 'parent':
        return <ParentDashboard user={user} onLogout={handleLogout} onGoHome={handleGoHome} />
      default:
        return <Navigate to="/login" />
    }
  }

  return (
    <Router>
      <div className="App">
      <Routes>
          <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} onGoHome={handleGoHome} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
          <Route path="/dashboard" element={user ? renderDashboard() : <Navigate to="/login" />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
