import apiLearner from './apiLearner';

// Gọi API tạo link thanh toán
export const createPayment = async (orderId, amount) => {
    const response = await apiLearner.get(`/vnpay/create_payment`, {
        params: { orderId, amount }
    });
    return response.data; // axios trả JSON tại đây
};
