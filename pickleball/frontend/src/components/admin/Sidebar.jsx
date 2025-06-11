import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, User, GraduationCap, Calendar, FileQuestion   } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../Button';
const Sidebar = () => {
  const { logout, token } = useAuth();
  const [activeMenu, setActiveMenu] = useState('Dashboards');
  const navigate = useNavigate();
  useEffect(() => {
  if (token === null) {
    navigate('/login');
  }
  }, [token]);
  const menuItems = [
    {
      title: 'Dashboards',
      icon: <Store className="w-7 h-7" />,
      count: 5,
      submenu: [],
    },
    {
      title: 'Tests',
      icon: <FileQuestion className="w-7 h-7" />,
      submenu: [],
    },
    {
      title: 'Users',
      icon: <User className="w-7 h-7" />,
      submenu: [],
    },
    {
      title: 'Learners',
      icon: <GraduationCap className="w-7 h-7" />,
      submenu: [],
    },
    {
      title: 'courses',
      icon: <Calendar className="w-7 h-7" />,
      submenu: [],
    },
    {
      title: 'lessons',
      icon: <GraduationCap className="w-7 h-7" />,
      pro: true,
      submenu: [],
    },
    {
      title: 'learner-progress',
      icon: <GraduationCap className="w-7 h-7" />,
      pro: true,
      submenu: [],
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-lg p-4 ">
      <div className="flex items-center mb-6">
        <Link to="/admin">
        <span className="text-2xl font-bold text-purple-600">
          <img className="max-w-[80%] mt-8 mb-3 mx-auto" src="https://www.pickleheads.com/assets/logo-lockup.svg" alt="Sneat Logo" />
        </span>
        </Link>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <div key={item.title}>
            <button
              onClick={() => navigate('/admin/'+item.title)
                || setActiveMenu(item.title)
              }
              className={`w-full flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg mt-2 cursor-pointer ${
                activeMenu === item.title ? 'bg-gray-200' : ''
              }`}
            >
              <span className="mr-2 text-xl">{item.icon}</span>
              <span className="flex-1 text-left">{item.title}</span>
              {item.count && (
                <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                  {item.count}
                </span>
              )}
              {item.pro && (
                <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 rounded-full">
                  PRO
                </span>
              )}
              {item.submenu.length > 0 && (
                <span className="ml-auto">▼</span>
              )}
            </button>
            {activeMenu === item.title && item.submenu.length > 0 && (
              <div className="ml-6 mt-2 space-y-1">
                {item.submenu.map((sub) => (
                  <div key={sub.name} className="flex items-center">
                    <span className="text-gray-600 text-sm">{sub.name}</span>
                    {sub.pro && (
                      <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      { token && (
        <Button
          className="mt-6 w-full"
          onClick={ () => {
            logout();
          }}
        >
          Log out 
        </Button>
      )
      }
    </aside>
  );
};

export default Sidebar;