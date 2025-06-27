import apiAdmin from "./apiAdmin";

export const getCoaches = async (params) => {
    try {
        const response = await apiAdmin.get("/coaches", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching coaches:", error);
        throw error;
    }
}
export const confirm = async (userId) => {
    try {
        const response = await apiAdmin.get(`/coaches/confirm/${userId}`);
        return response;
    } catch (error) {
        console.error("Error confirming coach:", error);
        throw error;
    }
}
export const deleteCoach = async (userId) => {
    try {
        const response = await apiAdmin.delete(`/coaches/${userId}`);
        return response;
    } catch (error) {
        console.error("Error deleting coach:", error);
        throw error;
    }
}