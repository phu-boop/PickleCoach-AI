import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Button from './Button';
import {updateavata} from '../api/user/update';
import { Link, useNavigate } from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {fetchUserById} from '../api/admin/user';
import { useEffect, useState } from 'react';
function Header() {
  const [avata, setAvata] = useState(null);
  const [updateAvata, setUpdateAvata] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const Navigate = useNavigate();
  const handleProfile = () => {
    setIsOpen(!isOpen);
  }
  const handleUpdateAvata = async (data) => {
    console.log('Updating avatar with data:', data);
    try {
      const response = await updateavata(data);
      if (response.status === 200) {
        console.log('Avatar updated successfully');
        setUpdateAvata(false);
        Navigate('/');
      } else {
        console.error('Failed to update avatar');
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };
  useEffect(() => {
      const fetchUser = async () => {
        try {
          const userId = sessionStorage.getItem('id_user');
          const response = await fetchUserById(userId);
          if (response.status === 200) {
            console.log('User data:', response.data);
            setUser({
              userId: response.data.userId,
              name: response.data.name,
              email: response.data.email,
              role: response.data.role,
              urlavata: response.data.urlavata,
            });
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUser();
    }, []);
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
            onClick={() => Navigate('/review-coach')}

            className="h-9 px-3 cursor-pointer relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Coach
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </div>

          <a href="#" 
          onClick={() => Navigate('/organize')}
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Organize
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          onClick={() => Navigate('/earn')}
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Earn
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          onClick={() => Navigate('/learn')}ư
          className="h-9 px-3 relative flex items-center text-black after:content-[''] after:absolute after:left-0 after:-bottom-6 after:w-0 after:h-[9px] after:bg-[#2d93ad] hover:after:w-full after:rounded-[30px]">
            Learn
            <FontAwesomeIcon icon={faCaretDown} className="w-4 h-4 ml-1 text-[#2d93ad]" />
          </a>
          <a href="#" 
          onClick={() => Navigate('/gear')}
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
          :<></>
        }
        {
          (role=='ROLE_verifying')?
          <Button 
            className='bg-yellow-500 text-white'
            children={"waiting for verification"}
            onClick={()=>{Navigate('/verifying');}}
            >
          </Button>
          :<></>
        }
        {token ? (
          user?.urlavata ? (
            <div
              onClick={() => handleProfile()}
            >
              <img src={user.urlavata} alt="User avatar" className="w-10 cursor-pointer h-10 rounded-full object-cover mr-2"/>
            </div>
          ) : (
            <div
              onClick={() => handleProfile()}
              className="w-10 h-10 bg-purple-700 cursor-pointer rounded-full flex items-center justify-center text-white cursor-pointer text-2xl font-bold"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )
        ) : (
          <></>
        )}
      </div>
      
        {isOpen && token && (
          <div className="absolute right-5 top-16 bg-white shadow-lg border-[#288299] border-3 rounded-lg p-4 w-48">
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-gray-700 font-bold hover:text-[#696CFF] cursor-pointer">Profile</Link>
              </li>
              <li>
                <button  onClick={()=>{setUpdateAvata(true)}} className="text-gray-700 font-bold hover:text-[#696CFF] cursor-pointer">Update Avata</button>
              </li>
              <li>
                <button onClick={handleLogout} className="text-gray-700 font-bold hover:text-[#696CFF] cursor-pointer">Logout</button>
              </li>
            </ul>
          </div>
        )}
        
      {updateAvata && (
        <>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <input
              type="text"
              placeholder="Enter avatar link"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#696CFF] mb-4"
              onChange={(e) => setAvata(e.target.value)}
            />
            <button
              className="w-full bg-[#696CFF] text-white p-2 rounded-lg hover:bg-[#5558d3] transition duration-200 cursor-pointer"
              onClick={()=>{handleUpdateAvata({avata: avata, id: sessionStorage.getItem('id_user')})}}
            >
              Submit
            </button>
          </div>
        </div>
        <div className="absolute top-10 right-8">
          <button
              className="cursor-pointer flex items-center justify-center gap-1 px-[13px] py-[6px] bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645] transition-colors duration-300"
              onClick={()=>{setUpdateAvata(false)}}
          >
            Cancel
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        </>
      )}
      
    </header>
  );
}

export default Header;