import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaSave } from 'react-icons/fa';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { getAllCoursesAdmin, createCourse, deleteCourse, updateCourse } from '../../../api/admin/learningService';

// Loại bỏ import Alert nếu bạn không còn dùng nó nữa
// import { Alert } from '../../../components/Alert';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null); // Giữ lại cho lỗi tải dữ liệu ban đầu
  const [showForm, setShowForm] = useState(false);
  // Loại bỏ state `message` vì SweetAlert2 sẽ tự quản lý hiển thị

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCoursesAdmin();
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Lỗi: Dữ liệu nhận được từ API không phải là mảng:', data);
          setError('Dữ liệu khóa học không hợp lệ. Vui lòng thử lại.');
          setCourses([]);
        }
      } catch (err) {
        console.error('Lỗi khi tải khóa học:', err);
        setError('Không thể tải khóa học. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Effect to scroll to the top when the form becomes visible
  useEffect(() => {
    if (showForm) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [showForm]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [name]: value });
    } else {
      setNewCourse({ ...newCourse, [name]: value });
    }
  };

  const handleCreateOrUpdateCourse = async (e) => {
    e.preventDefault();
    setError(null); // Xóa lỗi chung

    if (editingCourse) {
      setIsUpdating(true);
      try {
        const updated = await updateCourse(editingCourse.id, editingCourse);
        setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
        setEditingCourse(null);
        setShowForm(false);
        // Sử dụng SweetAlert2 cho thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Cập nhật khóa học thành công!',
          timer: 3000, // Tự động đóng sau 3 giây
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Lỗi khi cập nhật khóa học:', err);
        // Sử dụng SweetAlert2 cho thông báo lỗi
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể cập nhật khóa học. Vui lòng kiểm tra dữ liệu nhập.',
        });
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsCreating(true);
      try {
        const createdCourse = await createCourse(newCourse);
        setCourses([...courses, createdCourse]);
        setNewCourse({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });
        setShowForm(false);
        // Sử dụng SweetAlert2 cho thông báo thành công
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Tạo khóa học mới thành công!',
          timer: 3000, // Tự động đóng sau 3 giây
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Lỗi khi tạo khóa học:', err);
        // Sử dụng SweetAlert2 cho thông báo lỗi
        Swal.fire({
          icon: 'error',
          title: 'Lỗi!',
          text: 'Không thể tạo khóa học. Vui lòng kiểm tra dữ liệu nhập.',
        });
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    setError(null); // Xóa lỗi chung
    
    // Sử dụng SweetAlert2 cho hộp thoại xác nhận
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn?',
      text: "Bạn sẽ không thể hoàn tác thao tác này!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Có, xóa nó!',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        if (editingCourse && editingCourse.id === id) {
          setEditingCourse(null);
          setShowForm(false);
        }
        // Thông báo xóa thành công
        Swal.fire(
          'Đã xóa!',
          'Khóa học đã được xóa thành công.',
          'success'
        );
      } catch (err) {
        console.error('Lỗi khi xóa khóa học:', err);
        // Thông báo lỗi khi xóa
        Swal.fire(
          'Lỗi!',
          'Không thể xóa khóa học. Vui lòng thử lại.',
          'error'
        );
      }
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse({ ...course });
    setShowForm(true);
    setError(null); // Xóa lỗi chung khi mở form
  };

  const handleAddCourseClick = () => {
    setEditingCourse(null);
    setNewCourse({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });
    setShowForm(true);
    setError(null); // Xóa lỗi chung khi mở form
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCourse(null);
    setNewCourse({ title: '', description: '', levelRequired: 'BEGINNER', thumbnailUrl: '' });
    // Không cần xóa error ở đây vì nó có thể là lỗi tải ban đầu
  };

  const currentFormData = editingCourse || newCourse;
  const isSubmitting = isCreating || isUpdating;
  const formTitle = editingCourse ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới';
  const submitButtonText = editingCourse ? 'Cập nhật khóa học' : 'Thêm khóa học';
  const submitButtonIcon = editingCourse ? <FaSave className="mr-2" /> : <FaPlus className="mr-2" />;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className='flex justify-between items-center'>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center font-grandstander">
          <FaBook className="mr-3 text-purple-400" /> Quản lý khóa học
        </h1>

        {!showForm && (
          <div className="mb-8 md:mb-0">
            <button
              onClick={handleAddCourseClick}
              className="bg-[#e8fadf] text-[#82e14f] cursor-pointer font-semibold py-3 px-6 rounded-lg flex items-center justify-center hover:bg-[#81c35e] hover:text-[#eaf0e7] transition duration-300 ease-in-out shadow-md"
            >
              <FaPlus className="mr-2" /> Thêm khóa học mới
            </button>
          </div>
        )}
      </div>

      {/* Hiển thị lỗi chung (ví dụ: lỗi tải dữ liệu ban đầu) */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.348l-2.651 2.651a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-2.651-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.303l2.651-2.651a1.2 1.2 0 0 1 1.697 1.697L11.697 10l2.651 2.651a1.2 1.2 0 0 1 0 1.697z"/></svg>
          </span>
        </div>
      )}

      {/* Form thêm/chỉnh sửa khóa học */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border border-gray-100 relative">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">{formTitle}</h2>
          <button
            onClick={handleCloseForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200 cursor-pointer"
            title="Đóng"
          >
            <FaTimes className="text-2xl" />
          </button>
          <form onSubmit={handleCreateOrUpdateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Tiêu đề khóa học"
              value={currentFormData.title}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
            <textarea
              name="description"
              placeholder="Mô tả chi tiết khóa học"
              value={currentFormData.description}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg p-3 h-28 resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 col-span-full"
              required
            />
            <select
              name="levelRequired"
              value={currentFormData.levelRequired}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
            <input
              type="url"
              name="thumbnailUrl"
              placeholder="URL hình ảnh (Thumbnail)"
              value={currentFormData.thumbnailUrl}
              onChange={handleFormChange}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            />
            <button
              type="submit"
              className={`bg-blue-400 cursor-pointer text-white font-semibold rounded-lg p-3 flex items-center justify-center col-span-full
                          hover:bg-blue-600 transition duration-300 ease-in-out
                          ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                submitButtonIcon
              )}
              {isSubmitting ? (editingCourse ? 'Đang cập nhật...' : 'Đang tạo...') : submitButtonText}
            </button>
          </form>
        </div>
      )}

      ---

      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Tất cả khóa học</h2>
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Đang tải danh sách khóa học...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-6 rounded-lg text-center text-lg shadow-sm">
          <p>Chưa có khóa học nào. Hãy thêm một khóa học mới!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <img
                src={course.thumbnailUrl || 'https://via.placeholder.com/150x80/f0f4f8/6c757d?text=No+Image'}
                alt={course.title}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{course.description ? course.description.substring(0, 70) + (course.description.length > 70 ? '...' : '') : 'Không có mô tả.'}</p>
              <p className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full w-fit mb-4">
                {course.levelRequired}
              </p>
              <div className="flex space-x-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditClick(course)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200 p-2 bg-blue-50 rounded-full"
                  title="Chỉnh sửa"
                >
                  <FaEdit className="text-lg" />
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 p-2 cursor-pointer bg-red-50 rounded-full"
                  title="Xóa"
                >
                  <FaTrash className="text-lg" />
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