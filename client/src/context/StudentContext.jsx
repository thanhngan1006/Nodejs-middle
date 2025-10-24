import { createContext, useContext } from "react";

// 1. Khởi tạo Context
export const StudentContext = createContext(null);

// 2. Custom Hook để dễ dàng sử dụng Context
export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    // Luôn kiểm tra để đảm bảo Hook được gọi bên trong Provider
    throw new Error("useStudents must be used within a StudentProvider");
  }
  return context;
};
