import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext"; // Import để biết vai trò
import api from "../api/api"; // Import để gọi API

const ProfileEditModal = ({ isOpen, onClose, currentUser, onUpdate }) => {
  const { userRole } = useAuth(); // Lấy vai trò (student/teacher)
  
  // State cho form
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");

  // Hàm helper để format Date sang YYYY-MM-DD cho input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch (e) { return ""; }
  };

  // Load dữ liệu của user vào form khi modal mở
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        dateOfBirth: formatDateForInput(currentUser.dateOfBirth),
        address: currentUser.address || "",
        // Thêm các trường của Teacher nếu là Teacher
        ...(userRole === "teacher" && {
          position: currentUser.position || "",
          department: currentUser.department || "",
        }),
      });
    }
  }, [currentUser, isOpen, userRole]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ

    // Xác định API endpoint dựa trên vai trò
    const endpoint = userRole === "teacher" ? "/teacher-profile" : "/profile";
    
    // Tạo payload, đảm bảo dateOfBirth là null nếu rỗng
    const apiPayload = { ...formData };
    if (!apiPayload.dateOfBirth) apiPayload.dateOfBirth = null;

    try {
      // Gọi API update
      const response = await api.put(endpoint, apiPayload);
      
      // Gọi hàm onUpdate (từ Profile.jsx) để cập nhật UI
      onUpdate(response.data); 
      onClose(); // Đóng modal
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            Chỉnh sửa thông tin cá nhân
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>

          {/* Các trường riêng của Teacher */}
          {userRole === 'teacher' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                <input type="text" name="position" value={formData.position || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
                <input type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
              </div>
            </div>
          )}

          {/* SĐT & Ngày sinh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
            </div>
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg"/>
          </div>
          
          {/* Báo lỗi */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Nút Submit */}
          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;