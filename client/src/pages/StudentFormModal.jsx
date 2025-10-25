import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useStudents } from "../context/StudentContext";

const StudentFormModal = ({ isOpen, onClose, editingStudent }) => {
  const { addStudent, updateStudent } = useStudents();

  const [formData, setFormData] = useState({
    name: "",
    student_id: "",
    major: "",
    email: "",
    phone_number: "",
    status: "Active",
    gpa: 0.0,
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || "",
        student_id: editingStudent.student_id || "",
        major: editingStudent.major || "",
        email: editingStudent.email || "",
        phone_number: editingStudent.phone_number || "",
        status: editingStudent.status || "Active",
        gpa: editingStudent.gpa || 0.0,
      });
    } else {
      setFormData({
        name: "",
        student_id: "",
        major: "",
        email: "",
        phone_number: "",
        status: "Active",
        gpa: 0.0,
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

    if (editingStudent) {
      updateStudent({ ...editingStudent, ...formData });
    } else {
      addStudent(formData);
    }

    onClose();
  };

  const isEditMode = !!editingStudent;

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            {isEditMode ? "Sửa thông tin sinh viên" : "Thêm sinh viên mới"}
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
          {/* Tên & Mã SV */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã số sinh viên
              </label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                // Không cho sửa Mã SV khi ở chế độ Sửa
                readOnly={isEditMode}
                className={`w-full p-2 border border-gray-300 rounded-lg ${
                  isEditMode
                    ? "bg-gray-100"
                    : "focus:ring-blue-500 focus:border-blue-500"
                }`}
              />
            </div>
          </div>

          {/* Email & SĐT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Chuyên ngành & Trạng thái */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chuyên ngành
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Graduated">Graduated</option>
              </select>
            </div>
          </div>

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
              {isEditMode ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
