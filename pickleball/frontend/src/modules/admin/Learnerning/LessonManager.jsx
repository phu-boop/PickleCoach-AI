import React, { useState, useEffect } from 'react';
import { FaVideo, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllLessonsAdmin, createLesson, deleteLesson } from '../../../api/admin/learningService';
import { Link } from 'react-router-dom';

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    videoUrl: '',
    durationSeconds: 0,
    thumbnailUrl: '',
    skillType: 'FOREHAND',
    level: 'BEGINNER',
    courseId: '',
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

  const handleCreateLesson = async (e) => {
    e.preventDefault();
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
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaVideo className="mr-2" /> Quản lý bài học
      </h1>

      {/* Form tạo bài học */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm bài học mới</h2>
        <form onSubmit={handleCreateLesson} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            className="border rounded-lg p-2"
          />
          <textarea
            placeholder="Mô tả"
            value={newLesson.description}
            onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="URL video"
            value={newLesson.videoUrl}
            onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
            className="border rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Thời lượng (giây)"
            value={newLesson.durationSeconds}
            onChange={(e) => setNewLesson({ ...newLesson, durationSeconds: parseInt(e.target.value) })}
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={newLesson.thumbnailUrl}
            onChange={(e) => setNewLesson({ ...newLesson, thumbnailUrl: e.target.value })}
            className="border rounded-lg p-2"
          />
          <select
            value={newLesson.skillType}
            onChange={(e) => setNewLesson({ ...newLesson, skillType: e.target.value })}
            className="border rounded-lg p-2"
          >
            <option value="FOREHAND">Forehand</option>
            <option value="BACKHAND">Backhand</option>
            <option value="SERVE">Serve</option>
            <option value="DINK">Dink</option>
          </select>
          <select
            value={newLesson.level}
            onChange={(e) => setNewLesson({ ...newLesson, level: e.target.value })}
            className="border rounded-lg p-2"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <input
            type="number"
            placeholder="ID khóa học"
            value={newLesson.courseId}
            onChange={(e) => setNewLesson({ ...newLesson, courseId: parseInt(e.target.value) })}
            className="border rounded-lg p-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 flex items-center">
            <FaPlus className="mr-2" /> Thêm bài học
          </button>
        </form>
      </div>

      {/* Danh sách bài học */}
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
                <p className="text-gray-600 text-sm">{lesson.skillType} - {lesson.level}</p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/admin/lessons/edit/${lesson.id}`} className="text-blue-500">
                  <FaEdit />
                </Link>
                <button onClick={() => handleDeleteLesson(lesson.id)} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonManager;