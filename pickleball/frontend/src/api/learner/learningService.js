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

export const checkLearnerProgress = async (data) => {
  const response = await apiLearner.post('/checkLearnerProgress',data);
  return response.data;
}


export const checkCompleted = async (idProgress) => {
  const response = await apiLearner.post('/checkCompleted',idProgress);
  return response;
}

export const createLearnerProgress = async (progressData) => {
  const response = await apiLearner.post('/learner-progress', progressData);
  return response.data;
};

export const getLessonByCourse = async (idCourse) => {
  const response = await apiLearner.get(`/courses/${idCourse}/lessons`);
  return response;
}

export const updateLessonComplete = async (idProgress) => {
  const response = await apiLearner.get(`/updateLessonComplete/${idProgress}`);
  return response;
}

export const createSession = async (sessionData) => {
  const response = await apiLearner.post('/sessions', sessionData);
  return response.data;
}

export const getScheduledSessions = async (userId) => {
  const response = await apiLearner.get(`/coaches/schedule/${userId}`);
  return response.data;
}

export const getScheduledSessionsLearner = async (userId) => {
  const response = await apiLearner.get(`/learners/schedule/${userId}`);
  return response.data;
}
