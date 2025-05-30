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

// Bạn có thể thêm các API khác tại đây
// export async function callSomethingElse() {
//   ...
// }
