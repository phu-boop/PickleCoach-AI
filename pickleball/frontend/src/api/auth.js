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
