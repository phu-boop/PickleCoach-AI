// src/api/listUser.js
import apiAdmin from './apiAdmin';

// Lấy danh sách người dùng
export const fetchUsers = () => {
  return apiAdmin.get('/users');
};

// Xóa người dùng
export const deleteUser = (userId) => {
  return apiAdmin.delete(`/users/${userId}`);
};
// Lấy thông tin người dùng theo ID
export const fetchUserById = (userId) => {
  return apiAdmin.get(`/users/${userId}`);
};
// Sửa người dùng (giả sử bạn có updateUser)
export const updateUser = (userId, userData) => {
  return apiAdmin.put(`/users/${userId}`, userData);
};
// Thêm người dùng mới 
export const createUser = (user) => {
  return apiAdmin.post('/users/register', user);
};

