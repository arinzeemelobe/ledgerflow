import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, invoiceNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-2 rounded-full">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold">Confirm Deletion</h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete invoice <span className="font-bold">#{invoiceNumber}</span>? 
          This action cannot be undone.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
