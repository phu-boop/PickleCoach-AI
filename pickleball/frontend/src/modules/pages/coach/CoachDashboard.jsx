import React from 'react';

export default function CoachDashboard() {
  const todaySchedule = [
    { time: '08:00', learner: 'Nguyễn Văn A', status: 'Đã xác nhận' },
    { time: '10:00', learner: 'Trống', status: 'Trống' },
    { time: '15:00', learner: 'Trần Thị B', status: 'Hoàn tất' },
  ];

  const learners = [
    { name: 'Nguyễn Văn A', lastSession: '20/6', rating: 'Tốt' },
    { name: 'Trần Thị B', lastSession: '22/6', rating: 'Trung bình' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">🎓 Coach Dashboard</h1>

      {/* Coach Info */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Chào Coach Nam!</h2>
          <p>Lịch hôm nay: <strong>3 buổi</strong> | Học viên mới: <strong>2</strong></p>
        </div>
        <img src="/avatar-coach.png" alt="Coach" className="w-16 h-16 rounded-full object-cover" />
      </div>

      {/* Today Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">📅 Lịch dạy hôm nay</h3>
          <ul className="divide-y">
            {todaySchedule.map((item, index) => (
              <li key={index} className="py-2 flex justify-between items-center">
                <span>{item.time} - {item.learner}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  item.status === 'Trống'
                    ? 'bg-gray-200 text-gray-600'
                    : item.status === 'Đã xác nhận'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Learner List */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2">👨‍🎓 Học viên</h3>
          <ul className="divide-y">
            {learners.map((learner, index) => (
              <li key={index} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{learner.name}</p>
                    <p className="text-sm text-gray-500">Buổi gần nhất: {learner.lastSession}</p>
                  </div>
                  <span className="text-sm text-blue-600">{learner.rating}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow">
          Quản lý lịch
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow">
          Xem báo cáo
        </button>
      </div>
    </div>
  );
}
