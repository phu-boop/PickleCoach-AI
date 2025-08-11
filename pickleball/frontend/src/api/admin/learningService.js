import apiAdmin from "./apiAdmin";
export const getAllCoursesAdmin = async () => {
  const response = await apiAdmin.get('/admin/courses');
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await apiAdmin.post('/admin/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await apiAdmin.put(`/admin/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await apiAdmin.delete(`/admin/courses/${id}`);
  return response.data;
};

export const getAllLessonsAdmin = async () => {
  const response = await apiAdmin.get('/admin/lessons');
  return response.data;
};

export const createLesson = async (lessonData) => {
  const response = await apiAdmin.post('/admin/lessons', lessonData);
  return response.data;
};

export const updateLesson = async (id, lessonData) => {
  const response = await apiAdmin.put(`/admin/lessons/${id}`, lessonData);
  return response.data;
};

export const deleteLesson = async (id) => {
  const response = await apiAdmin.delete(`/admin/lessons/${id}`);
  return response.data;
};

export const getLearnerProgress = async (learnerId) => {
  const response = await apiAdmin.get(`/admin/learners/${learnerId}/progress`);
  return response.data;
};