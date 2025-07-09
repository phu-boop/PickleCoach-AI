import React, { useState, useEffect, useCallback } from 'react';
import { MdOutlineLocalLibrary, MdOutlineFeaturedPlayList } from 'react-icons/md'; // For courses and recommended lessons
import { getAllCourses, getRecommendedLessons } from '../../../api/learner/learningService';
import CourseCard from './CourseCard';
import LessonCard from './LessonCard';
import { useAuth } from '../../../contexts/AuthContext';

const HomePage = ({ userId }) => {
  const { token } = useAuth();
  console.log(token);
  const [courses, setCourses] = useState([]);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendedLessons = useCallback(async () => {
    try {
      const lessonsData = await getRecommendedLessons(userId);
      setRecommendedLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching recommended lessons:', error);
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);

        await fetchRecommendedLessons();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, fetchRecommendedLessons]);

  // Lắng nghe sự kiện refresh từ localStorage sau khi upload video
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'videoAnalysisComplete' && e.newValue === 'true') {
        console.log('Video analysis completed, refreshing recommended lessons...');
        fetchRecommendedLessons();
        // Xóa flag
        localStorage.removeItem('videoAnalysisComplete');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Kiểm tra flag khi component mount
    if (localStorage.getItem('videoAnalysisComplete') === 'true') {
      fetchRecommendedLessons();
      localStorage.removeItem('videoAnalysisComplete');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchRecommendedLessons]);

  return (
    <div className="w-[90%] mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 font-grandstander flex items-center justify-center sm:justify-start font-grandstander mt-5">
        <img src={'https://www.pickleheads.com/images/duotone-icons/paper-plane.svg'} className={'mr-3'}/> Chương trình của tôi
      </h1>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Recommended Lessons Section */}
          <section className="mb-12 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3 border-gray-200">
              <MdOutlineFeaturedPlayList className="mr-3 text-teal-500" /> Bài học đề xuất
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recommendedLessons.length > 0 ? (
                recommendedLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))
              ) : (
                <p className="text-gray-500 text-lg col-span-full text-center py-8">
                  Chưa có bài học đề xuất nào vào lúc này.
                </p>
              )}
            </div>
          </section>

          {/* All Courses Section */}
          <section className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center border-b pb-3 border-gray-200">
              <MdOutlineLocalLibrary className="mr-3 text-blue-600" /> Tất cả khóa học
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))
              ) : (
                <p className="text-gray-500 text-lg col-span-full text-center py-8">
                  Chưa có khóa học nào để hiển thị.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;