import React from 'react';
import { FaVideo, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => {
  return (
    <Link to={`/lessons/${lesson.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={lesson.thumbnailUrl || 'https://via.placeholder.com/300x150'}
            alt={lesson.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          {lesson.isPremium && (
            <FaLock className="absolute top-2 right-2 text-yellow-500" />
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaVideo className="mr-2 text-blue-500" /> {lesson.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{lesson.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-600">{lesson.skillType}</span>
            <span className="text-sm text-gray-500">{Math.floor(lesson.durationSeconds / 60)} phút</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;