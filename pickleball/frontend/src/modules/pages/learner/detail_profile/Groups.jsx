import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Sidebar from "./Sidebar";
const MySwal = withReactContent(Swal);

const Groups = () => {
  const handleClick = () => {
    MySwal.fire({
      icon: "info",
      title: "Coming Soon",
      text: "This feature is not developed yet.",
      confirmButtonColor: "#f97316",
    });
  };

  return (
    <div className="flex justify-between my-10 w-[80%] mx-auto min-h-screen">
      <Sidebar />

      {/* Right Content */}
      <div className="flex flex-col flex-1 py-10 pr-10 pl-6">
        <h2 className="text-lg font-bold text-[#0a0b3d] mb-6">0 Groups</h2>

        <div className="border rounded-lg px-6 py-5 flex justify-between items-center shadow-sm">
          {/* Left content */}
          <div className="flex items-center gap-4">
            <img
              src="https://www.pickleheads.com/images/duotone-icons/player.svg"
              alt="Player Icon"
              className="w-12 h-12"
            />
            <div>
              <h3 className="text-lg font-bold text-[#2d93ad]">
                Create Your Own Group
              </h3>
              <p className="text-sm font-medium text-[#0a0b3d] mt-1">
                Quickly and easily organize sessions!
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleClick}
            className="bg-[#f97316] hover:bg-[#ef6b12] text-white font-bold py-2 px-5 rounded-full text-sm shadow-md transition"
          >
            Create a Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default Groups;
