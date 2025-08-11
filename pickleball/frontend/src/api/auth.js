import apiClient from './apiClient';

// Hàm gọi API /hello
export default async function ApiRegister(name, email, password) {
  try {
    const response = await apiClient.post('api/users/register',{name, email, password});
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /register:', error);
    throw error;
  }
}

export async function ApiLogin(email, password) {
  try {
    const response = await apiClient.post('api/users/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /login:', error);
    throw error;
  }
}

// Thêm hàm cho Google Login (nếu cần xử lý callback)
export async function handleGoogleCallback() {
  // Logic xử lý sau khi Google redirect về (nếu cần)
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token'); // Giả sử backend trả token qua query param
  if (token) {
    // Lưu token và gọi login từ AuthContext
    // Cần tích hợp với backend để lấy token từ /login/oauth2/code/google
  }
}
