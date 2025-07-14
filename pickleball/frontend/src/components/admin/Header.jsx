import React from 'react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 mt-7 mx-7 bg-white shadow rounded-lg">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Star Button and Avatar */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          <span className="mr-1">★</span>
          <span>1,117</span>
        </button>
        <img
          src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/avatars/1.png" 
          alt="Avatar"
          className="w-10 h-10 rounded-full "
        />
      </div>
    </header>
  );
};

export default Header;