import React, { useState, useEffect } from 'react';
import { FaBook, FaVideo } from 'react-icons/fa';
import { getAllCourses, getRecommendedLessons } from '../../../api/learner/learningService';
import CourseCard from './CourseCard';
import LessonCard from './LessonCard';

const HomePage = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [recommendedLessons, setRecommendedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getAllCourses();
        setCourses(coursesData);

        const lessonsData = await getRecommendedLessons(userId);
        setRecommendedLessons(lessonsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaBook className="mr-2" /> Chương trình của tôi
      </h1>
      
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <>
          {/* Recommended Lessons Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaVideo className="mr-2" /> Bài học đề xuất
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedLessons.length > 0 ? (
                recommendedLessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))
              ) : (
                <p className="text-gray-500">Chưa có bài học đề xuất.</p>
              )}
            </div>
          </section>

          {/* All Courses Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
              <FaBook className="mr-2" /> Tất cả khóa học
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default HomePage;