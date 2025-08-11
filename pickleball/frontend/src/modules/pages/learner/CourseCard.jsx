import React from 'react';
import { FaBook, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="block h-full"> {/* Added h-full for consistent height in grid */}
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"> {/* Added flex flex-col and h-full */}
        <img
          src={course.thumbnailUrl || 'https://via.placeholder.com/400x200/edf2f7/4a5568?text=No+Image'} // Moved comment outside or removed
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-xl" // Increased height for better visual
        />
        <div className="p-5 flex-grow flex flex-col"> {/* Added flex-grow and flex flex-col */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center"> {/* Increased font size and weight */}
            <FaBook className="mr-3 text-indigo-600" /> {/* Changed icon color and increased margin */}
            {course.title}
          </h3>
          <p className="text-gray-700 text-base mb-3 line-clamp-3 flex-grow"> {/* Increased text size, improved line clamping, and flex-grow */}
            {course.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100"> {/* Added top border and padding */}
            <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full"> {/* Styled levelRequired */}
              {course.levelRequired}
            </span>
            <div className="flex items-center">
              <FaStar className="text-yellow-500 mr-1 text-lg" /> {/* Slightly larger star icon and deeper yellow */}
              <span className="text-base font-medium text-gray-600">4.5</span> {/* Increased text size and weight */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;