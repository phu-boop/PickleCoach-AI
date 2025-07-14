import React from 'react';
import { FaVideo, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../../../components/ImageWithFallback';
import '../../../styles/LessonCard.css';

const LessonCard = ({ lesson }) => {
  const handleImageError = (e) => {
    // Fallback sang hình ảnh mặc định khi không load được
    e.target.src = 'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Bài+Học+Pickleball';
    e.target.onerror = null; // Tránh infinite loop
  };

  const getImageUrl = (thumbnailUrl) => {
    if (!thumbnailUrl) {
      return 'https://via.placeholder.com/300x200/4F46E5/ffffff?text=Bài+Học+Pickleball';
    }
    
    // Nếu là URL tuyệt đối (http/https)
    if (thumbnailUrl.startsWith('http')) {
      return thumbnailUrl;
    }
    
    // Nếu là đường dẫn tương đối, thêm base URL
    if (thumbnailUrl.startsWith('/')) {
      return `http://localhost:8080${thumbnailUrl}`;
    }
    
    // Nếu chỉ là tên file, thêm đường dẫn đầy đủ
    return `http://localhost:8080/images/${thumbnailUrl}`;
  };

  return (
    <Link to={`/lessons/${lesson.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
        <div className="relative">
          <ImageWithFallback
            src={getImageUrl(lesson.thumbnailUrl)}
            alt={lesson.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          {lesson.isPremium && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full">
              <FaLock className="text-xs" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
            {Math.floor(lesson.durationSeconds / 60)} phút
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FaVideo className="mr-2 text-blue-500" /> {lesson.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{lesson.description}</p>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {lesson.skillType}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {lesson.level}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LessonCard;