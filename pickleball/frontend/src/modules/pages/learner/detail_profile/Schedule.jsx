import React, { useState, useEffect } from "react";
import { fetchUserById } from "../../../../api/admin/user";
import Sidebar from "./Sidebar"; 
import { FaLock, FaHandPaper } from "react-icons/fa";
import { getScheduledSessionsLearner,getScheduledSessions } from "../../../../api/learner/learningService";
import "font-awesome/css/font-awesome.min.css";
import { useNavigate } from "react-router-dom";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeSlots = [
  { start: "08:00", end: "11:00" },
  { start: "11:00", end: "14:00" },
  { start: "14:00", end: "17:00" },
  { start: "17:00", end: "20:00" },
  { start: "20:00", end: "23:00" },
];


const getDayShort = (scheduleStr) => {
  const day = scheduleStr.split(" ")[0];
  const mapping = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun"
  };
  return mapping[day] || day.slice(0, 3);
};

const getTimeRange = (scheduleStr) => scheduleStr.split(" ")[1];

const WeeklySchedule = ({ scheduleList }) => {
  const scheduleMap = {};
  scheduleList.forEach((item) => {
    const day = getDayShort(item.schedule);
    const timeRange = getTimeRange(item.schedule);
    if (!scheduleMap[day]) scheduleMap[day] = {};
    scheduleMap[day][timeRange] = item;
  });
const navigate = useNavigate();
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-[100px_repeat(7,minmax(140px,1fr))] gap-3 min-w-[1100px]">
        <div></div>
        {weekdays.map((day, idx) => (
          <div
            key={idx}
            className="text-center font-extrabold text-[#0a0b3d] text-lg font-grandstander border-b-2 pb-2"
          >
            {day}
          </div>
        ))}

        {timeSlots.map((slot, slotIdx) => (
          <React.Fragment key={slotIdx}>
            <div className="text-right pr-2 font-semibold text-gray-700 font-grandstander pt-3">
              {slot.start} – {slot.end}
            </div>
            {weekdays.map((day, dayIdx) => {
              const timeRange = `${slot.start}-${slot.end}`;
              const session = scheduleMap[day]?.[timeRange];

              return session ? (
                <div
                  key={dayIdx}
                  className={`rounded-xl shadow-lg px-3 py-3 font-grandstander text-sm flex flex-col gap-1 transition duration-200 ${
                    session.status
                      ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-900 border border-blue-300"
                      : "bg-gradient-to-br from-red-100 to-red-50 text-red-900 border border-red-300"
                  }`}
                >
                  <div className="font-bold text-base">
                    {slot.start} – {slot.end}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold">
                    {session.status ? (
                      <>
                        <FaHandPaper className="text-blue-700" />
                        <span>Open Play</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="text-red-700" />
                        <span>Private</span>
                      </>
                    )}
                  </div>
                  
                    {(session.statusSession=='IN_PROGRESS') && (
                      <div onClick={()=>{navigate(`/learner_video_call/${session.id}`)}} className="bg-[#ea6645] text-center font-[var(--font-primary)] font-extrabold text-[16px] text-white py-2 px-3 rounded-full transition-all duration-300 hover:bg-gradient-to-b hover:from-[#ea6645] hover:to-[#8e3e29] cursor-pointer">
                        into room
                      </div>
                    )
                    }
                </div>
              ) : (
                <div
                  key={dayIdx}
                  className="min-h-[100px] border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                ></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Schedule = () => {
  const [user, setUser] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const learnerId = sessionStorage.getItem("id_user");
        const response = await fetchUserById(learnerId);
        if (response.status === 200) {
          setUser(response.data);
        }
        if(sessionStorage.getItem('role')==='ROLE_coach'){
          const scheduleResponse = await getScheduledSessions(sessionStorage.getItem('id_user'));
          setScheduleList(scheduleResponse);
        }else{
          const scheduleResponse = await getScheduledSessionsLearner(learnerId);
          setScheduleList(scheduleResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
      <Sidebar />
      <div className="p-6 flex-1 bg-white ml-5 w-200 mt-10 rounded-lg">
        <h2 className="text-xl font-bold flex gap-2 item-center text-[#2d93ad] mb-4">
          <img
            src="https://www.pickleheads.com/images/duotone-icons/group-court.svg"
            className="h-10 block"
            alt=""
          />
          <span className="mt-2">Your Schedule</span>
        </h2>
        <WeeklySchedule scheduleList={scheduleList} />
      </div>
    </div>
  );
};

export default Schedule;
