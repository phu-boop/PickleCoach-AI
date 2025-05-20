function Footer() {
  return (
    <footer className="bg-[#2d93ad] text-white py-6">
      <div className="container mx-auto px-4 justify-between items-center">
        {/* Logo và App Download */}
        <div className="flex items-center md:items-start mb-4 md:mb-0">
          <img src="your-logo-url-here" alt="Pickleheads Logo" className="h-10 mb-2" />
          <div className="bg-white text-teal-600 px-4 py-2 rounded-lg flex items-center space-x-2">
            <span>Download the mobile app:</span>
            <a href="#" className="hover:opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/App_Store_%28iOS%29.svg" alt="App Store" className="h-6" />
            </a>
            <a href="#" className="hover:opacity-80">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-6" />
            </a>
          </div>
        </div>

        {/* Menu Columns */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 text-center md:text-left">
          {/* Pickleheads Column */}
          <div>
            <h3 className="font-bold mb-2">Pickleheads</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-200">Add a Court</a></li>
              <li><a href="#" className="hover:text-gray-200">We're Hiring!</a></li>
              <li><a href="#" className="hover:text-gray-200">Get Help</a></li>
              <li><a href="#" className="hover:text-gray-200">About Us</a></li>
            </ul>
          </div>

          {/* Learn Column */}
          <div>
            <h3 className="font-bold mb-2">Learn</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-200">How to Play</a></li>
              <li><a href="#" className="hover:text-gray-200">Video Clinic</a></li>
              <li><a href="#" className="hover:text-gray-200">Rating Quiz</a></li>
              <li><a href="#" className="hover:text-gray-200">All Blog Posts</a></li>
            </ul>
          </div>

          {/* Reviews Column */}
          <div>
            <h3 className="font-bold mb-2">Reviews</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-200">Paddle Quiz</a></li>
              <li><a href="#" className="hover:text-gray-200">Pickleball Paddles</a></li>
              <li><a href="#" className="hover:text-gray-200">Pickleball Nets</a></li>
              <li><a href="#" className="hover:text-gray-200">Pickleball Balls</a></li>
            </ul>
          </div>

          {/* Organize Column */}
          <div>
            <h3 className="font-bold mb-2">Organize</h3>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-gray-200">Schedule Play</a></li>
              <li><a href="#" className="hover:text-gray-200">Manage Groups</a></li>
              <li><a href="#" className="hover:text-gray-200">Find Players</a></li>
              <li><a href="#" className="hover:text-gray-200">Run a Round Robin</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Media and Legal Links */}
      <div className="container mx-auto px-4 mt-6 flex flex-col items-center space-y-4">
        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <a href="#" className="hover:opacity-80"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-6" /></a>
          <a href="#" className="hover:opacity-80"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-6" /></a>
          <a href="#" className="hover:opacity-80"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/TikTok_logo.svg" alt="TikTok" className="h-6" /></a>
          <a href="#" className="hover:opacity-80"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" alt="X" className="h-6" /></a>
          <a href="#" className="hover:opacity-80"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Play_Button.svg" alt="YouTube" className="h-6" /></a>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center space-x-4 text-sm">
          <a href="#" className="hover:text-gray-200">Accessibility</a>
          <a href="#" className="hover:text-gray-200">Terms of Use</a>
          <a href="#" className="hover:text-gray-200">Privacy Policy</a>
          <a href="#" className="hover:text-gray-200">Cookie Policy</a>
          <a href="#" className="hover:text-gray-200">Payment Terms</a>
          <a href="#" className="hover:text-gray-200">Refund Policy</a>
          <a href="#" className="hover:text-gray-200">Community Guidelines</a>
          <a href="#" className="hover:text-gray-200">Consent Preferences</a>
          <a href="#" className="hover:text-gray-200">Do Not Sell or Share My Personal Information</a>
        </div>

        {/* Copyright */}
        <p className="text-sm">Pickleheads© © 2025 Dink Technologies, Inc.</p>
      </div>
    </footer>
  );
}

export default Footer;