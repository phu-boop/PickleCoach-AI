import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { getBookingStats, getUserRoleStats } from '../../api/admin/apiAdmin';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [bookingStats, setBookingStats] = useState([]);
    const [groupBy, setGroupBy] = useState('day');
    const [userRoleStats, setUserRoleStats] = useState({});
    const [loading, setLoading] = useState(false);
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const [bookingData, roleData] = await Promise.all([
                    getBookingStats(groupBy),
                    getUserRoleStats(),
                ]);
                setBookingStats(bookingData);
                setUserRoleStats(roleData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [groupBy]);

    // Chuẩn bị dữ liệu cho biểu đồ booking (Bar)
    const bookingChartData = {
        labels: bookingStats.map(item => item.date),
        datasets: [
            {
                label: 'Số lượng Booking',
                data: bookingStats.map(item => item.count),
                backgroundColor: 'rgba(99, 102, 241, 0.7)', // Indigo-400 với độ trong suốt
                borderColor: 'rgba(99, 102, 241, 1)', // Indigo-400
                borderWidth: 2,
                borderRadius: 5,
                barThickness: 20,
            },
        ],
    };

    const bookingChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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
                    color: 'rgba(0, 0, 0, 0.1)',
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
                    display: false,
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
                backgroundColor: 'rgba(45, 55, 72, 0.9)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
            },
        },
    };

    // Chuẩn bị dữ liệu cho biểu đồ vai trò (Pie)
    const roleChartData = {
        labels: ['Admin', 'Coach', 'Learner', 'User'].filter(role => userRoleStats[role.toLowerCase()] > 0),
        datasets: [
            {
                data: [
                    userRoleStats['admin'] || 0,
                    userRoleStats['coach'] || 0,
                    userRoleStats['learner'] || 0,
                    userRoleStats['USER'] || 0,
                ],
                backgroundColor: ['#4C51BF', '#60A5FA', '#FBBF24', '#34D399'], // Indigo-700, Blue-400, Amber-400, Emerald-400
                borderColor: '#000000', // Viền đen bên trong
                borderWidth: 2,
            },
        ],
    };

    const roleChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                align: 'center',
                labels: {
                    font: { size: 14, weight: 'bold' },
                    color: '#4B5563', // Gray-600
                    padding: 8,
                    boxWidth: 12,
                    boxHeight: 12,
                    generateLabels: function (chart) {
                        const data = chart.data;
                        return data.labels.map((label, index) => ({
                            text: label,
                            fillStyle: data.datasets[0].backgroundColor[index],
                            strokeStyle: data.datasets[0].borderColor[index],
                            lineWidth: data.datasets[0].borderWidth,
                            hidden: !chart.getDataVisibility(index),
                            index: index,
                        }));
                    },
                },
            },
            title: {
                display: true,
                text: 'Phân bố Vai trò Người dùng',
                font: { size: 18, weight: 'bold' },
                color: '#2d3748',
            },
            tooltip: {
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                titleFont: { size: 16, weight: 'bold' },
                bodyFont: { size: 14 },
                padding: 12,
                borderColor: '#4C51BF', // Indigo-700
                borderWidth: 1,
                borderRadius: 8,
            },
        },
    };

    const totalUsers = userRoleStats.total || 0;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <h1 className="text-4xl font-extrabold text-indigo-900 mb-6 drop-shadow-md">Admin Dashboard</h1>
            <p className="text-gray-600 text-center max-w-2xl mb-8 text-lg leading-relaxed">
                Welcome to the admin dashboard. Here you can manage your application efficiently.
            </p>
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {loading ? (
                            <p className="text-center text-indigo-600 font-medium">Đang tải dữ liệu...</p>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-center space-x-4 mb-4">
                                    <button
                                        onClick={() => setGroupBy('day')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-md ${
                                            groupBy === 'day' ? 'ring-2 ring-indigo-400' : ''
                                        }`}
                                    >
                                        Ngày
                                    </button>
                                    <button
                                        onClick={() => setGroupBy('month')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-md ${
                                            groupBy === 'month' ? 'ring-2 ring-indigo-400' : ''
                                        }`}
                                    >
                                        Tháng
                                    </button>
                                    <button
                                        onClick={() => setGroupBy('year')}
                                        className={`px-4 py-2 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-md ${
                                            groupBy === 'year' ? 'ring-2 ring-indigo-400' : ''
                                        }`}
                                    >
                                        Năm
                                    </button>
                                </div>
                                <div className="h-80">
                                    <Bar data={bookingChartData} options={bookingChartOptions} ref={barChartRef} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        {loading ? (
                            <p className="text-center text-indigo-600 font-medium">Đang tải dữ liệu...</p>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="h-80 w-full max-w-2xl">
                                    <Pie data={roleChartData} options={roleChartOptions} ref={pieChartRef} />
                                </div>
                                <p className="text-2xl font-bold text-indigo-800 mt-8">
                                    Tổng số tài khoản: {totalUsers}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;