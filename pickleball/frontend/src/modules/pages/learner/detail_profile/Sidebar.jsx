import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {fetchUserById} from '../../../../api/admin/user';
import { useEffect,useState } from 'react';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome CSS for icons
const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = sessionStorage.getItem('id_user'); 
        const response = await fetchUserById(userId);
        if (response.status === 200) {
          console.log('User data:', response.data);
          setUser(response.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="w-72 h-screen bg-white my-5 p-0 shadow-lg flex flex-col relative">
      {/* Avatar + Camera */}
      <div className="flex flex-col pt-8 pb-4 relative">
        <div className="relative">
              <div className="ml-6 w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user?.urlavata ? (
                    <div
                    >
                      <img src={user.urlavata} alt="User avatar" className="w-24 h-24 cursor-pointer h-10 rounded-full object-cover mr-2"/>
                    </div>
                  ) : (
                    <div
                      className="w-24 h-24 bg-purple-700 cursor-pointer rounded-full flex items-center justify-center text-white cursor-pointer text-2xl font-bold"
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
              </div>
          <span className="absolute bottom-3 right-0 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></span>
        </div>
        <div className="mt-4 ml-6 text-2xl font-extrabold text-gray-900">{user?user.name:""}</div>
        <div className="mt-2 ml-6 font-bold text-base text-gray-500">N/R Rating</div>
        <div className="mt-1 ml-6 font-bold text-base font-semibold text-cyan-700 break-all">
          email: {user?user.email : 'N/A'}
        </div>
      </div>
    <nav className="flex flex-col gap-3 px-6 mt-6 flex-1">
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-cyan-600 text-white font-bold shadow-sm">
    <span onClick={() => navigate('/profile')} className="flex items-center" >
      <i className="fas fa-user mr-3"></i>
      Profile
    </span>
    <span onClick={() => navigate('/profile')} className="w-7 h-7 flex items-center justify-center rounded-full bg-white" >
      <i className="fas fa-user text-cyan-600"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span onClick={() => navigate('/profile')} className="flex items-center">
      <i className="fas fa-bell mr-3 text-cyan-600"></i>
      Alerts
    </span>
    <span onClick={() => navigate('/profile')} className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-bell text-white"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span onClick={() => navigate('/profile')} className="flex items-center">
      <i className="fas fa-balance-scale mr-3 text-cyan-600"></i>
      Courts
    </span>
    <span onClick={() => navigate('/profile')} className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-balance-scale text-white"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span onClick={() => navigate('/profile')} className="flex items-center">
      <i className="fas fa-calendar-alt mr-3 text-cyan-600"></i>
      Sessions
    </span>
    <span onClick={() => navigate('/profile')} className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-calendar-alt text-white"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span onClick={() => navigate('/profile')} className="flex items-center">
      <i className="fas fa-users mr-3 text-cyan-600"></i>
      Groups
    </span>
    <span onClick={() => navigate('/profile')} className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-users text-white"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span className="flex items-center">
      <i className="fas fa-list mr-3 text-cyan-600"></i>
      Lists
    </span>
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-list text-white"></i>
    </span>
  </a>
  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition">
    <span className="flex items-center">
      <i className="fas fa-credit-card mr-3 text-cyan-600"></i>
      Payments
    </span>
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-cyan-600">
      <i className="fas fa-credit-card text-white"></i>
    </span>
  </a>
</nav>
      {/* Log Out */}
      <a
        href="#"
        className="flex items-center gap-2 text-gray-400 font-bold px-6 pb-8 pt-4 mt-auto"
        style={{ letterSpacing: 0.5 }}
      >
        Log Out
        <i className="fas fa-sign-out-alt"></i>
      </a>
    </div>
  );
};

export default Sidebar;