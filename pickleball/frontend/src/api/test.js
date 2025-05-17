import axios from 'axios';

// Cấu hình sẵn axios instance nếu cần (tùy chọn)
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL gốc của backend
  timeout: 5000, // timeout sau 5 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm gọi API /hello
export default async function callHelloApi() {
  try {
    const response = await apiClient.get('/hello');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi gọi API /hello:', error);
    throw error;
  }
}

// Bạn có thể thêm các API khác tại đây
// export async function callSomethingElse() {
//   ...
// }
