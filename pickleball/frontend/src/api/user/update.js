import apiUser from "./apiUser";

export const createUpdate = (data) => {
  const jsonData = JSON.stringify(data);
  console.log(jsonData);
  return apiUser.post("/learners",jsonData);
}