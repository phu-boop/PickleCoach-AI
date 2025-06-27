import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterOTP = () => {
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [error, setError] = useState('');
    const inputsRef = useRef([]);
    const navigate = useNavigate();
    const [resendTimer, setResendTimer] = useState(15); // Bắt đầu với 15 giây khi vào trang
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0 && !canResend) {
            setCanResend(true);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [resendTimer, canResend]);

    const handleChange = (element, index) => {
        const value = element.value.replace(/[^0-9]/g, '');
        if (!value) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(''); // Xóa thông báo lỗi khi nhập lại
        if (index < 5 && value) {
            inputsRef.current[index + 1].focus();
        } else if (index === 5 && value) {
            inputsRef.current[0].focus(); // Quay lại ô đầu nếu nhập đủ
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            e.preventDefault(); // Ngăn hành vi mặc định
            const newOtp = [...otp];
            if (!newOtp[index] && index > 0) {
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputsRef.current[index - 1].focus();
            } else if (newOtp[index]) {
                newOtp[index] = '';
                setOtp(newOtp);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            try {
                const response = await fetch('http://localhost:8080/api/users/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ otp: otpValue }),
                });
                if (response.ok) navigate('/auth/reset-password');
                else setError('OTP không đúng');
            } catch (error) {
                console.error(error);
                setError('OTP không đúng');
            }
        } else {
            setError('Vui lòng nhập đủ 6 số');
        }
    };

    const handleResendOtp = async () => {
        if (canResend) {
            try {
                const email = localStorage.getItem('resetEmail');
                if (email) {
                    const response = await fetch('http://localhost:8080/api/users/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                    });
                    if (response.ok) {
                        setResendTimer(15);
                        setCanResend(false);
                        setOtp(Array(6).fill('')); // Xóa OTP cũ khi gửi lại
                        setError(''); // Xóa thông báo lỗi khi gửi lại
                        inputsRef.current[0].focus();
                    }
                }
            } catch (error) {
                console.error('Failed to resend OTP:', error);
            }
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
                            <path d="M4 4h16v12H4z" />
                            <path d="M22 6l-10 7L2 6" />
                            <path d="M6 18h12" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-[#2c91aa] mb-2">Enter OTP</h2>
                <p className="text-base text-gray-600 mb-6">Check your email and enter the 6-digit code we sent.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-3">
                        {otp.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={value}
                                ref={(el) => (inputsRef.current[index] = el)}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-14 h-16 text-center text-2xl border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-[#2c91aa]"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#2c91aa] text-white rounded-full py-4 text-lg font-semibold hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] shadow-md"
                    >
                        Confirm
                    </button>
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend}
                        className={`w-full text-[#2c91aa] text-lg font-semibold ${!canResend ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                    >
                        {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnterOTP;