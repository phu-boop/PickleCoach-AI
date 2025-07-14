// src/api/listLearner.js
import apiAdmin from './apiAdmin';

export const fetchLearner = () => {
  return apiAdmin.get('/learners');
};

export const deleteLearner = (learnerId) => {
  return apiAdmin.delete(`/learners/${learnerId}`);
};

export const fetchLearnerById = (LearnerId) => {
  return apiAdmin.get(`/learners/${LearnerId}`);
};

export const updateLearner = (LearnerId, LearnerData) => {
  return apiAdmin.put(`/learners/${LearnerId}`, LearnerData);
};

export const createLearner = (Learner) => {
  return apiAdmin.post('/learners/register', Learner);
};

