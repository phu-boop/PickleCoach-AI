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
export const fetchCoachById = async (userId) => {
    try {
        const response = await apiAdmin.get(`/coaches/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching coach by ID:", error);
        throw error;
    }
}

export const updateCoach = async (userId, coachData) => {
    try {
        const response = await fetch(`http://localhost:8080/api/coaches/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // QUAN TRỌNG: Phải set content-type này
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: coachData.name,
                level: coachData.level,
                // Thêm các trường khác nếu cần
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to update coach');
        }

        return response;
    } catch (error) {
        console.error('Error updating coach:', error);
        throw error;
    }
};