import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLessonByCourse } from '../../../api/learner/learningService';
import { ClockIcon, PlayIcon } from '@heroicons/react/24/outline';

const LessonByCourse = () => {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getLessonByCourse(id);
        setLessons(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600">Đang tải...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500 text-lg">Lỗi: {error}</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center border-b pb-3 border-gray-200 font-grandstander py-15">
          <img src={'https://www.pickleheads.com/images/duotone-icons/calendar.svg'} className={'mr-5'}/> Danh sách bài học cho khóa {id}
        </h1>

        {lessons.length > 0 ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {lessons.map((lesson) => (
                  <div
                      key={lesson.id}
                      className="bg-gradient-to-tr from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer flex flex-col"
                      onClick={() => navigate(`/lessons/${lesson.id}`)}
                  >
                    <img
                        src={lesson.thumbnailUrl || 'https://via.placeholder.com/400x200?text=No+Image'}
                        alt={lesson.title}
                        className="w-full h-48 object-cover rounded-t-xl"
                    />

                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="text-lg font-bold text-gray-800 mb-1">{lesson.title}</h2>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2 flex-grow">
                        {lesson.description}
                      </p>

                      <div className="text-sm text-gray-600 flex items-center mb-1">
                        <ClockIcon className="w-4 h-4 text-indigo-500 mr-1" />
                        {Math.floor(lesson.durationSeconds / 60)} phút {lesson.durationSeconds % 60} giây
                      </div>

                      <div className="text-sm flex items-center mb-1">
                        <PlayIcon className="w-4 h-4 text-green-500 mr-1" />
                        <a
                            href={lesson.videoUrl}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                          Xem video
                        </a>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <p>
                          <span className="font-medium text-gray-700">Cấp độ:</span> {lesson.level}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Kỹ năng:</span> {lesson.skillType}
                        </p>
                        <p>
                          <span className="font-medium text-gray-700">Thứ tự:</span> #{lesson.orderInCourse} trong khóa
                        </p>
                      </div>

                      {lesson.isPremium && (
                          <div className="mt-3 text-xs font-semibold text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full self-start">
                            🌟 Premium
                          </div>
                      )}
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
