import React, { useEffect, useState } from "react";
import { getSessionbyCoach, deleteSession } from "../../../../api/coach/Service";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [filter, setFilter] = useState("ALL");
  const coachId = sessionStorage.getItem("id_user");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getSessionbyCoach(coachId);
        setSessions(res);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };
    fetchSessions();
  }, [coachId]);

  const handleCancel = async (sessionId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea6645",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Yes, cancel it",
    });

    if (result.isConfirmed) {
      try {
        await deleteSession(sessionId);
        Swal.fire("Cancelled!", "Session has been cancelled.", "success");
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      } catch (error) {
        Swal.fire("Error", "Failed to cancel the session.", "error");
        console.error("Cancel failed:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canShowActions = (status) =>
    status === "SCHEDULED" || status === "IN_PROGRESS";

  const filteredSessions =
    filter === "ALL"
      ? sessions
      : sessions.filter((s) => s.status === filter);

  const visibleSessions = filteredSessions.slice(0, visibleCount);

  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-scree">
      <Sidebar />
      <div className="w-[73%] mt-6 shadow-2xl border-red-100 border-1 pt-10 pr-10 pl-10 rounded-2xl">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-6 ">
          {["ALL", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setVisibleCount(4);
                }}
                className={`px-4 py-1 rounded-full text-sm font-semibold transition ${
                  filter === status
                    ? "bg-[#162556] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status === "ALL" ? "All" : status.replace("_", " ")}
              </button>
            )
          )}
        </div>

        {/* Session Cards */}
        <div className="space-y-5">
          {visibleSessions.map((session) => (
            <div
              key={session.sessionId}
              className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-[#162556] mb-1 flex items-center gap-2">
                    <img
                      src="https://www.pickleheads.com/images/duotone-icons/star.svg"
                      className="h-5 flex"
                      alt=""
                    />{" "}
                    {session.datetime}
                  </p>
                  <p className="text-sm text-gray-500">
                    👤 Learner ID:{" "}
                    <span className="font-mono text-gray-700">
                      {session.learnerId}
                    </span>
                  </p>
                  <p className="mt-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </span>
                  </p>
                </div>

                {canShowActions(session.status) && (
                  <div className="flex space-x-3 mt-3 md:mt-0">
                    <button
                      onClick={() => handleCancel(session.sessionId)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#82e14f] hover:bg-[#69b341] text-white rounded-full text-sm font-medium shadow-sm"
                    >
                      <FaCheckCircle className="text-white" />
                      Complete
                    </button>
                    <button
                      onClick={() => handleCancel(session.sessionId)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#ea6645] hover:bg-[#ca5f45] text-white rounded-full text-sm font-medium shadow-sm"
                    >
                      <FaTimesCircle className="text-white" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        {visibleCount < filteredSessions.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount(filteredSessions.length)}
              className="px-6 py-2 text-sm font-semibold bg-[#162556] text-white rounded-full hover:bg-[#1f2a68] transition"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;
