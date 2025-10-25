import React from "react";
import {
  XMarkIcon,
  UserIcon,
  IdentificationIcon,
  AtSymbolIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  StarIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

// Helper component (giống Profile.jsx) để hiển thị thông tin
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start space-x-3 py-3 px-4 rounded-lg hover:bg-gray-50">
    <Icon className="h-6 w-6 text-blue-600 mt-0.5" />
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-base font-medium text-gray-900">{value || "N/A"}</p>
    </div>
  </div>
);

// Helper format ngày
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const StudentViewModal = ({ isOpen, onClose, student }) => {
  if (!isOpen || !student) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            Chi tiết Sinh viên
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          <InfoRow label="Họ và tên" value={student.name} icon={UserIcon} />
          <InfoRow label="Mã số sinh viên" value={student.studentId} icon={IdentificationIcon} />
          <InfoRow label="Email" value={student.user?.email} icon={AtSymbolIcon} />
          <InfoRow label="Chuyên ngành" value={student.major} icon={AcademicCapIcon} />
          <InfoRow label="Điểm GPA" value={student.gpa.toFixed(2)} icon={StarIcon} />
          <InfoRow label="Trạng thái" value={student.status} icon={CheckCircleIcon} />
          <InfoRow label="Số điện thoại" value={student.phoneNumber} icon={PhoneIcon} />
          <InfoRow label="Ngày sinh" value={formatDate(student.dateOfBirth)} icon={CalendarIcon} />
          <InfoRow label="Địa chỉ" value={student.address} icon={MapPinIcon} />
        </div>

        {/* Nút Đóng */}
        <div className="pt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;