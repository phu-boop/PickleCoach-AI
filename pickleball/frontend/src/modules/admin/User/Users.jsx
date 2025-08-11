import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser, createUser } from '../../../api/admin/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import Alert from '../../../components/Alert';
const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    console.log(sessionStorage.getItem('token'));
    console.log(sessionStorage.getItem('role'));
    const navigate = useNavigate();

    const fetchUsersLoad = async () => {
        try {
            const response = await fetchUsers();
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('Access denied. Only admins can view the user list.');
                } else if (err.response.status === 401) {
                    setError('Session expired. Please log in again.');
                } else {
                    setError('Error fetching users: ' + err.response.data.error);
                }
            } else {
                setError('Unable to connect to the server. Please check your backend.');
            }
        }
    };

    const handleDelete = async (userId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await handleDeleteUser(userId);
                if (success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The user has been deleted.",
                        icon: "success"
                    });
                    setUsers(users.filter(user => user.userId !== userId));
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "There was an error deleting the user.",
                        icon: "error"
                    });
                }
            }
        });
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if (response) {
                return true;
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        }
        return false;
    };

    const handleEdit = (userId) => {
        navigate(`/admin/users/edit/${userId}`);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await createUser(newUser);
            if (response.status === 201 || response.status === 200) {
                Swal.fire('Success', 'User created successfully', 'success');
                setNewUser({ name: '', email: '', password: '' });
                setShowCreateForm(false);
                fetchUsersLoad();
            }
        } catch (err) {
            const isValidEmail = /^\S+@\S+\.\S+$/.test(newUser.email);
            const isValidPassword = newUser.password.length >= 6;
            if (!isValidEmail) {
                setShowAlert(true);
                setAlertMessage('Invalid email format. Please enter a valid email address.');
                return;
            }else if (!isValidPassword) {
                setShowAlert(true);
                setAlertMessage('Password must be at least 6 characters long.');
                return;
            }else{
                setShowAlert(true);
                setAlertMessage('email already exists. Please use a different email.');
            }

            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsersLoad();
    }, []);

    if (loading) {
        return <div className="text-center mt-5">Loading data...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">User List</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="bg-[#7d7ff4] hover:bg-[#4c4eb2] text-white px-4 py-2 rounded-lg transition duration-200 cursor-pointer"
                >
                    {showCreateForm ? 'Close Form' : '+ Add User'}
                </button>
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreateUser} className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            value={newUser.name}
                            onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                            placeholder="Name"
                            required
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="email"
                            value={newUser.email}
                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                            placeholder="Email"
                            required
                            className="border rounded px-3 py-2"
                        />
                        <input
                            type="password"
                            value={newUser.password}
                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            placeholder="Password"
                            required
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <div className='flex gap-4'>
                        <button
                            type="submit"
                            className="mt-4 bg-[#7d7ff4] hover:bg-[#5758ad] text-white px-4 py-2 rounded-lg cursor-pointer"
                        >
                            Create
                        </button>
                        <div className='mt-4 w-full'>
                        {showAlert && (
                            <Alert
                                message={alertMessage}
                                onClose={() => setShowAlert(false)}
                                type="info"
                            />
                        )}
                        </div>
                    </div>
                </form>
            )}

            {users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.userId} className="border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-800">{user.userId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                                    <td className="px-6 py-4 text-center space-x-4">
                                        <button
                                            onClick={() => handleEdit(user.userId)}
                                            className="bg-[#9798f0] cursor-pointer hover:bg-[#696ac5] text-white p-2 rounded-lg transition duration-200"
                                            title="Edit"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(user.userId)}
                                            className="bg-[#ea7060] cursor-pointer hover:bg-[#b55151] text-white p-2 rounded-lg transition duration-200"
                                            title="Delete"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
