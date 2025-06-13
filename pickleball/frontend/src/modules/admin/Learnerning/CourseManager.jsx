import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getAllCoursesAdmin, createCourse, deleteCourse } from '../../../api/admin/learningService';
import { Link } from 'react-router-dom';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCoursesAdmin();
        // --- LOG Gỡ lỗi 1 ---
        console.log('Dữ liệu nhận được từ API getAllCoursesAdmin:', data);

        // Đảm bảo rằng 'data' là một mảng trước khi cập nhật state
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          // --- LOG Gỡ lỗi 2 ---
          console.error('Lỗi: Dữ liệu nhận được từ API không phải là mảng:', data);
          // Đặt 'courses' về mảng rỗng để tránh lỗi .map
          setCourses([]);
        }
      } catch (error) {
        // --- LOG Gỡ lỗi 3 ---
        console.error('Lỗi khi tải khóa học:', error);
        // Trong trường hợp lỗi, vẫn đảm bảo loading = false và courses là mảng rỗng
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const createdCourse = await createCourse(newCourse);
      setCourses([...courses, createdCourse]);
      setNewCourse({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });
    } catch (error) {
      console.error('Lỗi khi tạo khóa học:', error);
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa khóa học:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaBook className="mr-2" /> Quản lý khóa học
      </h1>

      {/* Form tạo khóa học */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Thêm khóa học mới</h2>
        <form onSubmit={handleCreateCourse} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            className="border rounded-lg p-2"
          />
          <textarea
            placeholder="Mô tả"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            className="border rounded-lg p-2"
          />
          <select
            value={newCourse.levelRequired}
            onChange={(e) => setNewCourse({ ...newCourse, levelRequired: e.target.value })}
            className="border rounded-lg p-2"
          >
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
          <input
            type="text"
            placeholder="URL hình ảnh"
            value={newCourse.thumbnailUrl}
            onChange={(e) => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })}
            className="border rounded-lg p-2"
          />
          <button type="submit" className="bg-blue-500 text-white rounded-lg p-2 flex items-center">
            <FaPlus className="mr-2" /> Thêm khóa học
          </button>
        </form>
      </div>

      {/* Danh sách khóa học */}
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* --- LOG Gỡ lỗi 4 --- */}
          {console.log('Giá trị của courses ngay trước khi map:', courses)}
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                <p className="text-gray-600 text-sm">{course.levelRequired}</p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/admin/courses/edit/${course.id}`} className="text-blue-500">
                  <FaEdit />
                </Link>
                <button onClick={() => handleDeleteCourse(course.id)} className="text-red-500">
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

export default CourseManager;