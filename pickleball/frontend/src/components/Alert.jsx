import React, { useState } from 'react';

// Định nghĩa các loại alert và màu sắc tương ứng
const alertStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    text: 'text-green-800',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    text: 'text-red-800',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-800',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zM11 9a1 1 0 00-2 0v2a1 1 0 002 0V9zm0 4a1 1 0 100 2 1 1 0 000-2z',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-800',
    icon: 'M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.895.553l.224.022a1 1 0 00.998-.668A1 1 0 0011 9V5zm0 8a1 1 0 100 2 1 1 0 000-2z',
  },
};

function Alert({ type = 'info', message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const styles = alertStyles[type] || alertStyles.info;

  return (
    <div
      className={`h-10 flex items-center ${styles.bg} ${styles.border} ${styles.text} border-l-4 p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out`}
      role="alert"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d={styles.icon} clipRule="evenodd" />
        </svg>
      </div>

      {/* Message */}
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>

      {/* Close button */}
      <button
        type="button"
        className="cursor-pointer ml-auto p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none"
        onClick={handleClose}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default Alert;