import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {getCoaches,confirm, deleteCoach} from '../../../api/admin/coach';
import Swal from 'sweetalert2';

const Coach = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCoaches()
        .then(data => {
          setCoaches(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching coaches:', error);
          setLoading(false);
        });
  }, []);

  const handleConfirm = async(userId) => {
    const respond = await confirm(userId);
    if (respond.status === 200) {
      Swal.fire({
        title: 'Success',
        text: 'Coach confirmed successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload();
      });
    }
  }

  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async(result) => {
      if (result.isConfirmed) {
        const respond = await deleteCoach(userId);
        if (respond.status === 200) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Coach has been deleted.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            setCoaches(coaches.filter(coach => coach.userId !== userId));
          });
        }
      }
    });
  };

  return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Coach Management</h1>

        {loading ? (
            <p className="text-gray-600">Loading...</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-2xl overflow-hidden border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Lever</th>
                  <th className="py-3 px-4 text-left">specialties</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
                </thead>
                <tbody className="text-gray-700 text-sm">
                {coaches.map((coach) => (
                    <tr key={coach.userId} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{coach.name}</td>
                      <td className="py-3 px-4">{coach.email}</td>
                      <td className="py-3 px-4 capitalize">{
                        coach.role === 'coach' ?
                            <div className="color-white bg-[#e6ffd3] rounded-xl px-3 py-2 text-center">
                              confirmed...
                            </div>
                            :
                            <button
                                onClick={() => handleConfirm(coach.userId)}
                                className="bg-[#7faef4] text-white px-5 cursor-pointer py-2 rounded-xl text-sm hover:bg-blue-600 transition text-center"
                            >
                              Confirm
                            </button>
                      }</td>
                      <td className="py-3 px-4">{coach.level}</td>
                      <td className="py-3 px-4">
                        <ul className="list-disc ml-4">
                          {coach.specialties.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        <button
                            onClick={() => navigate(`/admin/coaches/edit/${coach.userId}`)}
                            className="bg-[#7faef4] text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDelete(coach.userId)}
                            className="bg-[#fa8080] text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600 transition"
                        >
                          Delete
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

export default Coach;