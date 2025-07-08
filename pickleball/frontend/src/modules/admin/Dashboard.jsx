import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { getBookingStats, getUserRoleStats } from '../../api/admin/apiAdmin';

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

    const bookingChartData = {
        labels: bookingStats.map(item => item.date),
        datasets: [
            {
                label: 'Số lượng Booking',
                data: bookingStats.map(item => item.count),
                backgroundColor: 'rgba(99, 102, 241, 0.7)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 2,
                borderRadius: 6,
                barThickness: 18,
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
                ticks: { font: { size: 12 } },
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
            x: {
                title: {
                    display: true,
                    text: groupBy === 'day' ? 'Ngày' : groupBy === 'month' ? 'Tháng' : 'Năm',
                    font: { size: 14, weight: 'bold' },
                },
                ticks: { font: { size: 12 } },
                grid: { display: false },
            },
        },
        plugins: {
            legend: {
                position: 'top',
                labels: { font: { size: 14 }, color: '#333' },
            },
            title: {
                display: true,
                text: 'Biểu đồ Booking theo thời gian',
                font: { size: 18, weight: 'bold' },
                color: '#1a202c',
            },
        },
    };

    const roleChartData = {
        labels: ['Admin', 'Coach', 'Learner', 'User'].filter(
            role => userRoleStats[role.toLowerCase()] > 0
        ),
        datasets: [
            {
                data: [
                    userRoleStats['admin'] || 0,
                    userRoleStats['coach'] || 0,
                    userRoleStats['learner'] || 0,
                    userRoleStats['USER'] || 0,
                ],
                backgroundColor: ['#6366F1', '#3B82F6', '#F59E0B', '#10B981'],
                borderColor: '#fff',
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
                labels: {
                    font: { size: 14 },
                    color: '#4B5563',
                    padding: 10,
                    boxWidth: 14,
                },
            },
            title: {
                display: true,
                text: 'Tỷ lệ Vai trò Người dùng',
                font: { size: 18, weight: 'bold' },
                color: '#1a202c',
            },
        },
    };

    const totalUsers = userRoleStats.total || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 py-10 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-4 drop-shadow-md">
                    Admin Dashboard
                </h1>
                <p className="text-lg text-gray-600 text-center mb-10">
                    Xem thống kê và quản lý hệ thống dễ dàng, trực quan.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Booking Bar Chart */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-all duration-300">
                        {loading ? (
                            <p className="text-center text-indigo-500 font-semibold">Đang tải dữ liệu...</p>
                        ) : (
                            <>
                                <div className="flex justify-center gap-4 mb-6">
                                    {['day', 'month', 'year'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setGroupBy(option)}
                                            className={`px-5 py-2 rounded-full font-semibold text-sm transition
                                                ${
                                                groupBy === option
                                                    ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-300 scale-105'
                                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                            }`}
                                        >
                                            {option === 'day' ? 'Ngày' : option === 'month' ? 'Tháng' : 'Năm'}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-80 bg-indigo-50 rounded-xl p-4">
                                    <Bar data={bookingChartData} options={bookingChartOptions} ref={barChartRef} />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pie Chart - Roles */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-indigo-100 transition-all duration-300 flex flex-col items-center">
                        {loading ? (
                            <p className="text-center text-indigo-500 font-semibold">Đang tải dữ liệu...</p>
                        ) : (
                            <>
                                <div className="h-80 w-full max-w-md bg-indigo-50 p-4 rounded-xl">
                                    <Pie data={roleChartData} options={roleChartOptions} ref={pieChartRef} />
                                </div>
                                <p className="text-xl font-bold text-indigo-800 mt-6">
                                    Tổng số người dùng: {totalUsers}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
