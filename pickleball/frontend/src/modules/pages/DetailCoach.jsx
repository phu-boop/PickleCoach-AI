import React, { useEffect, useState } from 'react';
import { fetchCoachById } from '../../api/admin/coach';
import { getScheduledSessions } from '../../api/learner/learningService';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaCamera } from 'react-icons/fa';
import WeeklySchedule from '../../components/WeeklySchedule';

const DetailCoach = () => {
  const { id } = useParams();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scheduleList, setScheduleList] = useState([]); // ✅ Thêm state cho lịch

  useEffect(() => {
    const getCoach = async () => {
      try {
        const res = await fetchCoachById(id);
        setCoach(res.data);
      } catch (err) {
        console.error('Failed to fetch coach:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSchedule = async () => {
      try {
        const res = await getScheduledSessions(id); // ✅ Gọi lại API lấy lịch
        setScheduleList(res);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
      }
    };

    getCoach();
    fetchSchedule();
  }, [id]);

  if (loading)
    return <p className="text-center text-gray-500 font-grandstander">Loading coach data...</p>;
  if (!coach)
    return <p className="text-center text-red-500 font-grandstander">Coach not found.</p>;

  return (
    <>
      <div className="mt-30 max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row gap-10">
        {/* Left: Coach Info */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-[#0a0b3d] mb-4 font-grandstander">
            Coach {coach.name}
          </h1>

          <div className="flex gap-3 flex-wrap mb-6">
            <button className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-semibold font-grandstander">
              Schedule
            </button>
            <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold font-grandstander">
              Booking
            </button>
            <button className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold font-grandstander">
              Lessons
            </button>
          </div>

          <div className="space-y-3 text-gray-700 font-grandstander">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-blue-500" />
              <span>{coach.address || 'Location not provided'}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-500" />
              <span>{coach.phone || 'Phone number not available'}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaGlobe className="text-indigo-500" />
              <span>{coach.website || 'Website not listed'}</span>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-[#0a0b3d] mb-2 font-grandstander">About Coach</h2>
            <p className="text-gray-800 font-grandstander leading-relaxed">
              {coach.bio ||
                'Experienced pickleball coach dedicated to helping players improve their skills, strategies, and game performance. Join today to take your game to the next level!'}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#0a0b3d] mb-2 font-grandstander">Certifications</h2>
            <p className="text-gray-700 font-grandstander">
              {coach.certifications?.length > 0
                ? coach.certifications.join(', ')
                : 'No certifications listed.'}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold text-[#0a0b3d] mb-2 font-grandstander">Specialties</h2>
            <div className="flex flex-wrap gap-2">
              {coach.specialties?.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-[#2d93ad] text-white px-3 py-1 rounded-full text-sm font-grandstander"
                >
                  {item}
                </span>
              )) || <span>No specialties listed.</span>}
            </div>
          </div>
        </div>

        {/* Right: Coach Image */}
        <div className="md:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-lg relative">
            <img
              src={
                coach.urlAvata ||
                'https://cdn.filestackcontent.com/FX2E1IWSSHikp7fhAfwo'
              }
              alt={coach.name}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-white/80 px-3 py-1 rounded text-sm text-gray-800 flex items-center gap-1 font-grandstander">
              <FaCamera /> Coach Photo
            </div>
          </div>
          <p className="text-right text-sm text-gray-400 mt-2 font-grandstander">Image by Coach</p>

          <button className="mt-6 bg-[#2d93ad] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1a6f8c] transition font-grandstander">
            Book a Lesson
          </button>
        </div>
      </div>
      <div className='mt-20 container-main border-t-4 border-dotted border-[#A2DFFF]'>
        {/* Weekly Schedule */}
        <div className="mt-16 max-w-6xl mx-auto px-4 mb-20">
            <div className="ml-10 flex items-center gap-2 mb-6 gap-5">
                <img src="https://www.pickleheads.com/images/duotone-icons/sms.svg" alt="" className='h-15' />
                <h2 className="text-2xl font-bold text-[#0a0b3d] font-grandstander">Weekly Schedule</h2>
            </div>
            <WeeklySchedule scheduleList={scheduleList} />
        </div>
      </div>
    </>
  );
};

export default DetailCoach;
