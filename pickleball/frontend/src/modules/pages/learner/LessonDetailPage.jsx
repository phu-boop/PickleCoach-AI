import React, { useState, useEffect } from 'react';
import { FaVideo, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { getLessonById, updateLearnerProgress } from '../../../api/learner/learningService';

const LessonDetailPage = ({ userId }) => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchedDuration, setWatchedDuration] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await getLessonById(id);
        setLesson(data);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleVideoProgress = async (event) => {
    const currentTime = Math.floor(event.target.currentTime);
    setWatchedDuration(currentTime);

    try {
      await updateLearnerProgress({
        learnerId: userId,
        lessonId: id,
        isCompleted: currentTime >= lesson.durationSeconds * 0.9,
        watchedDurationSeconds: currentTime,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };
  
  if (loading) {
    return <div className="text-center text-gray-500">Đang tải...</div>;
  }

  if (!lesson) {
    return <div className="text-center text-red-500">Không tìm thấy bài học.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaVideo className="mr-2 text-blue-500" /> {lesson.title}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <video
            controls
            className="w-full rounded-lg shadow-md"
            onTimeUpdate={handleVideoProgress}
          >
            <source src={lesson.videoUrl} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ video.
          </video>
          <div className="mt-4 flex items-center">
            <FaCheckCircle
              className={`mr-2 ${watchedDuration >= lesson.durationSeconds * 0.9 ? 'text-green-500' : 'text-gray-400'}`}
            />
            <span className="text-sm text-gray-600">
              Đã xem: {watchedDuration} / {lesson.durationSeconds} giây
            </span>
          </div>
        </div>
        {/* Lesson Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông tin bài học</h2>
          <p className="text-gray-600 mb-4">{lesson.description}</p>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Loại kỹ năng: </span>
            <span className="text-blue-600">{lesson.skillType}</span>
          </div>
          <div className="mb-4">
            <span className="font-medium text-gray-700">Cấp độ: </span>
            <span className="text-blue-600">{lesson.level}</span>
          </div>
          {lesson.contentText && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                <FaFileAlt className="mr-2" /> Tài nguyên
              </h3>
              <p className="text-gray-600 mt-2">{lesson.contentText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;