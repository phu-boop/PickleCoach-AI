import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { fetchUserById } from "../../../../api/admin/user";
import { useNavigate } from "react-router-dom";

const ProfileDetails = () => {
  const navigate = useNavigate(); // Sửa lỗi chính tả từ 'navegative' thành 'navigate'
  const [user, setUser] = useState({
    userId: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = sessionStorage.getItem("id_user");
        const response = await fetchUserById(userId);
        if (response.status === 200) {
          console.log("User data:", response.data);
          setUser({
            userId: response.data.userId,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role,
            urlavata: response.data.urlavata,
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
        {/* Sidebar - Đã được cập nhật bên trong */}
        <div className="">
        <Sidebar />
        </div>
        <div className="p-6 flex-1 bg-white rounded-lg">
          <div className="flex gap-4 mb-6">
            <img
              className="rounded-xl"
              src="https://tse2.mm.bing.net/th/id/OIP.9tqEUMM5Ng_G27YF0y4cEAHaDH?pid=Api&P=0&h=220"
              alt=""
            />
            <img
              className="rounded-xl"
              src="https://tse4.mm.bing.net/th/id/OIP.6E6VEkI2hWmopK4En_eHeQHaEH?pid=Api&P=0&h=220"
              alt=""
            />
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-teal-700 mb-4">Details</h2>
            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">Gender</label>
              <select className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Unspecified</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="block text-gray-600 font-bold mb-2">Profile</label>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                  {user?.urlavata ? (
                    <div>
                      <img
                        src={user.urlavata}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full object-cover mr-2"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <span className="text-gray-800 font-bold">
                  {user.name || "36 Anh phú"}
                </span>
              </div>
              <button
                onClick={() => navigate("/profile")} // Thêm điều hướng khi click "Update profile"
                className="text-teal-600 font-bold hover:underline"
              >
                Update profile
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Email addresses
              </label>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-bold">
                  {user.email || "phudz2502005@gmail.com"}
                </span>
                <span className="text-teal-600 bg-gray-100 px-2 py-1 rounded font-bold">
                  Primary
                </span>
                <button className="text-teal-600 font-bold hover:underline">
                  + Add email address
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 font-bold mb-2">
                Phone numbers
              </label>
              <button className="text-teal-600 font-bold hover:underline">
                + Add phone number
              </button>
            </div>
            <div>
              <label className="block text-gray-600 font-bold mb-2">
                Connected accounts
              </label>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-800 font-bold">
                  <img
                    src="https://www.google.com/s2/favicons?domain=google.com"
                    alt="Google"
                    className="w-8 h-8 mr-2"
                  />
                  Google - {user.email || "phudz2502005@gmail.com"}
                </span>
                <button className="text-teal-600 font-bold hover:underline">
                  + Connect account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      {sessionStorage.getItem("role") === "ROLE_coach" && (
        <div className="flex flex-wrap gap-4 ml-40 mb-12 mt-20"> {/* Sửa mb-30 thành mb-12 */}
          <button
            onClick={() =>
              navigate(`/Detail_coach/${sessionStorage.getItem("id_user")}`)
            }
            className="bg-[#696cff] hover:bg-[#4445a0] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200"
          >
            Manage Schedule
          </button>
          <button
            onClick={() => navigate("/coach")}
            className="bg-[#82e14f] hover:bg-[#548f35] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200"
          >
            View Reports
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="bg-[#3dacce] hover:bg-[#3a849b] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200"
          >
            Update Profile
          </button>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;