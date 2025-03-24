// src/Components/Modal.js
import React from 'react';

const Modal = ({ title, content, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 ">
      <div className="bg-white rounded-lg w-11/12 max-w-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>

        {/* Scrollable Content Container */}
        <div className="max-h-96 overflow-y-auto mb-4">
          <p className="text-gray-700">{content}</p>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
