import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-70 flex items-center justify-center transition-opacity duration-300">
      {/* Modal Content */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 m-4 transform transition-transform duration-300 scale-100">
        {/* Icon cảnh báo */}
        <div className="flex justify-center mb-4">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-600" />
        </div>

        {/* Header */}
        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition w-full"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-md w-full"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
