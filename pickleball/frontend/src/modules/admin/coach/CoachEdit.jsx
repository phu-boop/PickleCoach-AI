import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCoachById, updateCoach } from '../../../api/admin/coach';
import Swal from 'sweetalert2';

const EditCoach = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [coach, setCoach] = useState({
        name: '',
        level: 'BEGINNER'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                const response = await fetchCoachById(userId);
                const data = response.data;
                setCoach({
                    name: data.name || '',
                    level: data.level || 'BEGINNER',
                    // Thông tin chỉ để hiển thị
                    email: data.email,
                    certifications: data.certifications || [],
                    availability: data.availability || [],
                    specialties: data.specialties || []
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching coach:', error);
                setLoading(false);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load coach data',
                    icon: 'error',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/admin/coaches');
                });
            }
        };
        fetchCoach();
    }, [userId, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCoach(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const coachData = {
                name: coach.name,
                level: coach.level
            };

            console.log("Sending data:", coachData); // Log dữ liệu trước khi gửi

            const response = await updateCoach(userId, coachData);
            if (response.status === 200) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Coach updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/admin/Coach');
                });
            }
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to update coach',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Coach</h1>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        name="name"
                        value={coach.name || ''}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                        id="email"
                        type="email"
                        value={coach.email || ''}
                        readOnly
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
                        Level
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="level"
                        name="level"
                        value={coach.level || 'BEGINNER'}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                        <option value="EXPERT">Expert</option>
                    </select>
                </div>

                {/* Các trường chỉ hiển thị */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Certifications
                    </label>
                    <ul className="list-disc ml-5 bg-gray-100 p-2 rounded">
                        {coach.certifications?.length > 0 ? (
                            coach.certifications.map((cert, index) => (
                                <li key={index}>{cert}</li>
                            ))
                        ) : (
                            <li>No certifications</li>
                        )}
                    </ul>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Availability
                    </label>
                    <ul className="list-disc ml-5 bg-gray-100 p-2 rounded">
                        {coach.availability?.length > 0 ? (
                            coach.availability.map((avail, index) => (
                                <li key={index}>{avail}</li>
                            ))
                        ) : (
                            <li>No availability set</li>
                        )}
                    </ul>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Specialties
                    </label>
                    <ul className="list-disc ml-5 bg-gray-100 p-2 rounded">
                        {coach.specialties?.length > 0 ? (
                            coach.specialties.map((spec, index) => (
                                <li key={index}>{spec}</li>
                            ))
                        ) : (
                            <li>No specialties</li>
                        )}
                    </ul>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Save Changes
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={() => navigate('/admin/Coach')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCoach;