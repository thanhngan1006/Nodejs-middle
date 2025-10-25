import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import FormInput from "./FormInput";

const mockApiUpdate = (data) => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 800));
};

/**
 * Modal chỉnh sửa thông tin cá nhân.
 * @param {boolean} isOpen - Trạng thái mở/đóng Modal.
 * @param {function} onClose - Hàm đóng Modal.
 * @param {object} userDetail - Dữ liệu người dùng hiện tại (Advisor/Student).
 * @param {string} role - Vai trò (advisor/student).
 * @param {function} onSave - Hàm được gọi sau khi cập nhật thành công, dùng để cập nhật state cha.
 */
const UserFormModal = ({ isOpen, onClose, userDetail, role, onSave }) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load dữ liệu khi Modal mở hoặc userDetail thay đổi
  useEffect(() => {
    if (userDetail) {
      // Sao chép tất cả các trường cần thiết, tránh sửa state gốc
      const { id, role, ...initialData } = userDetail;
      setFormData(initialData);
    }
  }, [userDetail, isOpen]);

  if (!isOpen || !userDetail) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Gộp tất cả dữ liệu lại: Dữ liệu gốc (để giữ ID) + Dữ liệu đã thay đổi trong Form
    const updatedData = { ...userDetail, ...formData };

    try {
      // 1. Gọi API cập nhật (Mocked)
      const savedData = await mockApiUpdate(updatedData);

      onSave(savedData);

      alert("Thông tin cá nhân đã được cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật profile:", error);
      alert("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const isAdvisor = role === "advisor";

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 m-4 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">
            Chỉnh sửa Profile {isAdvisor ? "(Cố vấn)" : "(Học sinh)"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ và tên */}
            <FormInput
              label="Họ và tên"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              type="text"
            />

            {/* ID (Không sửa) */}
            <FormInput
              label={isAdvisor ? "ADVISOR ID" : "STUDENT ID"}
              value={isAdvisor ? userDetail.advisor_id : userDetail.student_id}
              readOnly
              disabled
            />

            {/* Ngày sinh */}
            {/* Chuyển đổi định dạng ngày để hiển thị trong input type="date" */}
            <FormInput
              label="Ngày sinh"
              name="date_of_birth"
              value={
                formData.date_of_birth
                  ? formData.date_of_birth.split("T")[0]
                  : ""
              }
              onChange={handleChange}
              type="date"
            />

            {/* Email */}
            <FormInput
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              type="email"
            />

            {/* SĐT cá nhân */}
            <FormInput
              label="SĐT cá nhân"
              name="phone_number"
              value={formData.phone_number || ""}
              onChange={handleChange}
              type="tel"
            />

            {/* Địa chỉ */}
            <FormInput
              label="Địa chỉ"
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              type="text"
            />

            {/* Các trường dành riêng cho ADVISOR */}
            {isAdvisor && (
              <>
                <FormInput
                  label="Chức vụ"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleChange}
                  type="text"
                />
                <FormInput
                  label="Phòng ban"
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  type="text"
                />
              </>
            )}
          </div>

          {/* Nút Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg transition-all 
                         ${
                           isLoading
                             ? "opacity-50 cursor-not-allowed"
                             : "hover:bg-indigo-700 hover:shadow-xl"
                         }`}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
