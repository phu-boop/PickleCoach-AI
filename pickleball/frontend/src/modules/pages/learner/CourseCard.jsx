import React from 'react';
import { FaBook, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  if (!course) return null;

  const title = course.title || course.name || 'Khóa học';
  const description = course.description || '';
  const thumbnail = course.thumbnailUrl || course.image || 'https://via.placeholder.com/400x200/edf2f7/4a5568?text=No+Image';
  const level = course.levelRequired || course.level || 'N/A';

  const content = (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"> {/* card layout */}
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-48 object-cover rounded-t-xl"
      />
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
          <FaBook className="mr-3 text-indigo-600" />
          {title}
        </h3>
        <p className="text-gray-700 text-base mb-3 line-clamp-3 flex-grow">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">{level}</span>
          <div className="flex items-center">
            <FaStar className="text-yellow-500 mr-1 text-lg" />
            <span className="text-base font-medium text-gray-600">4.5</span>
          </div>
        </div>
      </div>
    </div>
  );

  // If we have an internal course id, link to internal route. Otherwise if an external URL exists, open it in new tab.
  if (course.id) {
    return (
      <Link to={`/course/${course.id}`} className="block h-full">{content}</Link>
    );
  }

  const externalUrl = course.courseUrl || course.url || course.thumbnailUrl || null;
  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noreferrer" className="block h-full">{content}</a>
    );
  }

  // Fallback: render non-clickable card with same style
  return <div className="block h-full">{content}</div>;
};

export default CourseCard;