import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

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
    <div className="border border-gray-200 rounded-xl p-5 flex justify-between items-center bg-white shadow-sm">
      {/* Left content with image + text */}
      <div className="flex items-center gap-4">
        <img
          src="https://www.pickleheads.com/images/duotone-icons/player.svg"
          alt="Player Icon"
          className="w-14 h-14"
        />
        <div>
          <h2 className="text-xl font-bold text-[#2d93ad]">
            Create Your Own Group
          </h2>
          <p className="font-semibold text-[#0a0b3d] text-sm mt-1">
            Quickly and easily organize sessions!
          </p>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handleClick}
        className="bg-[#f97316] hover:bg-[#ef6b12] text-white font-bold py-2 px-5 rounded-full text-sm shadow-sm transition"
      >
        Create a Group
      </button>
    </div>
  );
};

export default Groups;
