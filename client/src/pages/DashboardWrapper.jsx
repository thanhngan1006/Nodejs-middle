import { useState } from "react";

import StudentList from "./StudentList";
import { mockAdvisor } from "../mock_data/mockAdvisor";
import { Sidebar } from "../components/Sidebar";
import Profile from "./Profile";

const DashboardWrapper = () => {
  const [activeItem, setActiveItem] = useState("profile");
  const user = mockAdvisor; // Giả định user hiện tại là Advisor

  const renderContent = () => {
    switch (activeItem) {
      case "profile":
        return <Profile userDetail={user} role={user.role} />;
      case "students":
        return <StudentList />;
      default:
        return (
          <div className="p-8 text-xl text-gray-500">
            Chọn một mục để bắt đầu.
          </div>
        );
    }
  };

  return (
    <div className="flex bg-gray-100">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        user={user}
      />

      <main className="flex-1 p-0">{renderContent()}</main>
    </div>
  );
};

export default DashboardWrapper;
