import React, { useState } from "react";
import {
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  AcademicCapIcon, // Icon cho Bảng điểm
} from "@heroicons/react/24/outline";
import { useStudents } from "../context/StudentContext"; // SỬ DỤNG CONTEXT
import StudentFormModal from "./StudentFormModal";
import ConfirmationModal from "./ConfirmationModal";
import StudentViewModal from "./StudentViewModal";
import GradebookModal from "./GradebookModal"; // Import Modal Bảng điểm

// Component phụ StatusBadge (giữ nguyên)
const StatusBadge = ({ status }) => {
  let color = "";
  if (status === "Active") {
    color = "bg-green-100 text-green-800 border-green-300";
  } else if (status === "Inactive") {
    color = "bg-red-100 text-red-800 border-red-300";
  } else {
    // Mặc định cho "Graduated"
    color = "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${color}`}
    >
      {status}
    </span>
  );
};

const StudentList = () => {
  // Lấy state và hàm xử lý từ Context (thêm 'fetchStudents')
  const { students, deleteStudent, getStudentById, loading, fetchStudents } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");
  // State cho các modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Thêm/Sửa
  const [editingStudent, setEditingStudent] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Modal Xác nhận Xóa
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // Modal Xem chi tiết
  const [studentToView, setStudentToView] = useState(null);

  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false); // Modal Bảng điểm
  const [studentForGrades, setStudentForGrades] = useState(null);


  // --- HÀM XỬ LÝ UI VÀ CRUD ---

  // Mở Modal Thêm mới
  const handleAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  // Mở Modal Sửa
  const handleEdit = (studentId) => {
    const student = getStudentById(studentId); // 'id' là '_id' đã được map
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
      deleteStudent(studentToDelete.id); // 'id' là '_id'
    }
    setIsConfirmOpen(false);
    setStudentToDelete(null);
  };

  // Mở Modal Xem chi tiết
  const handleViewDetails = (student) => {
    setStudentToView(student);
    setIsViewModalOpen(true);
  };

  // Mở Modal Bảng điểm
  const handleOpenGrades = (student) => {
    setStudentForGrades(student);
    setIsGradeModalOpen(true);
  };

  // Đóng Modal Bảng điểm (và làm mới danh sách)
  const handleCloseGrades = () => {
    setIsGradeModalOpen(false);
    fetchStudents(); // Tải lại danh sách để cập nhật GPA mới
  };

  // Lọc dữ liệu (dùng camelCase)
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) // Tìm theo studentId
  );

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
            {/* Xử lý loading */}
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Đang tải danh sách sinh viên...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              // Xử lý không có dữ liệu
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500">
                  Không tìm thấy sinh viên nào.
                </td>
              </tr>
            ) : (
              // Hiển thị dữ liệu
              filteredStudents.map((student) => (
                <tr
                  key={student.id} // 'id' là '_id' đã được map
                  className="hover:bg-blue-50 transition-colors duration-150"
                >
                  {/* Tên & Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {student.name}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {student.user?.email || "N/A"}
                    </div>
                  </td>

                  {/* Mã SV / Chuyên ngành */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-medium">
                      {student.studentId} {/* Dùng camelCase */}
                    </div>
                    <div className="text-xs text-gray-500">{student.major}</div>
                  </td>

                  {/* GPA */}
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-extrabold"
                    style={{
                      color:
                        student.gpa >= 3.5 ? "#10B981" // Xanh lá
                          : student.gpa >= 2.5 ? "#3B82F6" // Xanh dương
                            : "#F59E0B", // Vàng (Dưới 2.5)
                    }}
                  >
                    {student.gpa.toFixed(2)}
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.status} />
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1">
                      {/* Bảng điểm */}
                      <button
                        onClick={() => handleOpenGrades(student)}
                        className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors duration-150"
                        title="Bảng điểm"
                      >
                        <AcademicCapIcon className="h-5 w-5" />
                      </button>
                      {/* Xem Chi tiết */}
                      <button
                        onClick={() => handleViewDetails(student)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors duration-150"
                        title="Xem chi tiết"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {/* Sửa */}
                      <button
                        onClick={() => handleEdit(student.id)}
                        className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-100 transition-colors duration-150"
                        title="Sửa"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {/* Xóa */}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM/SỬA */}
      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingStudent={editingStudent}
      />

      {/* MODAL XÁC NHẬN XÓA */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận Xóa Sinh viên"
        message={
          studentToDelete
            ? `Bạn có chắc chắn muốn xóa sinh viên ${studentToDelete.name} (${studentToDelete.studentId}) không? Hành động này không thể hoàn tác.`
            : "Bạn có chắc chắn muốn thực hiện hành động này không?"
        }
      />

      {/* MODAL XEM CHI TIẾT */}
      <StudentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        student={studentToView}
      />

      {/* MODAL BẢNG ĐIỂM */}
      <GradebookModal
        isOpen={isGradeModalOpen}
        onClose={handleCloseGrades} // Dùng hàm đóng có làm mới
        student={studentForGrades}
      />
    </div>
  );
};

export default StudentList;