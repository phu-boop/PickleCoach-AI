import React from 'react';
import { FaBook, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <img
          src={course.thumbnailUrl || 'https://via.placeholder.com/300x150'}
          alt={course.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaBook className="mr-2 text-blue-500" /> {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">{course.levelRequired}</span>
            <div className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-sm text-gray-500">4.5</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
