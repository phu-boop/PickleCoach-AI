import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const ForgotPasswordEmail = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json(); // Đảm bảo phân tích JSON
            console.log('Response:', response); // Debug: Log toàn bộ response
            console.log('Data:', data); // Debug: Log dữ liệu trả về
            setMessage(data.message || 'An unexpected error occurred');
            if (response.ok) {
                navigate('/auth/enter-otp');
            } else {
                setMessage(data.message || 'Server returned an error');
            }
        } catch (error) {
            console.error('Error:', error); // Debug: Log lỗi chi tiết
            setMessage('Request failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-[#2b8ba3] mb-4">Quên Mật Khẩu</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                        required
                    />
                    <Button type="submit">Gửi Yêu Cầu</Button>
                </form>
                {message && <Alert type="info" message={message} onClose={() => setMessage('')} />}
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;