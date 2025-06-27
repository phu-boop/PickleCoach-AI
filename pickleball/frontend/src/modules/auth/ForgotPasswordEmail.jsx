import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/users/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.text();
            if (response.ok) {
                localStorage.setItem('resetEmail', email); // Lưu email vào localStorage
                navigate('/auth/enter-otp');
            } else {
                setError(data); // Hiển thị thông báo lỗi từ backend
            }
        } catch (error) {
            console.error(error);
            setError('Đã xảy ra lỗi, vui lòng thử lại.');
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-[#dff5f9] px-4">
            <button
                onClick={() => (window.location.href = 'http://localhost:5173/login')}
                className="absolute top-6 right-6 text-lg text-[#ea6645] border border-[#ea6645] px-5 py-2 rounded-full bg-[#ffe6e6] hover:bg-[#efc8c8] font-semibold shadow-sm"
            >
                ✕ Cancel
            </button>
            <div className="w-full max-w-lg text-center px-10 py-14 bg-white rounded-3xl shadow-xl border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-[#d1f0f6] p-5 rounded-full">
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#2c91aa" strokeWidth="1.5">
                            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
                            <polyline points="3 6 12 13 21 6" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-[#2c91aa] mb-2">Forgot Password?</h2>
                <p className="text-base text-gray-600 mb-8">Enter your email and we’ll send you a code.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(''); // Xóa thông báo lỗi khi thay đổi email
                        }}
                        placeholder="you@example.com"
                        className="w-full border border-gray-200 rounded-xl px-5 py-4 text-base focus:ring-2 focus:ring-[#2c91aa] bg-gray-50"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#2c91aa] text-white rounded-full py-4 text-lg font-semibold hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] shadow-md"
                    >
                        Send Code
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordEmail;