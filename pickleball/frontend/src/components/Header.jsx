function Header() {
  return (
    <header className="bg-gray-100 text-black p-4 flex items-center justify-between">
      {/* Logo và Menu trong cùng một div */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <div className="flex items-center">
          <img src="../assets/images/logo-lockup.svg" alt="Pickleheads Logo" className="h-8" />
        </div>

        {/* Menu */}
        <nav className="flex space-x-6">
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-500">
            Play
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-500">
            Organize
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-500">
            Earn
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-500">
            Learn
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
          <a href="#" className="flex items-center text-gray-700 hover:text-blue-500">
            Gear
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </a>
        </nav>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-blue-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <button className="text-blue-500 hover:underline">Log in</button>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">
          Join for free
        </button>
      </div>
    </header>
  );
}

export default Header;