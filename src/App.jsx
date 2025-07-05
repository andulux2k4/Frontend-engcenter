import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import TeacherDashboard from "./components/dashboards/TeacherDashboard";
import StudentDashboard from "./components/dashboards/StudentDashboard";
import ParentDashboard from "./components/dashboards/ParentDashboard";
import LandingPage from "./components/common/LandingPage";
import apiService from "./services/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();

    // Thêm listener để kiểm tra auth khi tab được focus lại
    const handleFocus = () => {
      console.log("🔐 Tab focused, checking auth status...");
      const token = apiService.getToken();
      if (token && !apiService.isTokenValid()) {
        console.log("🔐 Token expired on focus, logging out...");
        handleLogout();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = apiService.getToken();
      console.log("🔐 Checking auth status, token exists:", !!token);

      if (token && apiService.isTokenValid()) {
        console.log("🔐 Token is valid, checking for saved user data...");

        // Thử khôi phục user data từ localStorage trước
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          try {
            const userData = JSON.parse(savedUserData);
            console.log("🔐 Restored user data from localStorage:", userData);
            setUser(userData);
            setLoading(false);
            return;
          } catch (parseError) {
            console.log(
              "🔐 Failed to parse saved user data, fetching from API..."
            );
            localStorage.removeItem("userData");
          }
        }

        console.log("🔐 Fetching profile from API...");
        const profileResponse = await apiService.getProfile(token);

        console.log("🔐 Profile response:", profileResponse);

        if (profileResponse.success || profileResponse.data) {
          const userData = {
            ...(profileResponse.data || profileResponse),
            token: token,
          };
          console.log("🔐 Setting user data:", userData);
          localStorage.setItem("userData", JSON.stringify(userData));
          setUser(userData);
        } else {
          console.log("🔐 Profile fetch failed, removing token");
          apiService.removeToken();
          localStorage.removeItem("userData");
        }
      } else {
        console.log("🔐 No valid token found");
        if (token) {
          console.log("🔐 Invalid token, removing...");
          apiService.removeToken();
        }
        localStorage.removeItem("userData");
      }
    } catch (error) {
      console.error("🔐 Auth check error:", error);
      apiService.removeToken();
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    console.log("🔐 Handling login with userData:", userData);
    // Lưu user data vào localStorage để khôi phục khi reload
    localStorage.setItem("userData", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    console.log("🔐 Handling logout");
    apiService.removeToken();
    localStorage.removeItem("userData");
    setUser(null);
  };

  const handleGoHome = () => {
    // Chuyển về trang chủ nhưng vẫn giữ user để có thể quay lại dashboard
    // Không làm gì cả, chỉ để component tự navigate
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  const renderDashboard = () => {
    if (!user) return <Navigate to="/login" />;

    switch (user.role?.toLowerCase()) {
      case "admin":
        return (
          <AdminDashboard
            user={user}
            onLogout={handleLogout}
            onGoHome={handleGoHome}
          />
        );
      case "teacher":
        return (
          <TeacherDashboard
            user={user}
            onLogout={handleLogout}
            onGoHome={handleGoHome}
          />
        );
      case "student":
        return (
          <StudentDashboard
            user={user}
            onLogout={handleLogout}
            onGoHome={handleGoHome}
          />
        );
      case "parent":
        return (
          <ParentDashboard
            user={user}
            onLogout={handleLogout}
            onGoHome={handleGoHome}
          />
        );
      default:
        return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                user={user}
                onLogout={handleLogout}
                onGoHome={handleGoHome}
              />
            }
          />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={user ? renderDashboard() : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
