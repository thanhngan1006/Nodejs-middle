import React, { useState, useEffect } from "react";
import {
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  AtSymbolIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  StarIcon, // Icon cho GPA
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import api from "../api/api"; // Import file api
import ProfileEditModal from "./ProfileEditModal"; // Import Modal chỉnh sửa

// Component InfoBlock (Không thay đổi)
const InfoBlock = ({
  label,
  value,
  icon: IconComponent,
  iconColor = "text-blue-600",
}) => (
  <div
    className="bg-white p-4 rounded-xl flex items-start space-x-4 shadow-sm 
                  hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out cursor-pointer
                  border border-gray-100 hover:border-blue-200"
  >
    <div className="flex-shrink-0 mt-1">
      <IconComponent className={`h-6 w-6 ${iconColor}`} />
    </div>
    <div className="flex flex-col">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <div className="text-base font-bold text-gray-800 break-words leading-tight mt-0.5">
        {value || "N/A"} {/* Hiển thị N/A nếu giá trị rỗng */}
      </div>
    </div>
  </div>
);

// --- Component Profile chính (Đã cập nhật) ---
const Profile = () => {
  const { userRole } = useAuth(); // Lấy vai trò từ Context
  const [userDetail, setUserDetail] = useState(null); // State cho dữ liệu API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State để quản lý Modal chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Hàm gọi API để lấy thông tin profile
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (userRole === "teacher") {
        response = await api.get("/teacher-profile");
      } else if (userRole === "student") {
        response = await api.get("/profile");
      } else {
        throw new Error("Vai trò không hợp lệ.");
      }
      setUserDetail(response.data);
    } catch (err) {
      setError(err.message || "Không thể tải thông tin cá nhân.");
    }
    setLoading(false);
  };

  // Chạy hàm fetchProfile khi component mount (hoặc khi userRole thay đổi)
  useEffect(() => {
    fetchProfile();
  }, [userRole]);

  // Hàm callback được gọi từ Modal sau khi cập nhật thành công
  const handleProfileUpdate = (updatedProfileData) => {
    setUserDetail(updatedProfileData); // Cập nhật state với dữ liệu mới
    setIsEditModalOpen(false); // Đóng modal
  };

  // --- Xử lý trạng thái Loading và Error ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  if (error || !userDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-600 mb-2">
            Lỗi tải thông tin
          </h3>
          <p className="text-gray-700">
            {error || "Không tìm thấy thông tin người dùng."}
          </p>
        </div>
      </div>
    );
  }

  // --- Xử lý logic hiển thị (Dùng dữ liệu API) ---
  let title = "Thông tin cá nhân";
  let roleDisplay = "";
  let infoBlocks = [];
  let iconColorClass = "text-blue-600";
  const userEmail = userDetail.user?.email; // Email nằm trong object user lồng nhau

  // Hàm helper format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (userRole === "student") {
    roleDisplay = "Học sinh";
    iconColorClass = "text-blue-600";
    infoBlocks = [
      { label: "Vai trò", value: roleDisplay, icon: AcademicCapIcon },
      { label: "Họ và tên", value: userDetail.name, icon: UserIcon },
      { label: "STUDENT ID", value: userDetail.studentId, icon: IdentificationIcon },
      { label: "Chuyên ngành", value: userDetail.major, icon: BriefcaseIcon },
      { label: "Email", value: userEmail, icon: AtSymbolIcon },
      { label: "Điểm GPA", value: userDetail.gpa?.toFixed(2) || "0.00", icon: StarIcon },
      { label: "Ngày sinh", value: formatDate(userDetail.dateOfBirth), icon: CalendarIcon },
      { label: "SĐT cá nhân", value: userDetail.phoneNumber, icon: PhoneIcon },
      { label: "Địa chỉ", value: userDetail.address, icon: MapPinIcon },
    ];
  } else if (userRole === "teacher") {
    roleDisplay = "Cố vấn / Giảng viên";
    iconColorClass = "text-indigo-600";
    infoBlocks = [
      { label: "Vai trò", value: roleDisplay, icon: BriefcaseIcon },
      { label: "Họ và tên", value: userDetail.name, icon: UserIcon },
      { label: "EMPLOYEE ID", value: userDetail.employeeId, icon: IdentificationIcon },
      { label: "Chức vụ", value: userDetail.position, icon: AcademicCapIcon },
      { label: "Phòng ban", value: userDetail.department, icon: BuildingOfficeIcon },
      { label: "Email", value: userEmail, icon: AtSymbolIcon },
      { label: "Ngày sinh", value: formatDate(userDetail.dateOfBirth), icon: CalendarIcon },
      { label: "SĐT cá nhân", value: userDetail.phoneNumber, icon: PhoneIcon },
      { label: "Địa chỉ", value: userDetail.address, icon: MapPinIcon },
    ];
  }

  // --- Giao diện chung ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 sm:p-10 
                      transform hover:scale-[1.01] transition-transform duration-300 ease-in-out border border-gray-200"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10 pb-6 border-b border-gray-200">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {title}
          </h2>
          <p
            className="text-lg font-semibold"
            style={{ color: iconColorClass }}
          >
            Vai trò: <span className="font-extrabold">{roleDisplay}</span>
          </p>
        </div>

        {/* Grid thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 text-gray-800">
          {infoBlocks.map((block) => (
            <InfoBlock
              key={block.label}
              label={block.label}
              value={block.value}
              icon={block.icon}
              iconColor={iconColorClass}
            />
          ))}
        </div>

        {/* Footer (Chức năng chỉnh sửa) */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setIsEditModalOpen(true)} // Thêm onClick để mở Modal
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full 
                             shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
      
      {/* Render Modal (Modal này bị ẩn) */}
      <ProfileEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={userDetail} // Truyền dữ liệu hiện tại vào Modal
        onUpdate={handleProfileUpdate} // Truyền hàm callback
      />
    </div>
  );
};

export default Profile;