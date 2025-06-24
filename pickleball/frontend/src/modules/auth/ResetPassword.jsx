import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Mật khẩu không khớp');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            console.log('Response:', response); // Debug
            console.log('Data:', data); // Debug
            setMessage(data.message || 'An unexpected error occurred');
            if (response.ok) {
                // Chuyển hướng tuyệt đối đến trang login
                window.location.href = 'http://localhost:5173/login';
            } else {
                setMessage(data.message || 'Server returned an error');
            }
        } catch (error) {
            console.error('Error:', error); // Debug
            setMessage('Request failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-[#2b8ba3] mb-4">Đặt Lại Mật Khẩu</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                        required
                    />
                    <Button type="submit">Lưu</Button>
                </form>
                {message && <Alert type="info" message={message} onClose={() => setMessage('')} />}
            </div>
        </div>
    );
};

export default ResetPassword;