import React, { useState, useEffect } from 'react';
import {getCoaches} from '../../../api/admin/coach';
//import {createSession} from '../../../api/learner/learningService';
export default function CoachBookingPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await getCoaches(); // Gọi API
        setCoaches(response); // Lưu dữ liệu từ API vào state
        setLoading(false);
      } catch (err) {
        console.log('Lỗi khi gọi API:', err);
        setError('Không thể tải danh sách huấn luyện viên');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  const handleBook = (userId) => {
    alert(`🗓️ Bạn chọn đặt lịch với huấn luyện viên ID: ${userId}`);
    // Sau này mở modal hoặc route qua trang chi tiết đặt lịch
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-indigo-600">Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen py-10 px-4 sm:px-8">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">
        🧑‍🏫 Chọn Huấn luyện viên để đặt lịch
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {coaches.map((coach) => (
          <div
            key={coach.userId}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col items-center"
          >
            {/* Sử dụng avatar placeholder vì API không cung cấp avatar */}
            <img
              src={`https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`}
              alt={coach.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200 shadow mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-1">{coach.name}</h2>
            <p className="text-gray-500 text-sm text-center mb-4">
              {coach.certifications.join(', ') || 'Chưa có thông tin chứng chỉ'}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {coach.specialties.map((specialty, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>

            <p className="text-gray-600 text-sm mb-4">
              <strong>Thời gian rảnh:</strong> {coach.availability.join(', ') || 'Chưa có lịch'}
            </p>

            <button
              onClick={() => handleBook(coach.userId)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-md"
            >
              Đặt lịch ngay
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}