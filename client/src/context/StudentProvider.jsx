import React, { useState } from "react";
import { mockListStudents } from "../mock_data/mockListStudents";
import { StudentContext } from "./StudentContext";

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(mockListStudents);

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

  const updateStudent = (updatedStudent) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const deleteStudent = (studentId) => {
    setStudents((prevStudents) =>
      prevStudents.filter((s) => s.id !== studentId)
    );
  };

  const getStudentById = (studentId) => {
    return students.find((s) => s.id === studentId);
  };

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
