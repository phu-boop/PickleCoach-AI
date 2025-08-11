import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', // URL của Spring Boot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm xử lý callback từ Google OAuth2
const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const role = urlParams.get('role');
  const message = urlParams.get('message');

  console.log('URL Params:', { token, role, message }); // Debug

  if (token && role) {
    try {
      // Lưu thông tin vào sessionStorage
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('email', ''); // Cập nhật email từ API nếu cần
      sessionStorage.setItem('id_user', ''); // Cập nhật id từ API nếu cần
      console.log('OAuth2 Success:', message);
      window.location.href = '/'; // Chuyển hướng về trang chính
    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      window.location.href = '/login?error=' + encodeURIComponent('Failed to process login');
    }
  } else {
    console.error('Token or role is missing:', { token, role, message });
    window.location.href = '/login?error=' + encodeURIComponent('Authentication failed');
  }
};

// Gọi handleOAuthCallback khi có query params (bất kỳ path nào)
if (window.location.search) {
  handleOAuthCallback();
}

export default apiClient;