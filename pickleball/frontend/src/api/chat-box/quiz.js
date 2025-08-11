import axios from '../user/apiUser.js';

// nhận một object { learnerId, topic, level }
export const generateQuiz = async ({ learnerId, topic, level }) => {
    return axios.post('/questions/ai/generate', {
        learnerId,
        topic,
        level
    });
};

export const saveQuizResult = async (result) => {
    return axios.post('/questions/ai/save-result', result);
};