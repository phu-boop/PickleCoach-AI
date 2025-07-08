import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById } from "../../../../api/admin/user";
import "font-awesome/css/font-awesome.min.css";

const Alert = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    MON: { AM: true, MID: true, EVE: true },
    TUE: { AM: true, MID: true, EVE: true },
    WED: { AM: true, MID: true, EVE: true },
    THU: { AM: true, MID: true, EVE: true },
    FRI: { AM: true, MID: true, EVE: true },
    SAT: { AM: true, MID: true, EVE: true },
    SUN: { AM: true, MID: true, EVE: true },
  });
  const [format, setFormat] = useState({
    "Round Robin": true,
    "Challenge Courts": true,
    Singles: true,
    "League Play": true,
    Ladder: true,
    "Open Play": true,
    Lessons: true,
    "Beginner Clinic": true,
    "Kids Clinic": true,
    Clinic: true,
    Mixed: true,
    "Members Only": true,
    Doubles: true,
    "Drills Only": true,
    "Seniors Only": true,
    "Men Only": true,
    "Women Only": true,
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
      <div className="w-72 h-screen bg-white my-5 p-0 shadow-lg flex flex-col relative">
        {/* Avatar + Camera */}
        <div className="flex flex-col pt-8 pb-4 relative">
          <div className="relative">
            <div className="ml-6 w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.urlavata ? (
                <div>
                  <img
                    src={user.urlavata}
                    alt="User avatar"
                    className="w-24 h-24 rounded-full object-cover mr-2"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 bg-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <span className="absolute bottom-3 right-0 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></span>
          </div>
          <div className="mt-4 ml-6 text-2xl font-extrabold text-gray-900">
            {user ? user.name : ""}
          </div>
          <div className="mt-2 ml-6 font-bold text-base text-gray-500">
            N/R Rating
          </div>
          <div className="mt-1 ml-6 font-bold text-base font-semibold text-cyan-700 break-all">
            email: {user ? user.email : "N/A"}
          </div>
        </div>
        <nav className="flex flex-col gap-3 px-6 mt-6 flex-1">
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg text-white font-bold shadow-sm"
            onClick={() => navigate("/profile")}
          >
            <span className="flex items-center text-black">Profile</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white">
              <i className="fa fa-user text-cyan-600"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-[#2d93ad] text-white font-bold shadow-sm"
            onClick={() => navigate("/alert")}
          >
            <span className="flex items-center">Alerts</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white">
              <i className="fa fa-bell text-[#2d93ad]"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition"
            onClick={() => navigate("/courts")}
          >
            <span className="flex items-center">Courts</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2d93ad]">
              <i className="fa fa-balance-scale text-white"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition"
            onClick={() => navigate("/schedule")}
          >
            <span className="flex items-center">Schedule</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2d93ad]">
              <i className="fa fa-calendar text-white"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition"
            onClick={() => navigate("/groups")}
          >
            <span className="flex items-center">Groups</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2d93ad]">
              <i className="fa fa-users text-white"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition"
            onClick={() => navigate("/lists")}
          >
            <span className="flex items-center">Lists</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2d93ad]">
              <i className="fa fa-list text-white"></i>
            </span>
          </a>
          <a
            href="#"
            className="flex items-center justify-between p-3 rounded-lg bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-cyan-50 transition"
            onClick={() => navigate("/payments")}
          >
            <span className="flex items-center">Payments</span>
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2d93ad]">
              <i className="fa fa-credit-card text-white"></i>
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