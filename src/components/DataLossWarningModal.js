import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DataLossWarningModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-3">Unsaved Changes Warning</h3>
        <p className="text-gray-700 mb-6">
          Navigating back will clear your progress in the current and subsequent steps. Are you sure you want to proceed?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataLossWarningModal;
