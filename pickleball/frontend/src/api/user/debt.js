import apiUser from "./apiUser";

export const getDebtByIdLearner = (learnerId) => {
    return apiUser.get(`/debts/learner/${learnerId}`);
}