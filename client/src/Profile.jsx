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
} from "@heroicons/react/24/outline";
import { mockAdvisor } from "./mock_data/mockAdvisor";

const currentUserDetail = mockAdvisor;

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
        {value}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const userDetail = currentUserDetail;
  const role = userDetail?.role; // Sử dụng optional chaining để tránh lỗi nếu userDetail là null

  if (!userDetail || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-600 mb-2">
            Lỗi tải thông tin
          </h3>
          <p className="text-gray-700">
            Không tìm thấy thông tin người dùng hoặc vai trò không hợp lệ.
          </p>
        </div>
      </div>
    );
  }

  let title = "Thông tin cá nhân";
  let roleDisplay = "";
  let infoBlocks = [];
  let iconColorClass = "text-blue-600"; // Mặc định cho student

  // ----------------------------------------------------
  // LOGIC XỬ LÝ THEO VAI TRÒ
  // ----------------------------------------------------

  if (role === "student") {
    roleDisplay = "Học sinh";
    iconColorClass = "text-blue-600";

    const phoneNumber = userDetail.phone_number?.startsWith("0")
      ? userDetail.phone_number
      : "0" + userDetail.phone_number;

    infoBlocks = [
      { label: "Vai trò", value: roleDisplay, icon: AcademicCapIcon },
      { label: "Họ và tên", value: userDetail.name, icon: UserIcon },
      {
        label: "STUDENT ID",
        value: userDetail.student_id,
        icon: IdentificationIcon,
      },
      {
        label: "Ngày sinh",
        value: new Date(userDetail.date_of_birth).toLocaleDateString("vi-VN"),
        icon: CalendarIcon,
      },
      { label: "Email", value: userDetail.email, icon: AtSymbolIcon },
      { label: "SĐT cá nhân", value: phoneNumber, icon: PhoneIcon },
      { label: "Địa chỉ", value: userDetail.address, icon: MapPinIcon },
    ];
  } else if (role === "advisor") {
    roleDisplay = "Cố vấn / Giảng viên";
    iconColorClass = "text-indigo-600"; // Màu sắc khác cho advisor

    infoBlocks = [
      { label: "Vai trò", value: roleDisplay, icon: BriefcaseIcon }, // Icon khác cho advisor
      { label: "Họ và tên", value: userDetail.name, icon: UserIcon },
      {
        label: "ADVISOR ID",
        value: userDetail.advisor_id,
        icon: IdentificationIcon,
      },
      { label: "Chức vụ", value: userDetail.position, icon: AcademicCapIcon }, // Icon chức vụ
      {
        label: "Phòng ban",
        value: userDetail.department,
        icon: BuildingOfficeIcon,
      }, // Icon phòng ban
      {
        label: "Ngày sinh",
        value: new Date(userDetail.date_of_birth).toLocaleDateString("vi-VN"),
        icon: CalendarIcon,
      },
      { label: "Email", value: userDetail.email, icon: AtSymbolIcon },
      { label: "SĐT cá nhân", value: userDetail.phone_number, icon: PhoneIcon },
      { label: "Địa chỉ", value: userDetail.address, icon: MapPinIcon },
    ];
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-lg border-l-4 border-red-500">
          <h3 className="text-2xl font-semibold text-red-600 mb-2">
            Lỗi: Vai trò không được hỗ trợ
          </h3>
          <p className="text-gray-700">
            Vai trò <span className="font-bold">"{role}"</span> chưa được cấu
            hình hiển thị.
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GIAO DIỆN CHUNG (Tái sử dụng)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center font-sans">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 sm:p-10 
                      transform hover:scale-[1.01] transition-transform duration-300 ease-in-out border border-gray-200"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-10 pb-6 border-b border-gray-200">
          {/* Avatar (Ví dụ, nếu có) */}
          {/* <img src="https://via.placeholder.com/100" alt="Avatar" className="w-24 h-24 rounded-full border-4 border-blue-300 mb-4 shadow-md" /> */}
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
          {infoBlocks.map((block, index) => (
            <InfoBlock
              key={block.label} // Dùng label làm key nếu chắc chắn duy nhất, hoặc một ID từ data
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
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full 
                             shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
