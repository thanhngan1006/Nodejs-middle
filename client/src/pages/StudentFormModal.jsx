import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useStudents } from "../context/StudentContext"; // Đã import
import { useAuth } from "../context/AuthContext"; // Import để lấy role

const StudentFormModal = ({ isOpen, onClose, editingStudent }) => {
  const { addStudent, updateStudent } = useStudents();
  const { userRole } = useAuth(); // Lấy role
  const isEditMode = !!editingStudent;

  // Khởi tạo State cho Form (Sử dụng camelCase)
  const [formData, setFormData] = useState({
    name: "",
    studentId: "", // Đổi từ student_id
    major: "",
    email: "",
    password: "",
    phoneNumber: "", // Đổi từ phone_number
    dateOfBirth: "", // Thêm
    address: "", // Thêm
    status: "Active",
    gpa: 0.0,
  });

  // Cập nhật form khi mở
  useEffect(() => {
    // Hàm helper để format Date sang YYYY-MM-DD
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toISOString().split("T")[0];
      } catch (e) {
        return "";
      }
    };

    if (editingStudent) {
      // Chế độ Sửa
      setFormData({
        name: editingStudent.name || "",
        studentId: editingStudent.studentId || "", // Dùng camelCase
        major: editingStudent.major || "",
        email: editingStudent.user?.email || "", // Email từ user
        password: "", // Luôn rỗng
        phoneNumber: editingStudent.phoneNumber || "", // Dùng camelCase
        dateOfBirth: formatDateForInput(editingStudent.dateOfBirth), // Dùng camelCase
        address: editingStudent.address || "", // Dùng camelCase
        status: editingStudent.status || "Active",
        gpa: editingStudent.gpa || 0.0,
      });
    } else {
      // Chế độ Thêm mới (Reset form)
      setFormData({
        name: "", studentId: "", major: "", email: "", password: "",
        phoneNumber: "", dateOfBirth: "", address: "", status: "Active", gpa: 0.0,
      });
    }
  }, [editingStudent, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo payload API
    const apiPayload = { ...formData };
    
    // Xử lý date: nếu rỗng thì gửi null
    if (!apiPayload.dateOfBirth) apiPayload.dateOfBirth = null;

    if (isEditMode) {
      // Sửa: Xóa các trường không được phép sửa
      delete apiPayload.password;
      delete apiPayload.email;
      delete apiPayload.studentId;
      
      // Chỉ Teacher mới được sửa GPA và Status
      if (userRole !== 'teacher') {
        delete apiPayload.gpa;
        delete apiPayload.status;
      }

      updateStudent({ ...apiPayload, id: editingStudent.id });
    } else {
      // Thêm: Xóa các trường không cần thiết khi thêm
      delete apiPayload.gpa; // GPA mặc định là 0
      delete apiPayload.status; // Status mặc định là Active
      addStudent(apiPayload);
    }

    onClose();
  };

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            {isEditMode ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
          </h2>
          <button onClick={onClose} className="text-gray-500 ...">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Tên & Mã SV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border ..."/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã số sinh viên</label>
              <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required readOnly={isEditMode} className={`w-full p-2 border ... ${isEditMode ? "bg-gray-100 cursor-not-allowed" : ""}`}/>
            </div>
          </div>

          {/* Email & Password (Chỉ khi Thêm mới) */}
          {!isEditMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required={!isEditMode} className="w-full p-2 border ..."/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required={!isEditMode} className="w-full p-2 border ..."/>
              </div>
            </div>
          )}
          
          {/* Chuyên ngành & SĐT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên ngành</label>
              <input type="text" name="major" value={formData.major} onChange={handleChange} required className="w-full p-2 border ..."/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border ..."/>
            </div>
          </div>

          {/* Ngày sinh & Địa chỉ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border ..."/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border ..."/>
            </div>
          </div>
          
          {/* Trạng thái & GPA (Chỉ khi Sửa và là Teacher) */}
          {isEditMode && userRole === 'teacher' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border ... bg-white">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Graduated">Graduated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm GPA (0.0 - 4.0)</label>
                <input type="number" name="gpa" value={formData.gpa} onChange={handleChange} step="0.01" min="0" max="4" className="w-full p-2 border ..."/>
              </div>
            </div>
          )}

          {/* Nút Submit */}
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 ...">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white ...">
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;