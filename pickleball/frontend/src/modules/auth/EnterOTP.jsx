import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert';

const EnterOTP = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp }),
            });
            const data = await response.json();
            console.log('Response:', response); // Debug
            console.log('Data:', data); // Debug
            setMessage(data.message || 'An unexpected error occurred');
            if (response.ok) {
                navigate('/auth/reset-password');
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
                <h1 className="text-2xl font-bold text-[#2b8ba3] mb-4">Nhập Mã OTP</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập mã OTP"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                        required
                    />
                    <Button type="submit">Xác Nhận</Button>
                </form>
                {message && <Alert type="info" message={message} onClose={() => setMessage('')} />}
            </div>
        </div>
    );
};

export default EnterOTP;