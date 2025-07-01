import React, { useState } from 'react';

export default function CoachSchedule() {
  const [schedule, setSchedule] = useState([
    { id: 1, date: '2025-06-26', time: '08:00', learner: 'Nguyễn Văn A', status: 'Đã xác nhận' },
    { id: 2, date: '2025-06-26', time: '10:00', learner: '', status: 'Trống' },
    { id: 3, date: '2025-06-26', time: '15:00', learner: 'Trần Thị B', status: 'Hoàn tất' },
  ]);

  const handleConfirm = (id) => {
    const updated = schedule.map(item =>
      item.id === id ? { ...item, status: 'Đã xác nhận' } : item
    );
    setSchedule(updated);
  };

  const handleCancel = (id) => {
    const updated = schedule.map(item =>
      item.id === id ? { ...item, status: 'Đã huỷ' } : item
    );
    setSchedule(updated);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">📅 Quản lý Lịch Dạy</h1>

      <div className="bg-white p-4 rounded-xl shadow">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">Ngày</th>
              <th className="p-3">Giờ</th>
              <th className="p-3">Học viên</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.date}</td>
                <td className="p-3">{item.time}</td>
                <td className="p-3">{item.learner || <em className="text-gray-400">Trống</em>}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium
                    ${item.status === 'Đã xác nhận' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Hoàn tất' ? 'bg-green-100 text-green-700' :
                      item.status === 'Đã huỷ' ? 'bg-red-100 text-red-700' :
                      'bg-gray-200 text-gray-600'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  {item.status === 'Trống' && (
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => handleConfirm(item.id)}>
                      Đặt lịch
                    </button>
                  )}
                  {item.status === 'Đã xác nhận' && (
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleCancel(item.id)}>
                      Huỷ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
