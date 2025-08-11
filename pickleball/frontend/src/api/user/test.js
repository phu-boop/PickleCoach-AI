import apiUser from "./apiUser";

export const getQuiz = () => {
  return apiUser.get("/questions/quiz");
}

export const submitQuiz = (answers) => {
  return apiUser.post("/questions/submit", answers)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error("Error in submitQuiz API call:", error.response?.data || error.message);
      throw error; 
    });
}