import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardWrapper from "./pages/DashboardWrapper";
import StudentList from "./pages/StudentList";
import Profile from "./pages/Profile"; 
import { StudentProvider } from "./context/StudentProvider";
import { useAuth } from "./context/AuthContext";

// Component bảo vệ Route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Đây là route được bảo vệ */}
      <Route
        path="/*" // Tất cả các route bên trong
        element={
          <ProtectedRoute>
            <DashboardWrapper />
          </ProtectedRoute>
        }
      >
        {/* Đây là các route con (Nested Routes) */}
        
        {/* Trang chủ (hiển thị Profile) */}
        <Route index element={<Profile />} /> 
        
        {/* Chỉ Teacher mới thấy route này */}
        {userRole === 'teacher' && (
          <Route 
            path="students" 
            element={
              <StudentProvider>
                <StudentList />
              </StudentProvider>
            } 
          />
        )}
        
        {/* Route cho Student xem điểm (ví dụ)
        {userRole === 'student' && (
          <Route path="grades" element={<StudentGrades />} />
        )}
        */}

        {/* Route 404
        <Route path="*" element={<div>Not Found</div>} /> 
        */}
      </Route>
    </Routes>
  );
}

export default App;