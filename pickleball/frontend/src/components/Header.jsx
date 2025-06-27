import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
function Header() {
  const Navigate = useNavigate();
  const { token, logout, role } = useAuth();
  const handleLogout = () => {
    logout();
    Navigate('/login');
  };
  return (
    <header className="bg-while text-black p-4 flex items-center justify-between shadow-lg">
      {/* Logo và Menu trong cùng một div */}
      <div className="flex items-center space-x-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
        <div className="flex items-center">
          <img src="https://www.pickleheads.com/assets/logo-lockup.svg" alt="Pickleheads Logo" className="w-50" />
        </div>
        </Link>
        <p className="border-l-2 border-gray-300 h-10"></p>
        {/* Menu */}
        <nav className="flex space-x-5 font-bold text-lg">
          <div
            onClick={() => Navigate('/learner_CoachBookingPage')}

            className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Play
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </div>

          <a href="#" 
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Organize
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Earn
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Learn
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Gear
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
        </nav>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-6">
        <button className="w-10 h-10 flex items-center justify-center bg-[#2d93ad]      rounded-full hover:bg-[#227e96] cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
        <p className="border-l-2 border-gray-300 h-10"></p>
        {(token) ? 
          <button onClick={()=>{handleLogout()}} className="text-black font-bold text-lg cursor-pointer ">Log out</button> : 
          <button onClick={()=>{Navigate('/login')}} className="text-black font-bold text-lg cursor-pointer ">Log in</button>
        } 
        {(role=='ROLE_learner')?
            <Button 
            children={"Course"}
            onClick={()=>{Navigate('/learner');}}
            >
            </Button>
            :
            <Button 
            children={"Learn for free"}
            onClick={()=>{Navigate('/input-assessment');}}
            >
            </Button>
        }
        {(role=='ROLE_USER')?
          <Button 
            children={"You are a coach"}
            onClick={()=>{Navigate('/coach_register');}}
            >
            </Button>
          :<div></div>
        }
        {
          (role=='ROLE_verifying')?
          <Button 
            className='bg-yellow-500 text-white'
            children={"waiting for verification"}
            onClick={()=>{Navigate('/verifying');}}
            >
          </Button>
          :<div></div>
        }
      </div>
    </header>
  );
}

export default Header;