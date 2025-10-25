import React, { useState, useEffect, useContext } from "react";
import { StudentContext } from "./StudentContext";
import api from "../api/api"; // Import file api client
import { useAuth } from "./AuthContext"; // Import useAuth để kiểm tra vai trò

// Component Provider (Chỉ export component này)
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const { isAuthenticated, userRole } = useAuth(); // Lấy thông tin auth

  // --- HÀM TẢI DỮ LIỆU TỪ API ---
  const fetchStudents = async () => {
    // Chỉ teacher mới có quyền tải danh sách
    if (userRole !== "teacher") {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/students");
      
      // Ánh xạ _id từ backend thành id để frontend (StudentList) dùng
      const mappedData = response.data.map(student => ({
        ...student,
        id: student._id // Gán giá trị của _id cho id
      }));
      
      setStudents(mappedData);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setStudents([]); // Đặt lại mảng rỗng nếu có lỗi
    }
    setLoading(false);
  };

  // --- TỰ ĐỘNG GỌI API KHI ĐĂNG NHẬP ---
  // Chạy hàm này khi component mount, hoặc khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (isAuthenticated && userRole === "teacher") {
      fetchStudents();
    } else {
      // Nếu logout hoặc không phải teacher, xóa danh sách
      setStudents([]);
    }
  }, [isAuthenticated, userRole]); // Phụ thuộc vào trạng thái đăng nhập

  // --- HÀM XỬ LÝ CRUD (Đã cập nhật) ---

  // Thêm sinh viên mới
  const addStudent = async (newStudentData) => {
    try {
      // newStudentData được gửi từ StudentFormModal
      await api.post("/students", newStudentData);
      fetchStudents(); // Tải lại danh sách sau khi thêm
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  // Cập nhật thông tin sinh viên
  const updateStudent = async (updatedStudent) => {
    try {
      // updatedStudent.id chính là _id
      await api.put(`/students/${updatedStudent.id}`, updatedStudent);
      fetchStudents(); // Tải lại danh sách sau khi cập nhật
    } catch (error) {
      console.error("Failed to update student:", error);
    }
  };

  // Xóa sinh viên
  const deleteStudent = async (studentId) => {
    try {
      await api.delete(`/students/${studentId}`);
      fetchStudents(); // Tải lại danh sách sau khi xóa
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  // Lấy thông tin sinh viên theo ID (hàm này không cần gọi API, chỉ tìm trong state)
  const getStudentById = (studentId) => {
    return students.find((s) => s.id === studentId);
  };

  // Giá trị Context cung cấp
  const contextValue = {
    students,
    loading, // Cung cấp state loading
    fetchStudents, // Cung cấp hàm fetch (nếu cần)
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
  };

  return (
    <StudentContext.Provider value={contextValue}>
      {children}
    </StudentContext.Provider>
  );
};