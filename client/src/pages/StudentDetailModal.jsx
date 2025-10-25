import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  UserIcon,
  IdentificationIcon,
  AcademicCapIcon,
  AtSymbolIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const InfoBlock = ({
  label,
  value,
  icon: IconComponent,
  color = "text-blue-600",
}) => (
  <div
    className="bg-gray-50 p-4 rounded-xl flex items-start space-x-4 shadow-sm 
                  border border-gray-100"
  >
    <div className="flex-shrink-0 mt-1">
      <IconComponent className={`h-6 w-6 ${color}`} />
    </div>
    <div className="flex flex-col min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <div className="text-base font-bold text-gray-800 break-words leading-tight mt-0.5 overflow-hidden">
        {value}
      </div>
    </div>
  </div>
);

const StudentDetailModal = ({ student, onClose }) => {
  if (!student) return null;

  // Giả định hàm định dạng ngày
  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString("vi-VN");

  return (
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-8 m-4 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
            Chi tiết Sinh viên: {student.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
          <InfoBlock
            label="Mã số sinh viên"
            value={student.student_id}
            icon={IdentificationIcon}
          />
          <InfoBlock label="Họ và tên" value={student.name} icon={UserIcon} />
          <InfoBlock
            label="Chuyên ngành"
            value={student.major}
            icon={AcademicCapIcon}
          />

          <InfoBlock
            label="Email"
            value={student.email}
            icon={AtSymbolIcon}
            color="text-indigo-600"
          />
          <InfoBlock
            label="Số điện thoại"
            value={student.phone_number}
            icon={PhoneIcon}
            color="text-green-600"
          />
          <InfoBlock
            label="Ngày nhập học"
            value={formatDate(student.joined_date)}
            icon={CalendarIcon}
          />

          <InfoBlock
            label="Trạng thái"
            value={student.status}
            icon={MapPinIcon}
          />
          <InfoBlock
            label="Điểm GPA"
            value={student.gpa.toFixed(2)}
            icon={ChartBarIcon}
            color={student.gpa >= 3.5 ? "text-green-600" : "text-yellow-600"}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-right border-t pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
