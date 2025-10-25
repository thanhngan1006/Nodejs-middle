import React, { useState } from "react";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useStudents } from "../context/StudentContext";
import StudentFormModal from "./StudentFormModal";
import ConfirmationModal from "./ConfirmationModal";
import StudentDetailModal from "./StudentDetailModal";
import StatusBadge from "../components/StatusBadge";

const StudentList = () => {
  const { students, deleteStudent, getStudentById } = useStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);

  // --- HÀM XỬ LÝ UI VÀ CRUD ---

  // Mở Modal Thêm mới
  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // Mở Modal Sửa
  const handleEdit = (studentId) => {
    const student = getStudentById(studentId);
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  // Mở Modal Xác nhận Xóa
  const handleDeleteConfirm = (studentId) => {
    const student = getStudentById(studentId);
    setStudentToDelete(student);
    setIsConfirmOpen(true);
  };

  // Thực hiện Xóa
  const handleDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
    }
    setIsConfirmOpen(false);
    setStudentToDelete(null);
  };

  // Mở Modal Xem Chi tiết
  const handleViewDetails = (studentId) => {
    const student = getStudentById(studentId);
    setViewingStudent(student);
  };

  // Lọc dữ liệu
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.includes(searchTerm)
  );

  // Hàm đóng Modal chi tiết
  const closeDetailModal = () => setViewingStudent(null);

  // Hàm đóng Modal Thêm/Sửa
  const closeFormModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* HEADER VÀ BUTTON THÊM MỚI */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Danh sách Sinh viên 🎓
        </h1>
        <button
          onClick={handleAdd}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Sinh viên
        </button>
      </div>

      {/* TÌM KIẾM */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên hoặc Mã số sinh viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-xl shadow-inner focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3 transition-all duration-200"
        />
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="shadow-2xl overflow-hidden border border-gray-200 rounded-xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {/* Cập nhật style header để đẹp hơn */}
              {["Họ và Tên", "Mã SV / Chuyên ngành", "GPA", "Trạng thái"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-bold text-blue-800 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
              <th className="px-6 py-3 text-right text-xs font-bold text-blue-800 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              >
                {/* Tên */}
                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={() => handleViewDetails(student.id)}
                >
                  <div className="text-sm font-semibold text-gray-900">
                    {student.name}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {student.email}
                  </div>
                </td>

                {/* Mã SV / Chuyên ngành */}
                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={() => handleViewDetails(student.id)}
                >
                  <div className="text-sm text-gray-700 font-medium">
                    {student.student_id}
                  </div>
                  <div className="text-xs text-gray-500">{student.major}</div>
                </td>

                {/* GPA */}
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-extrabold"
                  style={{
                    color:
                      student.gpa >= 3.5
                        ? "#10B981"
                        : student.gpa >= 3.0
                        ? "#3B82F6"
                        : "#F59E0B",
                  }}
                  onClick={() => handleViewDetails(student.id)}
                >
                  {student.gpa.toFixed(2)}
                </td>

                <td
                  className="px-6 py-4 whitespace-nowrap"
                  onClick={() => handleViewDetails(student.id)}
                >
                  <StatusBadge status={student.status} />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewDetails(student.id)}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors duration-150"
                      title="Xem chi tiết"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(student.id)}
                      className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-100 transition-colors duration-150"
                      title="Sửa"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(student.id)}
                      className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors duration-150"
                      title="Xóa"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white">
            Không tìm thấy sinh viên nào phù hợp với tìm kiếm.
          </div>
        )}
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={closeFormModal}
        editingStudent={editingStudent}
      />

      <StudentDetailModal student={viewingStudent} onClose={closeDetailModal} />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận Xóa Sinh viên"
        message={
          studentToDelete
            ? `Bạn có chắc chắn muốn xóa sinh viên ${studentToDelete.name} (${studentToDelete.student_id}) không? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn thực hiện hành động này không?"
        }
      />
    </div>
  );
};

export default StudentList;
