import React, { useState } from "react";
// IMPORT StudentContext từ file mới
import { mockListStudents } from "../mock_data/mockListStudents";
import { StudentContext } from "./StudentContext";

// Component Provider (Chỉ export component này)
export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(mockListStudents);

  // --- HÀM XỬ LÝ CRUD ---
  // Thêm sinh viên mới
  const addStudent = (newStudent) => {
    const studentWithId = {
      ...newStudent,
      id: `s_${Date.now()}`,
      gpa: 0.0,
      status: "Active",
      joined_date: new Date().toISOString(),
    };
    setStudents((prevStudents) => [studentWithId, ...prevStudents]);
  };

  // Cập nhật thông tin sinh viên
  const updateStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  // Xóa sinh viên
  const deleteStudent = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s.id !== studentId)
    );
  };

  // Lấy thông tin sinh viên theo ID
  const getStudentById = (studentId) => {
    return students.find((s) => s.id === studentId);
  };

  // Giá trị Context cung cấp
  const contextValue = {
    students,
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
