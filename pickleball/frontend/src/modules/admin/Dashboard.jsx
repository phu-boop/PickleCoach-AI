import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getBookingStats } from '../../api/admin/apiAdmin';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [groupBy, setGroupBy] = useState('day');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const data = await getBookingStats(groupBy);
                setStats(data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu booking:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [groupBy]);

// Chuẩn bị dữ liệu cho Chart.js với màu sắc đẹp hơn
    const chartData = {
        labels: stats.map(item => item.date),
        datasets: [
            {
                label: 'Số lượng Booking',
                data: stats.map(item => item.count),
                backgroundColor: 'rgba(139, 0, 255, 0.7)', // Màu tím đậm (thay đổi từ xanh lá)
                borderColor: 'rgba(139, 0, 255, 1)', // Viền tím đậm
                borderWidth: 2,
                borderRadius: 5, // Bo góc cột
                barThickness: 20, // Độ dày cột
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Cho phép điều chỉnh kích thước linh hoạt
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số lượng Booking',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    font: { size: 12 },
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)', // Màu lưới nhẹ nhàng
                },
            },
            x: {
                title: {
                    display: true,
                    text: groupBy === 'day' ? 'Ngày' : groupBy === 'month' ? 'Tháng' : 'Năm',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: {
                    font: { size: 12 },
                },
                grid: {
                    display: false, // Ẩn lưới trục x để gọn gàng
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: { size: 14 },
                    color: '#333',
                },
            },
            title: {
                display: true,
                text: 'Thống kê Booking',
                font: { size: 18, weight: 'bold' },
                color: '#2d3748',
            },
            tooltip: {
                backgroundColor: 'rgba(45, 55, 72, 0.9)', // Màu nền tooltip
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
            },
        },
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8 text-center max-w-2xl">
                Welcome to the admin dashboard. Here you can manage your application.
            </p>
            <div className="w-full max-w-5xl">
                <div className="mb-6 flex justify-center space-x-4">
                    <button
                        onClick={() => setGroupBy('day')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            groupBy === 'day'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Theo Ngày
                    </button>
                    <button
                        onClick={() => setGroupBy('month')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            groupBy === 'month'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Theo Tháng
                    </button>
                    <button
                        onClick={() => setGroupBy('year')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                            groupBy === 'year'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Theo Năm
                    </button>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-600">Đang tải dữ liệu...</p>
                    ) : (
                        <div className="h-96"> {/* Chiều cao cố định cho biểu đồ */}
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Dashboard;