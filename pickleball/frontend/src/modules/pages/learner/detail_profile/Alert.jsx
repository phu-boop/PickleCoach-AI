import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { fetchUserById } from "../../../../api/admin/user";
import "font-awesome/css/font-awesome.min.css";

const Alert = () => {
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

  // State cho các lựa chọn
  const [timing, setTiming] = useState({
    MON: { AM: true, MID: false, EVE: true },
    TUE: { AM: false, MID: true, EVE: true },
    WED: { AM: true, MID: true, EVE: true },
    THU: { AM: false, MID: true, EVE: false },
    FRI: { AM: true, MID: true, EVE: false },
    SAT: { AM: false, MID: false, EVE: true },
    SUN: { AM: true, MID: true, EVE: true },
  });
  const [format, setFormat] = useState({
    "Round Robin": true,
    "Challenge Courts": false,
    Singles: true,
    "League Play": false,
    Ladder: true,
    "Open Play": true,
  });
  const [skillLevel, setSkillLevel] = useState(2.0);

  const handleTimingChange = (day, time) => {
    setTiming((prev) => ({
      ...prev,
      [day]: { ...prev[day], [time]: !prev[day][time] },
    }));
  };

  const handleFormatChange = (type) => {
    setFormat((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSkillLevelChange = (level) => {
    setSkillLevel(level);
  };

  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
      {/* Sidebar */}
      
      <Sidebar/>
      {/* Alert Content */}
      <div className="p-6 flex-1 bg-white rounded-lg">
        <h2 className="text-xl font-bold text-[#2d93ad] mb-4">
          Get notified about upcoming play
        </h2>

        <div className="mb-6">
          <div className="flex justify-between text-gray-700">
            <div>
              <p className="font-semibold">At courts you follow</p>
              <p className="text-sm text-gray-500">
                You don't follow any courts yet
              </p>
            </div>
            <div>
              <p className="font-semibold">From groups you're in</p>
              <p className="text-sm text-gray-500">
                You're not a member of any groups yet
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">In your area</p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#2d93ad] focus:ring-[#2d93ad] border-gray-300 rounded"
            />
            <span className="text-gray-700">Your Location: Ho Chi Minh City, Ho Chi Minh, VN</span>
            <span className="text-[#2d93ad]">📍</span>
          </div>
          <select className="w-full p-2 mt-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2d93ad]">
            <option>Within 10 miles (16 km) of my location</option>
          </select>
        </div>

        <hr className="border-gray-200 my-6" />

        <h3 className="text-lg font-bold text-[#2d93ad] mb-4">
          Session Alert Settings
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          These preferences apply to alerts for new sessions from groups you're
          in, courts you follow and sessions in your area.
        </p>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Timing</p>
          <p className="text-sm text-gray-500 mb-2">
            AM: Before 11am - MID: 11am-4pm - EVE: After 4pm
          </p>
          <div className="grid grid-cols-7 gap-4">
            {Object.keys(timing).map((day) => (
              <div key={day}>
                <p className="text-center font-medium text-gray-700">{day}</p>
                {["AM", "MID", "EVE"].map((time) => (
                  <div key={time} className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      checked={timing[day][time]}
                      onChange={() => handleTimingChange(day, time)}
                      className="h-4 w-4 accent-[#2d93ad] focus:ring-[#2d93ad] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{time}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Format</p>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(format).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={format[type]}
                  onChange={() => handleFormatChange(type)}
                  className="h-4 w-4 accent-[#2d93ad] focus:ring-[#2d93ad] border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="font-semibold text-gray-700">Skill Level</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#2d93ad] h-2.5 rounded-full"
              style={{ width: `${((skillLevel - 2.0) / (5.5 - 2.0)) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>2.0</span>
            <span>5.5+</span>
          </div>
          <input
            type="range"
            min="2.0"
            max="5.5"
            step="0.5"
            value={skillLevel}
            onChange={(e) => handleSkillLevelChange(parseFloat(e.target.value))}
            className="w-full mt-2 accent-[#2d93ad]"
          />
        </div>
      </div>
    </div>
  );
};

export default Alert;