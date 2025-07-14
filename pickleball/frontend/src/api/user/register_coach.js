import apiUser from "./apiUser";

export const registerCoach = (data) => {
  return apiUser.post("/coaches", data)
    .then(response => {
      return response.data; 
    })
    .catch(error => {
      console.error("Error in registerCoach API call:", error.response?.data || error.message);
      throw error; 
    });
}