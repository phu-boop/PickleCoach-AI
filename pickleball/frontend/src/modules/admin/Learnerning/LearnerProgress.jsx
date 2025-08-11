import React, { useState } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { getLearnerProgress } from '../../../api/admin/learningService';

const LearnerProgress = () => {
  const [learnerId, setLearnerId] = useState('');
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetchProgress = async () => {
    if (!learnerId) return;
    setLoading(true);
    try {
      const data = await getLearnerProgress(learnerId);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <FaChartLine className="mr-2" /> Tiến độ học viên
      </h1>

      {/* Form nhập learnerId */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Tìm tiến độ học viên</h2>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Nhập ID học viên"
            value={learnerId}
            onChange={(e) => setLearnerId(e.target.value)}
            className="border rounded-lg p-2 flex-1"
          />
          <button
            onClick={handleFetchProgress}
            className="bg-blue-500 text-white rounded-lg p-2"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Danh sách tiến độ */}
      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          {progress.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-700">
                  <th className="p-2">Bài học</th>
                  <th className="p-2">Hoàn thành</th>
                  <th className="p-2">Thời gian xem (giây)</th>
                  <th className="p-2">Lần xem cuối</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-2">{item.lesson.title}</td>
                    <td className="p-2">{item.isCompleted ? 'Có' : 'Không'}</td>
                    <td className="p-2">{item.watchedDurationSeconds}</td>
                    <td className="p-2">{new Date(item.lastWatchedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Chưa có dữ liệu tiến độ.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnerProgress;