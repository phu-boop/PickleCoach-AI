import apiAdmin from './apiAdmin';


export const fetchQuestion = () => {
  return apiAdmin.get('/questions');
};


export const deleteQuestion = (questionId) => {
  return apiAdmin.delete(`/questions/${questionId}`);
};

export const fetchQuestionById = (questionId) => {
   return apiAdmin.get(`/questions/${questionId}`);
};

export const updateQuestion = (questionId, questionData) => {
   return apiAdmin.put(`/questions/${questionId}`, questionData);
};

export const createQuestion = (question) => {
  return apiAdmin.post('/questions', question);
};

