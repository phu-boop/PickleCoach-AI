import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faInstagram,
  faTiktok,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';

function Footer() {
  return (
    <footer className="bg-[#2d93ad] text-white py-1">
      <div className="container-main">
        <div className="container mx-auto px-4 justify-between items-center">
          {/* Logo và App Download */}
          <div className="flex justify-between mt-13 items-center ">
            <img src="https://www.pickleheads.com/assets/logo-lockup.svg" alt="Pickleheads Logo" className="h-28 mb-2" />
            <div className="bg-[#3dacce] text-[#0a0b3d] p-4 rounded-lg flex items-center space-x-7 font-bold text-xl">
              <span>Download the mobile app:</span>
              <a href="#" className="hover:opacity-80">
                <img src="https://www.pickleheads.com/images/app-stores/app-store-indigo.svg" alt="App Store" className="h-12" />
              </a>
              <a href="#" className="hover:opacity-80">
                <img src="https://www.pickleheads.com/images/app-stores/google-play-indigo.svg" alt="Google Play" className="h-12" />
              </a>
            </div>
          </div>
          <div className=" pt-13 pb-3">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-left font-[var(--font-primary)] text-[16px]">
            {/* Pickleheads */}
            <div>
              <h3 className="font-bold mb-5 text-xl">Pickleheads</h3>
              <ul className="space-y-5 text-lg">
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Add a Court</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">We’re Hiring!</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Get Help</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">About Us</a></li>
              </ul>
            </div>

            {/* Learn */}
            <div className="border-l border-dotted border-white pl-6">
              <h3 className="font-bold mb-5 text-xl">Learn</h3>
              <ul className="space-y-5 text-lg">
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">How to Play</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Video Clinic</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Rating Quiz</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">All Blog Posts</a></li>
              </ul>
            </div>

            {/* Reviews */}
            <div className="border-l border-dotted border-white pl-6">
              <h3 className="font-bold mb-5 text-xl">Reviews</h3>
              <ul className="space-y-5 text-lg">
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Paddle Quiz</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Pickleball Paddles</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Pickleball Nets</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Pickleball Balls</a></li>
              </ul>
            </div>

            {/* Organize */}
            <div className="border-l border-dotted border-white pl-6">
              <h3 className="font-bold mb-5 text-xl">Organize</h3>
              <ul className="space-y-5 text-lg">
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Schedule Play</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Manage Groups</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Find Players</a></li>
                <li><a href="#" className="hover:underline hover:text-[#3dacce]">Run a Round Robin</a></li>
              </ul>
            </div>
          </div>
        </div>
        </div>
        {/* Social Media and Legal Links */}
        <div className="container mx-auto px-4 flex flex-col items-center space-y-4">
          {/* Social Media Icons */}
          <div className="flex justify-center items-center gap-6 py-8">
            <div className="flex items-center justify-center space-x-6">
              {/* Facebook */}
              <a href="#" className="bg-[#0c0c3f] w-14 h-14 flex items-center justify-center rounded-full hover:opacity-80 transition">
                <FontAwesomeIcon icon={faFacebookF} className="text-[#49cfff] text-2xl" />
              </a>

              {/* Instagram */}
              <a href="#" className="bg-[#0c0c3f] w-14 h-14 flex items-center justify-center rounded-full hover:opacity-80 transition">
                <FontAwesomeIcon icon={faInstagram} className="text-[#49cfff] text-2xl" />
              </a>

              {/* TikTok */}
              <a href="#" className="bg-[#0c0c3f] w-14 h-14 flex items-center justify-center rounded-full hover:opacity-80 transition">
                <FontAwesomeIcon icon={faTiktok} className="text-[#49cfff] text-2xl" />
              </a>

              {/* X (Twitter) */}
              <a href="#" className="bg-[#0c0c3f] w-14 h-14 flex items-center justify-center rounded-full hover:opacity-80 transition">
                <FontAwesomeIcon icon={faXTwitter} className="text-[#49cfff] text-2xl" />
              </a>

              {/* YouTube */}
              <a href="#" className="bg-[#0c0c3f] w-14 h-14 flex items-center justify-center rounded-full hover:opacity-80 transition">
                <FontAwesomeIcon icon={faYoutube} className="text-[#49cfff] text-2xl" />
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-white text-base font-medium">
            <a href="#" className="flex items-center space-x-1 hover:underline">
              <FontAwesomeIcon icon={faUniversalAccess} />
              <span>Accessibility</span>
            </a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Terms of Use</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Privacy Policy</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Cookie Policy</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Payment Terms</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Refund Policy</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Community Guidelines</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Consent Preferences</a>
            <span className="text-white/40">|</span>

            <a href="#" className="hover:underline">Do Not Sell or Share My Personal Information</a>
          </div>
          {/* Copyright */}
          <p className="text-base font-bold pb-10">Pickleheads© © 2025 Dink Technologies, Inc.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;