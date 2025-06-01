import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
    // State để lưu danh sách người dùng, trạng thái loading và lỗi
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm lấy danh sách người dùng từ API
    const fetchUsers = async () => {
        try {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Kiểm tra token trong console
            if (!token) {
                throw new Error('Vui lòng đăng nhập để xem danh sách người dùng');
            }

            // Gửi request GET tới API
            const response = await axios.get('http://localhost:8080/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Lưu dữ liệu người dùng vào state
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            // Xử lý lỗi
            setLoading(false);
            if (err.response) {
                // Lỗi từ server (403, 401, v.v.)
                if (err.response.status === 403) {
                    setError('Bạn không có quyền truy cập. Chỉ admin mới xem được danh sách người dùng.');
                } else if (err.response.status === 401) {
                    setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
                } else {
                    setError('Lỗi khi lấy danh sách người dùng: ' + err.response.data.error);
                }
            } else {
                // Lỗi mạng hoặc khác
                setError('Không thể kết nối đến server. Vui lòng kiểm tra backend.');
            }
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchUsers();
    }, []);

    // Hiển thị khi đang tải
    if (loading) {
        return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
    }

    // Hiển thị khi có lỗi
    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    // Hiển thị bảng dữ liệu
    return (
        <div className="container mt-5">
            <h2>Danh sách người dùng</h2>
            {users.length === 0 ? (
                <p>Không có người dùng nào.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Users;