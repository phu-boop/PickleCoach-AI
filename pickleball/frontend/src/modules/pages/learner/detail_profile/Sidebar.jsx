import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchUserById } from "../../../../api/admin/user";
import { updateavata } from "../../../../api/user/update";
import "font-awesome/css/font-awesome.min.css";
import { Navigate } from "react-router-dom";
const Sidebar = () => {
  const [avata, setAvata] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [updateAvata, setUpdateAvata] = useState(false);

  const isActive = (path) => location.pathname === path;
  const handleUpdateAvata = async (data) => {
    try {
      const response = await updateavata(data);
      if (response.status === 200) {
        setUpdateAvata(false);
        navigate("/");
      } else {
        console.error("Failed to update avatar");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = sessionStorage.getItem("id_user");
        const response = await fetchUserById(userId);
        if (response.status === 200) {
          setUser(response.data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const role = sessionStorage.getItem('role');

const menuItems = [
  { label: "Profile", icon: "fa-user", path: "/profile" },
  { label: "Alerts", icon: "fa-bell", path: "/alert" },
  { label: "Courts", icon: "fa-balance-scale", path: "/courts" },
  { label: "Schedule", icon: "fa-calendar", path: "/schedule" },
  ...(role === 'ROLE_coach'
    ? [{ label: "ListLearner", icon: "fa-users", path: "/ListLearner" }]
    : [{ label: "Groups", icon: "fa-users", path: "/groups" }]
  ),
  { label: "DebtList", icon: "fa-money", path: "/debtList" },
  { label: "Payments", icon: "fa-credit-card", path: "/payments" },
];

  return (
  <div>
    <div className="">
      <div className="w-72 h-screen bg-white my-5 shadow-lg flex flex-col relative mb-30">
        {/* Avatar + Info */}
        <div className="flex flex-col pt-8 pb-5 relative">
          <div className="relative">
            <div className="ml-6 w-24 h-24 rounded-full flex items-center justify-center">
              {user?.urlavata ? (
                <img
                  src={user.urlavata}
                  alt="User avatar"
                  className="w-24 h-24 cursor-pointer rounded-full object-cover"
                  onClick={() => setUpdateAvata(true)}
                />
              ) : (
                <div
                  onClick={() => setUpdateAvata(true)}
                  className="w-24 h-24 bg-purple-700 cursor-pointer rounded-full flex items-center justify-center text-white text-2xl font-bold"
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <span className="absolute bottom-3 right-0 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></span>
          </div>
          <div className="mt-4 ml-6 text-2xl font-extrabold text-gray-900">
            {user ? user.name : ""}
          </div>
          <div className="mt-2 ml-6 font-bold text-base text-gray-500">N/R Rating</div>
          <div className="mt-1 ml-6 text-cyan-700 font-semibold break-all">
            email: {user ? user.email : "N/A"}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 px-6 mt-6 flex-1">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between p-3 rounded-lg font-semibold transition
                ${
                  isActive(item.path)
                    ? "bg-[#2d93ad] text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-cyan-50"
                }
              `}
            >
              <span className="flex items-center">{item.label}</span>
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full 
                  ${
                    isActive(item.path)
                      ? "bg-white text-[#2d93ad]"
                      : "bg-[#2d93ad] text-white"
                  }
                `}
              >
                <i className={`fa ${item.icon}`}></i>
              </span>
            </a>
          ))}
        </nav>

        {/* Logout */}
        <a
          href="#"
          className="flex items-center gap-2 text-gray-400 font-bold px-6 pb-8 pt-4 mt-auto"
          onClick={() => navigate("/logout")}
        >
          Log Out
          <i className="fas fa-sign-out-alt"></i>
        </a>
      </div>

      {/* Avatar Modal */}
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
                className="w-full bg-[#696CFF] text-white p-2 rounded-lg hover:bg-[#5558d3] transition"
                onClick={() =>
                  handleUpdateAvata({
                    avata: avata,
                    id: sessionStorage.getItem("id_user"),
                  })
                }
              >
                Submit
              </button>
            </div>
          </div>
          <div className="absolute top-10 right-8">
            <button
              className="cursor-pointer flex items-center justify-center gap-1 px-[13px] py-[6px] bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645]"
              onClick={() => setUpdateAvata(false)}
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
    </div>
    {
          sessionStorage.getItem('role') === 'ROLE_coach' && ( 
          <div className="flex absolute gap-4 bottom-[-255px]">
            <button onClick={()=>{navigate(`/Detail_coach/${sessionStorage.getItem('id_user')}`)}} className="bg-[#696cff] hover:bg-[#4445a0] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
              Manage Schedule
            </button>
            
            {(location.pathname==='/ListLearner')?(<></>):<><button onClick={()=>{navigate('/profile')}} className="bg-[#3dacce] hover:bg-[#3a849b] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
              Update Profile
            </button>
            <button onClick={()=>{navigate('/coach')}} className="bg-[#82e14f] hover:bg-[#548f35] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
              View Reports
            </button>
            </>
            }
            
          </div>
          )
        }
  </div>
  );
};

export default Sidebar;
