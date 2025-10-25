import React, { useState, useEffect } from "react";
import {
  UserIcon,
  UsersIcon,
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
  BookOpenIcon, // Thêm icon
} from "@heroicons/react/24/outline";
import { Routes, Route, Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import api from "../api/api"; // Import file api

// --- Sidebar Component (Đã cập nhật) ---
// (Chúng ta chuyển Sidebar vào cùng file cho dễ quản lý)

const Sidebar = ({ user, menuItems, logout }) => {
  const location = useLocation(); // Lấy vị trí hiện tại

  return (
    <div className="flex flex-col w-64 bg-blue-900 text-white min-h-screen shadow-2xl p-4">
      {/* Header & Logo */}
      <div className="py-4 px-2 mb-8 border-b border-blue-800">
        <h1 className="text-2xl font-extrabold tracking-wider">StdPortal</h1>
        <p className="text-xs text-blue-400 mt-1">Student Dashboard</p>
      </div>

      {/* Thông tin User (từ API) */}
      <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800 mb-6">
        <HomeIcon className="h-6 w-6 text-blue-300" />
        <div>
          <p className="text-sm font-semibold">{user?.name || "Loading..."}</p>
          <p className="text-xs text-blue-400">
            {user?.position || user?.major || "Role"}
          </p>
        </div>
      </div>

      {/* Navigation Links (Dùng <Link> thay vì <button>) */}
      <nav className="flex-grow">
        {menuItems.map((item) => {
          // So sánh path, ví dụ: /profile so với /
          const isActive = location.pathname === item.path;
          const baseClasses =
            "flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out font-medium";
          const activeClasses = "bg-blue-600 shadow-md text-white";
          const inactiveClasses =
            "text-blue-200 hover:bg-blue-700 hover:text-white";

          return (
            <Link
              key={item.id}
              to={item.path} // Dùng <Link> để điều hướng
              className={`${baseClasses} ${
                isActive ? activeClasses : inactiveClasses
              } w-full text-left mb-2`}
            >
              <item.icon className="h-6 w-6 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Logout (Đã thêm onClick) */}
      <div className="mt-auto pt-4 border-t border-blue-800">
        <button
          onClick={logout} // Gọi hàm logout từ AuthContext
          className="flex items-center px-4 py-3 rounded-xl text-blue-300 hover:bg-red-700 hover:text-white transition-all duration-200 w-full"
        >
          <ArrowRightEndOnRectangleIcon className="h-6 w-6 mr-3" />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

// --- Component chính (Đã cập nhật) ---
const DashboardWrapper = () => {
  const { userRole, logout } = useAuth();
  const [user, setUser] = useState(null); // State để lưu profile thật
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Dữ liệu menu động
  let sidebarItems = [];

  if (userRole === "teacher") {
    sidebarItems = [
      { id: "profile", name: "Thông tin Giảng viên", icon: UserIcon, path: "/" },
      { id: "students", name: "Quản lý Sinh viên", icon: UsersIcon, path: "/students" },
    ];
  } else if (userRole === "student") {
    sidebarItems = [
      { id: "profile", name: "Thông tin cá nhân", icon: UserIcon, path: "/" },
      // (Thêm các link khác cho student nếu có, ví dụ: Xem điểm)
      // { id: "grades", name: "Xem điểm", icon: BookOpenIcon, path: "/grades" },
    ];
  }

  // Tự động gọi API để lấy profile khi component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let response;
        if (userRole === "teacher") {
          response = await api.get("/teacher-profile");
        } else if (userRole === "student") {
          response = await api.get("/profile");
        }
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Nếu lỗi (ví dụ token hết hạn), đá về login
        logout();
        navigate("/login");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userRole, logout, navigate]); // Chạy lại khi vai trò thay đổi

  // Cập nhật lại file App.jsx để dùng các Route này
  // (Chúng ta sẽ làm ở bước sau)
  const renderRoutes = () => (
    <Routes>
      <Route
        index // Trang chủ của Dashboard (/)
        element={<Profile userDetail={user} role={userRole} />}
      />
      {userRole === "teacher" && (
        <Route path="students" element={<StudentList />} />
      )}
      {/* Thêm các route khác nếu cần */}
      {/* <Route path="grades" element={<StudentGrades />} /> */}
      
      {/* Route bắt lỗi 404
      <Route path="*" element={<div>Page Not Found</div>} /> 
      */}
    </Routes>
  );

  if (loading) {
    return <div>Loading dashboard...</div>; // Màn hình chờ
  }

  return (
    <div className="flex bg-gray-100">
      <Sidebar user={user} menuItems={sidebarItems} logout={logout} />

      {/* Main Content Area */}
      <main className="flex-1 p-0">
        {/* Thay vì dùng 'activeItem', chúng ta dùng <Outlet />
          để React Router tự quyết định component nào sẽ hiển thị
          dựa trên URL.
        */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardWrapper;