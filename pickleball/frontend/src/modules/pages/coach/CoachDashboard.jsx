import React, { useState, useEffect } from 'react';
import { fetchCoachById, fetchLearnerById, getSessionbyCoach,updateStatus } from '../../../api/coach/Service';
import { Navigate, useNavigate } from 'react-router-dom';
export default function CoachDashboard() {
  const [coach, setCoach] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
  const [learners, setLearners] = useState([]);
  const [learnerNames, setLearnerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  console.log('lich',scheduleList);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coachData, sessionData, learnerData] = await Promise.all([
          fetchCoachById(sessionStorage.getItem('id_user')),
          getSessionbyCoach(sessionStorage.getItem('id_user')),
          fetchLearnerById(sessionStorage.getItem('id_user'))
        ]);

        setCoach(coachData);
        setScheduleList(Array.isArray(sessionData) ? sessionData : []);
        setLearners(Array.isArray(learnerData) ? learnerData : []);

        // Fetch learner names for each unique learnerId
        const learnerIds = [...new Set(sessionData.map(session => session.learnerId).filter(id => id))];
        console.log('Fetching learner names for IDs:', learnerIds);
        const learnerPromises = learnerIds.map(id =>
          fetchLearnerById(id)
            .then(result => {
              console.log(`Learner ${id} fetched:`, result);
              if (id === "88c3c563-877a-4d61-8ab2-74ca93547eb5") {
                console.log('Specific check for ID 88c3c563-877a-4d61-8ab2-74ca93547eb5:', result);
              }
              const name = result?.name || result?.userName || result?.fullName || '(ID: ' + id + ')';
              return { id, name };
            })
            .catch(err => {
              console.error(`Error fetching learner ${id}:`, err);
              return { id, name: '(ID: ' + id + ')' };
            })
        );
        const learnerResults = await Promise.all(learnerPromises);
        const namesMap = learnerResults.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});
        setLearnerNames(namesMap);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map session status
  const mapStatus = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'Confirmed';
      case 'COMPLETED':
        return 'Completed';
      case null:
        return 'Empty';
      default:
        return 'Completed';
    }
  };

  const todaySchedule = scheduleList
  .filter(session => session.datetime?.startsWith(todayDay))
  .map(session => ({
    sessionId: session.sessionId || 'N/A',
    timeRange: session.datetime?.split(' ').slice(1).join(' ') || 'N/A',
    day: session.datetime?.split(' ')[0] || 'N/A',
    learner: learnerNames[session.learnerId] || '(ID: ' + (session.learnerId || 'N/A') + ')',
    status: mapStatus(session.status),
    feedback: session.feedback || 'None',
    videoLink: session.videoLink || null
  }));

  // Process learner data
  const formattedLearners = learners.map(learner => ({
    id: learner.id || 'N/A',
    name: learner.name || learner.userName || learner.fullName || 'Unknown',
    lastSession: learner.lastSession || 'N/A',
    rating: learner.progress || 'N/A',
    goals: learner.goals || 'No goals set'
  }));
  const navegative = useNavigate();
  // Handle View Details button
  const handleViewDetails = (session) => {
    setSelectedSession(session);
  };
  // oppen class
  const handleOppenClass = async(id_session) =>{
    try{
      const response = await updateStatus(id_session);
      if(response){
      navegative(`/coach_video_call/${id_session}`);
      }
      
    }catch(e){
      console.log(e);
    }
  }
  // Close modal
  const closeModal = () => {
    setSelectedSession(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-xl">{error}</div>;
  }

  return (
    <div className="px-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6 font-grandstander font-bold pt-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3 font-grandstander">
        <span className="text-blue-600 "><img src="https://www.pickleheads.com/images/duotone-icons/paper-plane.svg" className='h-13' alt="" /></span> Coach Dashboard
      </h1>

      {/* Coach Info */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transform hover:-translate-y-1 transition-all duration-300">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome, Coach {coach?.name || 'N/A'}!</h2>
          <p className="text-gray-600 text-sm mb-1">Email: <strong>{coach?.email || 'N/A'}</strong></p>
          <p className="text-gray-600 text-sm mb-1">Specialties: <strong>{coach?.specialties?.join(', ') || 'N/A'}</strong></p>
          <p className="text-sm mb-1 text-[#162556]">Certifications: <strong>{coach?.certifications?.join(', ') || 'N/A'}</strong></p>
          <p className="text-gray-600 text-sm">Today's Schedule: <strong>{todaySchedule.length} sessions</strong> | Learners: <strong>{learners.length}</strong></p>
        </div>
        <img 
          src={coach?.urlAvata || "/default-avatar.png"} 
          alt="Coach Avatar" 
          className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-md"
          onError={(e) => { e.target.src = "/default-avatar.png"; }}
        />
      </div>

      {/* Availability */}
      {coach?.availability?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <img src="https://www.pickleheads.com/images/duotone-icons/news.svg" className='h-10' alt="" />
            Today's Schedule ({new Date().toLocaleDateString('en-GB')})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coach.availability.map((slot, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-3 text-sm text-gray-700">
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <img src="https://www.pickleheads.com/images/duotone-icons/news.svg" className='h-10' alt="" /> Today's Schedule ({new Date().toLocaleDateString('en-GB')})
          </h3>
          {todaySchedule.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No sessions scheduled today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 px-5 text-left font-medium w-1/5">Day</th>
                    <th className="py-3 px-5 text-left font-medium w-1/5">Time Range</th>
                    <th className="py-3 px-5 text-left font-medium w-1/5">Status</th>
                    <th className="py-3 px-5 text-left font-medium w-1/5">Notes</th>
                    <th className="py-3 px-5 text-left font-medium w-1/5">Feedback</th>
                    <th className="py-3 px-5 text-left font-medium w-1/5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySchedule.map((item, index) => (
                    <tr key={item.sessionId} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-3 px-6">Thursday</td>
                      <td className="py-3 px-6">{item.timeRange}</td>
                      <td className="py-3 px-6">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Empty'
                            ? 'bg-gray-100 text-gray-600'
                            : item.status === 'Confirmed'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-6">{item.feedback}</td>
                      <td className="py-3 px-6">
                        <button onClick={()=>{handleOppenClass(item.sessionId)}} className= 'font-bold text-amber-50 text-xs font-medium py-1 px-2 bg-amber-600 cursor-pointer font-black rounded-xl shadow-md hover:bg-amber-700 transition duration-200 transform hover:-translate-y-1'>
                        oppen class
                        </button>
                      </td>
                      <td className="py-3 px-6">
                        <button 
                          onClick={() => handleViewDetails(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs py-1 px-2 bg-blue-100 cursor-pointer rounded-xl shadow-md hover:bg-blue-200 transition duration-200 transform hover:-translate-y-1"
                        >
                          view details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Learner List */}
        <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <img src="https://www.pickleheads.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fjvolei4i%2Fproduction%2F24c230142f23d51c845cf93e562a5e29a9c8b903-160x160.png&w=128&q=75" className='h-10' alt="" /> Learner List
          </h3>
          {formattedLearners.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              <p className="text-base font-medium">No learners found</p>
              <p className="text-sm mt-2">Click "Add Learner" to start managing learners!</p>
              <button 
                onClick={() => alert('Redirect to add learner page (not implemented)')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200"
              >
                Add Learner
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="py-3 text-[#162556] px-6 text-left font-medium w-1/4">Name</th>
                    <th className="py-3 px-6 text-left font-medium w-1/4">Goals</th>
                    <th className="py-3 px-6 text-left font-medium w-1/4">Last Session</th>
                    <th className="py-3 px-6 text-left font-medium w-1/4">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {formattedLearners.map((learner, index) => (
                    <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="py-3 text-[#162556] px-6 font-medium">{learner.name}</td>
                      <td className="py-3 px-6">{learner.goals}</td>
                      <td className="py-3 px-6">{learner.lastSession}</td>
                      <td className="py-3 px-6">
                        <span className="text-blue-600 font-medium">{learner.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Details</h3>
            <p className="text-gray-600 text-sm mb-2"><strong>Session ID:</strong> {selectedSession.sessionId}</p>
            <p className="text-gray-600 text-sm mb-2"><strong>Day:</strong> {selectedSession.day}</p>
            <p className="text-gray-600 text-sm mb-2"><strong>Time Range:</strong> {selectedSession.timeRange}</p>
            <p className="text-gray-600 text-sm mb-2"><strong>Learner:</strong> {selectedSession.learner}</p>
            <p className="text-gray-600 text-sm mb-2"><strong>Status:</strong> {selectedSession.status}</p>
            <p className="text-gray-600 text-sm mb-2"><strong>Notes:</strong> {selectedSession.feedback}</p>
            {selectedSession.videoLink && (
              <p className="text-gray-600 text-sm mb-2">
                <strong>Video Link:</strong> 
                <a href={selectedSession.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Open Link
                </a>
              </p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={closeModal}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button onClick={()=>{navegative(`/Detail_coach/${sessionStorage.getItem('id_user')}`)}} className="bg-[#696cff] hover:bg-[#4445a0] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
          Manage Schedule
        </button>
        <button onClick={()=>{navegative('/coach')}} className="bg-[#82e14f] hover:bg-[#548f35] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
          View Reports
        </button>
        <button onClick={()=>{navegative('/profile')}} className="bg-[#3dacce] hover:bg-[#3a849b] text-white cursor-pointer px-6 py-3 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-200">
          Update Profile
        </button>
      </div>
    </div>
  );
}