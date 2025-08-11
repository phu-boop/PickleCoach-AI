import React, { useState, useEffect } from 'react';
import { fetchLearner, deleteLearner, fetchLearnerById, updateLearner, createLearner } from "../../../api/admin/learner";

const Learner = () => {
  const [learners, setLearners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLearner, setNewLearner] = useState({
    userName: '',
    skillLevel: 'Beginner',
    goals: '',
    progress: 'Just started'
  });
  const [editLearner, setEditLearner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch learners on component mount
  useEffect(() => {
    const loadLearners = async () => {
      try {
        const response = await fetchLearner();
        setLearners(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError('Error loading learners');
        setLoading(false);
      }
    };
    loadLearners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLearner({ ...newLearner, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditLearner({ ...editLearner, [name]: value });
  };

  const handleAddLearner = async (e) => {
    e.preventDefault();
    try {
      const response = await createLearner(newLearner);
      setLearners([...learners, response.data]);
      setNewLearner({
        userName: '',
        skillLevel: 'Beginner',
        goals: '',
        progress: 'Just started'
      });
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      setError('Error adding learner');
    }
  };

  const handleEditLearner = async (e) => {
    e.preventDefault();
    try {
      const response = await updateLearner(editLearner.id, editLearner);
      setLearners(learners.map(l => l.id === editLearner.id ? response.data : l));
      setIsEditModalOpen(false);
      setEditLearner(null);
    } catch (err) {
      console.log(err);
      setError('Error updating learner');
    }
  };

  const handleDeleteLearner = async (id) => {
    try {
      await deleteLearner(id);
      setLearners(learners.filter(l => l.id !== id));
    } catch (err) {
      console.log(err);
      setError('Error deleting learner');
    }
  };

  const handleOpenEditModal = async (id) => {
    try {
      const response = await fetchLearnerById(id);
      setEditLearner(response.data);
      setIsEditModalOpen(true);
    } catch (err) {
      console.log(err);
      setError('Error loading learner details');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg shadow-inner mt-8">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg shadow-inner mt-8">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!learners || learners.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg shadow-inner mt-8">
        <p className="text-gray-600 text-lg">
          No learners found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left font-grandstander">
          Learner Management
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 sm:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
        >
          Add Learner
        </button>
      </div>

      {/* Modal for Adding Learner */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Add New Learner
            </h3>
            <form onSubmit={handleAddLearner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learner Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={newLearner.userName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter learner name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={newLearner.skillLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goals
                </label>
                <input
                  type="text"
                  name="goals"
                  value={newLearner.goals}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter goals (comma-separated)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress
                </label>
                <input
                  type="text"
                  name="progress"
                  value={newLearner.progress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter progress"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Learner */}
      {isEditModalOpen && editLearner && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-95">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Learner Information
            </h3>
            <form onSubmit={handleEditLearner} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learner Name
                </label>
                <input
                  type="text"
                  name="userName"
                  value={editLearner.userName}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter learner name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={editLearner.skillLevel}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goals
                </label>
                <input
                  type="text"
                  name="goals"
                  value={editLearner.goals}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter goals (comma-separated)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress
                </label>
                <input
                  type="text"
                  name="progress"
                  value={editLearner.progress}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter progress"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Skill Level
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Goals
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Progress
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {learners.map((learner) => (
                <tr key={learner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {learner.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {learner.userName || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full bg-blue-100 text-blue-800">
                      {learner.skillLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {Array.isArray(learner.goals) ? learner.goals.join(', ') : learner.goals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                      {learner.progress}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(learner.id)}
                      className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 px-3 py-1 rounded-md border border-indigo-600 hover:border-indigo-900 transition-colors duration-200 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLearner(learner.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 px-3 py-1 rounded-md border border-red-600 hover:border-red-900 transition-colors duration-200 cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Learner;