import React, { useState } from 'react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            if (response.ok) window.location.href = 'http://localhost:5173/login';
        } catch (error) {
            setError('Failed to reset password.');
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
                            <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-[#2c91aa] mb-6">Create New Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-5 py-4 text-base bg-gray-50 focus:ring-2 focus:ring-[#2c91aa]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-base font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-5 py-4 text-base bg-gray-50 focus:ring-2 focus:ring-[#2c91aa]"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#2c91aa] text-white rounded-full py-4 text-lg font-semibold hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] shadow-md"
                    >
                        Confirm
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
