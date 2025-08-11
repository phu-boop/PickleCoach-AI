import React from 'react';

const Footer = () => {
  return (
    <footer className=" text-gray-600 p-4 text-center mb-7 mx-7 ">
      <div className="flex justify-center space-x-4">
        <span>© 2025, made with ❤️ by ThemeSelection</span>
        <a href="#" className="text-purple-600 hover:underline">Admin Templates</a>
        <a href="#" className="text-purple-600 hover:underline">License</a>
        <a href="#" className="text-purple-600 hover:underline">Bootstrap Dashboard</a>
        <a href="#" className="text-purple-600 hover:underline">Documentation</a>
        <a href="#" className="text-purple-600 hover:underline">Support</a>
      </div>
    </footer>
  );
};

export default Footer;