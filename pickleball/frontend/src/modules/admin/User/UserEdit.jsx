import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../../../api/admin/user'; // Đảm bảo bạn có API này
import Swal from 'sweetalert2';

const UserEdit = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUserById(userId);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(userId, user);
      Swal.fire('Success', 'User updated successfully', 'success');
      navigate('/admin/users');
    } catch (err) {
        console.error('Error updating user:', err);
      Swal.fire('Error', 'Failed to update user', 'error');
    }
  };

  if (loading) return <div className="mt-5 text-center">Loading...</div>;
  if (error) return <div className="mt-5 text-red-600 text-center">{error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
          <div className="flex justify-between">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
                >
                    Update
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
      </form>
    </div>
  );
};

export default UserEdit;
