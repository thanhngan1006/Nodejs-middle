import React, { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import api from "../api/api"; // Import file api client

const GradebookModal = ({ isOpen, onClose, student }) => {
  const [grades, setGrades] = useState([]); // Khởi tạo là mảng rỗng
  const [loading, setLoading] = useState(true); // Khởi tạo loading là true
  const [error, setError] = useState("");

  // State cho form thêm điểm
  const [subjectName, setSubjectName] = useState("");
  const [score, setScore] = useState("");

  // Hàm helper để tải danh sách điểm
  const fetchGrades = async () => {
    if (!student) {
      setLoading(false);
      return; // Không chạy nếu không có student
    }

    setLoading(true); // Đặt loading trước khi gọi
    setError("");
    try {
      // 1. GỌI API TỪ GRADE-SERVICE
      const response = await api.get(`/api/grades/student/${student.id}`);

      // 2. Đảm bảo response data là một mảng
      if (Array.isArray(response.data)) {
        setGrades(response.data);
      } else {
        setGrades([]); // Nếu API trả về (null, object,...) -> đặt là mảng rỗng
      }
    } catch (err) {
      setError("Không thể tải bảng điểm.");
      setGrades([]); // Đặt lại grades là mảng rỗng khi có lỗi
      console.error(err);
    }
    setLoading(false); // Đặt loading false sau khi hoàn tất
  };

  // Tải điểm khi modal được mở
  useEffect(() => {
    if (isOpen) {
      fetchGrades();
    } else {
      // Reset state khi modal đóng
      setGrades([]);
      setLoading(true);
      setError("");
      setSubjectName("");
      setScore("");
    }
  }, [isOpen, student]); // Chạy lại khi 'isOpen' hoặc 'student' thay đổi

  // Hàm xử lý khi thêm điểm mới
  const handleAddGrade = async (e) => {
    e.preventDefault();
    setError("");

    // Validate
    const numScore = parseFloat(score);
    if (!subjectName || isNaN(numScore) || numScore < 0 || numScore > 10) {
      setError("Tên môn học không hợp lệ hoặc điểm phải từ 0 đến 10.");
      return;
    }

    try {
      // 2. GỌI API POST ĐỂ THÊM ĐIỂM
      await api.post("/grades", { // Bỏ /api đi
        studentId: student.id,
        subjectName: subjectName,
        score: numScore,
      });

      // Xóa form và tải lại danh sách điểm
      setSubjectName("");
      setScore("");
      fetchGrades(); // Tải lại để hiển thị điểm mới
    } catch (err) {
      setError("Thêm điểm thất bại.");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            Bảng điểm: {student?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form Thêm Điểm Mới */}
        <form
          onSubmit={handleAddGrade}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-semibold text-lg text-gray-800">
              Thêm điểm mới
            </h3>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Tên môn học
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Ví dụ: Lập trình Web"
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              Điểm (Thang 10)
            </label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="0-10"
              min="0"
              max="10"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-lg mt-1"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg flex items-center justify-center font-semibold"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Thêm
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm col-span-1 md:col-span-3">
              {error}
            </p>
          )}
        </form>

        {/* Danh sách điểm hiện có */}
        <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
          {loading && (
            <p className="text-center text-gray-500">Đang tải bảng điểm...</p>
          )}
          {!loading && grades.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Sinh viên này chưa có điểm nào.
            </p>
          )}
          {!loading &&
            grades.map((grade) => (
              <div
                key={grade._id}
                className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {grade.subjectName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ngày nhập:{" "}
                    {new Date(grade.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <p className="text-lg font-bold text-blue-700">
                  {grade.score.toFixed(1)}
                </p>
                {/* // Tùy chọn: Thêm nút xóa
                <button onClick={() => handleDeleteGrade(grade._id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="h-5 w-5" />
                </button>
                */}
              </div>
            ))}
        </div>

        {/* Nút Đóng */}
        <div className="pt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradebookModal;