import apiCoach from "./apiCoach";
export const fetchCoachById = async (id) => {
  const response = await apiCoach.get(`/coaches/${id}`);
  return response.data;
}
export const fetchLearnerById = async (id) => {
  const response = await apiCoach.get(`/sessions/getLearner/${id}`);
  return response.data;
}
export const getSession = async (id) => {
  const response = await apiCoach.get(`/sessions/${id}`);
  return response.data;
}
export const getSessionbyCoach = async (id) => {
  const response = await apiCoach.get(`/sessions/getSessionByCoach/${id}`);
  return response.data;
}
export const updateStatus = async (id) => {
  const response = await apiCoach.put(`/sessions/status/${id}`,id);
  return response.data;
}
export const deleteSession = async (id) => {
  const response = await apiCoach.delete(`/sessions/${id}`);
  return response.data;
}