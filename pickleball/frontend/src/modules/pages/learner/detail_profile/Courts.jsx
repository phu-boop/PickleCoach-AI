import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById } from "../../../../api/admin/user";
import Sidebar from "./Sidebar"; // Import Sidebar
import "font-awesome/css/font-awesome.min.css";

const Courts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
    console.log(user);
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

  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Courts Content */}
      <div className="p-6 flex-1 bg-white rounded-lg">
        <h2 className="text-xl font-bold text-[#2d93ad] mb-4">
          Courts You Follow
        </h2>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Your Followed Courts</p>
          <p className="text-sm text-gray-500">
            You haven't followed any courts yet. Start by exploring courts near
            you!
          </p>
          <button
            onClick={() => navigate("/explore-courts")}
            className="mt-2 text-teal-600 font-bold hover:underline"
          >
            Explore Courts
          </button>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Nearby Courts</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Sample Court Card */}
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <img
                src="https://www.pickleheads.com/images/duotone-icons/court.svg"
                alt="Court Icon"
                className="w-12 h-12 mb-2"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                Ho Chi Minh City Court
              </h3>
              <p className="text-sm text-gray-600">Ho Chi Minh City, VN</p>
              <p className="text-sm text-gray-500 mt-1">2.5 miles away</p>
              <button
                onClick={() => navigate("/court-details/1")}
                className="mt-2 text-teal-600 font-bold hover:underline"
              >
                View Details
              </button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <img
                src="https://www.pickleheads.com/images/duotone-icons/court.svg"
                alt="Court Icon"
                className="w-12 h-12 mb-2"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                Hanoi Central Court
              </h3>
              <p className="text-sm text-gray-600">Hanoi, VN</p>
              <p className="text-sm text-gray-500 mt-1">150 miles away</p>
              <button
                onClick={() => navigate("/court-details/2")}
                className="mt-2 text-teal-600 font-bold hover:underline"
              >
                View Details
              </button>
            </div>
            {/* Thêm các court khác nếu cần */}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Filter Courts</p>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#2d93ad] focus:ring-[#2d93ad] border-gray-300 rounded"
            />
            <span className="text-gray-700">Indoor Courts</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#2d93ad] focus:ring-[#2d93ad] border-gray-300 rounded"
            />
            <span className="text-gray-700">Outdoor Courts</span>
          </div>
          <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d93ad]">
            <option>Sort by Distance</option>
            <option>Sort by Rating</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Courts;