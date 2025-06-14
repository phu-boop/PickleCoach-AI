import apiLearner from './apiLearner';

export const getAllCourses = async () => {
  const response = await apiLearner.get('/courses');
  return response.data;
};

export const getCourseById = async (id) => {
  const response = await apiLearner.get(`/courses/${id}`);
  return response.data;
};

export const getLessonById = async (id) => {
  const response = await apiLearner.get(`/lessons/${id}`);
  return response.data;
};

export const getRecommendedLessons = async (userId) => {
  const response = await apiLearner.get(`/learners/${userId}/recommended-lessons`);
  return response.data;
};

export const updateLearnerProgress = async (progressData) => {
  const response = await apiLearner.post('/learner-progress', progressData);
  return response.data;
};

