import axios from 'axios';

const apiAdmin = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm interceptor để tự động đính kèm token vào mỗi request
apiAdmin.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Hàm lấy dữ liệu booking stats
export const getBookingStats = async (groupBy) => {
    const response = await apiAdmin.get(`/dashboard/bookings/stats?groupBy=${groupBy}`);
    return response.data;
};

export default apiAdmin;