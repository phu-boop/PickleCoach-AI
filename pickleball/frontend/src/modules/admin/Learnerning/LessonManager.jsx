import React, { useState, useEffect } from 'react';
import { FaVideo, FaPlus, FaTrash } from 'react-icons/fa';
import { getAllLessonsAdmin, createLesson, deleteLesson } from '../../../api/admin/learningService';
// import { Link } from 'react-router-dom'; // No longer needed for edit button

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    durationSeconds: 0,
    thumbnailUrl: '',
    skillType: 'FOREHAND',
    level: 'BEGINNER',
    courseId: '',
    moduleId: null,
    orderInModule: 1,
    orderInCourse: 1,
    contentText: '',
    isPremium: false,
  });

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await getAllLessonsAdmin();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  const validateLesson = (lesson) => {
    const err = {};

    if (!lesson.title.trim()) err.title = 'Tiêu đề không được để trống.';
    if (!lesson.description.trim()) err.description = 'Mô tả không được để trống.';
    if (!lesson.videoUrl.trim()) {
      err.videoUrl = 'URL video không được để trống.';
    } else if (!lesson.videoUrl.startsWith('http://') && !lesson.videoUrl.startsWith('https://')) {
      err.videoUrl = 'URL video phải bắt đầu bằng http:// hoặc https://';
    }
    if (!lesson.durationSeconds || lesson.durationSeconds <= 0) {
      err.durationSeconds = 'Thời lượng phải lớn hơn 0.';
    }
    if (!lesson.courseId || isNaN(lesson.courseId)) {
      err.courseId = 'ID khóa học không hợp lệ.';
    }

    return err;
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    const validationErrors = validateLesson(newLesson);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const createdLesson = await createLesson(newLesson);
      setLessons([...lessons, createdLesson]);
      setNewLesson({
        title: '',
        description: '',
        videoUrl: '',
        durationSeconds: 0,
        thumbnailUrl: '',
        skillType: 'FOREHAND',
        level: 'BEGINNER',
        courseId: '',
        moduleId: null,
        orderInModule: 1,
        orderInCourse: 1,
        contentText: '',
        isPremium: false,
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating lesson:', error?.response?.data || error.message);
    }
  };

  const handleDeleteLesson = async (id) => {
    try {
      await deleteLesson(id);
      setLessons(lessons.filter((lesson) => lesson.id !== id));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-extrabold text-[#a4a5fc] mb-8 flex items-center justify-center font-grandstander">
        <FaVideo className="mr-3 text-[#9496ff] mb-1" /> <p className='text-center'>Quản lý Bài Học</p>
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-indigo-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thêm Bài Học Mới</h2>
        <form onSubmit={handleCreateLesson} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
            <input
              type="text"
              id="title"
              placeholder="Tiêu đề bài học"
              value={newLesson.title}
              onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="description"
              placeholder="Mô tả ngắn gọn về bài học"
              value={newLesson.description}
              onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-y focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Video</label>
            <input
              type="text"
              id="videoUrl"
              placeholder="Ví dụ: https://youtube.com/watch?v=..."
              value={newLesson.videoUrl}
              onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            {errors.videoUrl && <p className="text-red-600 text-sm mt-1">{errors.videoUrl}</p>}
          </div>
          <div>
            <label htmlFor="durationSeconds" className="block text-sm font-medium text-gray-700 mb-1">Thời lượng (giây)</label>
            <input
              type="number"
              id="durationSeconds"
              placeholder="Ví dụ: 300"
              value={newLesson.durationSeconds}
              onChange={(e) => setNewLesson({ ...newLesson, durationSeconds: parseInt(e.target.value) || 0 })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            {errors.durationSeconds && <p className="text-red-600 text-sm mt-1">{errors.durationSeconds}</p>}
          </div>
          <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh Thumbnail</label>
            <input
              type="text"
              id="thumbnailUrl"
              placeholder="URL hình ảnh đại diện"
              value={newLesson.thumbnailUrl}
              onChange={(e) => setNewLesson({ ...newLesson, thumbnailUrl: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="skillType" className="block text-sm font-medium text-gray-700 mb-1">Loại kỹ năng</label>
            <select
              id="skillType"
              value={newLesson.skillType}
              onChange={(e) => setNewLesson({ ...newLesson, skillType: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            >
              <option value="FOREHAND">Forehand</option>
              <option value="BACKHAND">Backhand</option>
              <option value="SERVE">Serve</option>
              <option value="DINK">Dink</option>
            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Cấp độ</label>
            <select
              id="level"
              value={newLesson.level}
              onChange={(e) => setNewLesson({ ...newLesson, level: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
          <div>
            <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">ID Khóa học</label>
            <input
              type="number"
              id="courseId"
              placeholder="ID khóa học liên quan"
              value={newLesson.courseId}
              onChange={(e) => setNewLesson({ ...newLesson, courseId: parseInt(e.target.value) || '' })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
            {errors.courseId && <p className="text-red-600 text-sm mt-1">{errors.courseId}</p>}
          </div>
          <div>
            <label htmlFor="moduleId" className="block text-sm font-medium text-gray-700 mb-1">ID Module (tùy chọn)</label>
            <input
              type="number"
              id="moduleId"
              placeholder="ID module nếu thuộc module"
              value={newLesson.moduleId || ''}
              onChange={(e) => setNewLesson({ ...newLesson, moduleId: e.target.value ? parseInt(e.target.value) : null })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="orderInModule" className="block text-sm font-medium text-gray-700 mb-1">Thứ tự trong Module</label>
            <input
              type="number"
              id="orderInModule"
              placeholder="Thứ tự bài học trong module"
              value={newLesson.orderInModule}
              onChange={(e) => setNewLesson({ ...newLesson, orderInModule: parseInt(e.target.value) || 1 })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
          </div>
          <div>
            <label htmlFor="orderInCourse" className="block text-sm font-medium text-gray-700 mb-1">Thứ tự trong Khóa học</label>
            <input
              type="number"
              id="orderInCourse"
              placeholder="Thứ tự bài học trong khóa học"
              value={newLesson.orderInCourse}
              onChange={(e) => setNewLesson({ ...newLesson, orderInCourse: parseInt(e.target.value) || 1 })}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="contentText" className="block text-sm font-medium text-gray-700 mb-1">Nội dung văn bản bài học</label>
            <textarea
              id="contentText"
              placeholder="Nội dung chi tiết của bài học (có thể là Markdown hoặc HTML)"
              value={newLesson.contentText}
              onChange={(e) => setNewLesson({ ...newLesson, contentText: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full h-32 resize-y focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition duration-200"
            />
          </div>
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id="isPremium"
              checked={newLesson.isPremium}
              onChange={(e) => setNewLesson({ ...newLesson, isPremium: e.target.checked })}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="ml-2 block text-base text-gray-900">Bài học trả phí</label>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-[#696cff] hover:bg-[#5557d3] cursor-pointer text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition duration-300 transform hover:scale-105"
            >
              <FaPlus className="text-xl" /> <span>Thêm Bài Học</span>
            </button>
          </div>
        </form>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Danh sách Bài Học</h2>
      {loading ? (
        <div className="text-center text-gray-600 text-lg py-10">Đang tải danh sách bài học...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lessons.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 text-lg">Chưa có bài học nào được thêm.</p>
          ) : (
            lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl border border-gray-200"
              >
                {lesson.thumbnailUrl && (
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{lesson.description}</p>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <span className="font-medium">Kỹ năng:</span> <span className="ml-1">{lesson.skillType}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <span className="font-medium">Cấp độ:</span> <span className="ml-1">{lesson.level}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <span className="font-medium">Thời lượng:</span> <span className="ml-1">{Math.floor(lesson.durationSeconds / 60)} phút {lesson.durationSeconds % 60} giây</span>
                  </div>
                  <div className="flex justify-end">
                    {/* Removed Link to edit page */}
                    <button
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-red-600 hover:text-red-800 transition duration-200 p-2 rounded-full hover:bg-red-50"
                      title="Xóa bài học"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LessonManager;