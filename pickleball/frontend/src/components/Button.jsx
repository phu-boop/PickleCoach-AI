import React from 'react';

const Button = ({ children, onClick, className = '', type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#ea6645] font-[var(--font-primary)] font-extrabold text-[16px] text-white py-2 px-3 rounded-full transition-all duration-300 hover:bg-gradient-to-b hover:from-[#ea6645] hover:to-[#8e3e29] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
