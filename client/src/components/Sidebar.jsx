import {
  UserIcon,
  UsersIcon,
  HomeIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const sidebarItems = [
  { id: "profile", name: "Thông tin cá nhân", icon: UserIcon },
  { id: "students", name: "Quản lý Sinh viên", icon: UsersIcon },
];

export const Sidebar = ({ activeItem, setActiveItem, user }) => (
  <div className="flex flex-col w-64 bg-blue-900 text-white min-h-screen shadow-2xl p-4">
    <div className="py-4 px-2 mb-8 border-b border-blue-800">
      <h1 className="text-2xl font-extrabold tracking-wider">StdPortal</h1>
      <p className="text-xs text-blue-400 mt-1">Advisor Dashboard</p>
    </div>

    {/* User/Role Info (from mockAdvisor) */}
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-800 mb-6">
      <HomeIcon className="h-6 w-6 text-blue-300" />
      <div>
        <p className="text-sm font-semibold">{user.name}</p>
        <p className="text-xs text-blue-400">{user.position}</p>
      </div>
    </div>

    {/* Navigation Links */}
    <nav className="flex-grow">
      {sidebarItems.map((item) => {
        const isActive = activeItem === item.id;
        const baseClasses =
          "flex items-center px-4 py-3 rounded-xl transition-all duration-200 ease-in-out font-medium";
        const activeClasses = "bg-blue-600 shadow-md text-white";
        const inactiveClasses =
          "text-blue-200 hover:bg-blue-700 hover:text-white";

        return (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`${baseClasses} ${
              isActive ? activeClasses : inactiveClasses
            } w-full text-left mb-2`}
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </button>
        );
      })}
    </nav>

    {/* Footer/Logout */}
    <div className="mt-auto pt-4 border-t border-blue-800">
      <button className="flex items-center px-4 py-3 rounded-xl text-blue-300 hover:bg-red-700 hover:text-white transition-all duration-200 w-full">
        <ArrowRightEndOnRectangleIcon className="h-6 w-6 mr-3" />
        Đăng xuất
      </button>
    </div>
  </div>
);
