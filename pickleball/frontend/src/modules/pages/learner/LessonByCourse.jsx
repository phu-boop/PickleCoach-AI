import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLessonByCourse } from '../../../api/learner/learningService';
import { ClockIcon, PlayIcon } from '@heroicons/react/24/outline';

const LessonByCourse = () => {
  const { id } = useParams();
  console.log('Course ID:', id);

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const Response = await getLessonByCourse(id);
        const data = Response.data;
        console.log("hi"+data.length);
        console.log('API Response:', data);
        setLessons(data);
      } catch (err) {
        setError(err.message);
        console.error('Lỗi khi gọi API:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-600">Đang tải...</p>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-red-500 text-lg">Lỗi: {error}</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Danh sách bài học - Khóa học {id}</h1>
      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer" // Thêm cursor-pointer
              onClick={() => navigate(`/lessons/${lesson.id}`)} // Điều hướng khi click
            >
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{lesson.title}</h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{lesson.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span>{Math.floor(lesson.durationSeconds / 60)} phút {lesson.durationSeconds % 60} giây</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <PlayIcon className="w-4 h-4 mr-1" />
                  <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Xem video
                  </a>
                </div>
                <p className="text-gray-500 text-xs">
                  Cấp độ: {lesson.level} | Kỹ năng: {lesson.skillType}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Thứ tự: {lesson.orderInModule} trong module, {lesson.orderInCourse} trong khóa học
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Premium: {lesson.isPremium ? 'Có' : 'Không'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Không có bài học nào.</p>
      )}
    </div>
  );
};

export default LessonByCourse;
        
        
