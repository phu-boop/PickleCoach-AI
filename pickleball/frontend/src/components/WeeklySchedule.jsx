import React, { useState } from 'react';
import { FaLock, FaHandPaper } from 'react-icons/fa';
import { createSession } from '../api/learner/learningService';
import Swal from 'sweetalert2';
import BookingPackages from './BookingPackages';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeSlots = [
  { start: '08:00', end: '11:00' },
  { start: '11:00', end: '14:00' },
  { start: '14:00', end: '17:00' },
  { start: '17:00', end: '20:00' },
  { start: '20:00', end: '23:00' },
];

const WeeklySchedule = ({ scheduleList, id_coach, coachLevel }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleCreateSession = async (schedule, selectedPackage) => {
    try {
      const sessionData = {
        coach: { userId: id_coach },
        learner: { userId: sessionStorage.getItem('id_user') },
        datetime: schedule,
        status: 'SCHEDULED',
        videoLink: null,
        feedback: null,
        pakage:selectedPackage.pakage,
      };
      console.log('Creating session with data:', sessionData);
      Swal.fire({
        title: 'Confirm Booking',
        text: `Do you want to book the ${selectedPackage.title} on ${schedule}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, book it!',
        cancelButtonText: 'No, cancel',
      }).then(async (result) => {
        if (result.isConfirmed) {
          await createSession(sessionData);
          Swal.fire('Booked!', 'Your session has been booked.', 'success');
          setIsModalOpen(false); // Close modal after booking
        } else {
          Swal.fire('Cancelled', 'Your booking has been cancelled.', 'info');
          setIsModalOpen(false); // Close modal on cancel
        }
      });
    } catch (error) {
      console.error('Error creating session:', error);
      Swal.fire('Error', 'Failed to book session. Please try again.', 'error');
      setIsModalOpen(false);
    }
  };

  // Helpers
  const getDayShort = (scheduleStr) => scheduleStr.split(' ')[0].slice(0, 3);
  const getTimeRange = (scheduleStr) => scheduleStr.split(' ')[1];

  const scheduleMap = {};
  scheduleList.forEach((item) => {
    const day = getDayShort(item.schedule);
    const timeRange = getTimeRange(item.schedule);
    if (!scheduleMap[day]) scheduleMap[day] = {};
    scheduleMap[day][timeRange] = item;
  });

  const openPackageModal = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
      <div className="w-full overflow-x-auto">
        {/* Modal for Package Selection */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-100 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Select a Package</h2>
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-600 hover:text-gray-800"
                  >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <BookingPackages
                    handleCreateSession={(pkg) => handleCreateSession(selectedSchedule, pkg)}
                    coachLevel={coachLevel}
                />
              </div>
            </div>
        )}

        <div className="grid grid-cols-[100px_repeat(7,minmax(140px,1fr))] gap-3 min-w-[1100px]">
          {/* Header row */}
          <div></div>
          {weekdays.map((day, idx) => (
              <div
                  key={idx}
                  className="text-center font-extrabold text-[#0a0b3d] text-lg font-grandstander border-b-2 pb-2"
              >
                {day}
              </div>
          ))}

          {/* Rows by timeslot */}
          {timeSlots.map((slot, slotIdx) => (
              <React.Fragment key={slotIdx}>
                {/* Left time column */}
                <div className="text-right pr-2 font-semibold text-gray-700 font-grandstander pt-3">
                  {slot.start} – {slot.end}
                </div>

                {/* Slots */}
                {weekdays.map((day, dayIdx) => {
                  const timeRange = `${slot.start}-${slot.end}`;
                  const session = scheduleMap[day]?.[timeRange];

                  return session ? (
                      <div
                          key={dayIdx}
                          className={`rounded-xl shadow-lg px-3 py-3 font-grandstander text-sm flex flex-col gap-1 transition duration-200 ${
                              session.status
                                  ? 'bg-gradient-to-br from-blue-100 to-blue-50 text-blue-900 border border-blue-300'
                                  : 'bg-gradient-to-br from-red-100 to-red-50 text-red-900 border border-red-300'
                          }`}
                      >
                        <div className="font-bold text-base">
                          {slot.start} – {slot.end}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold">
                          {session.status ? (
                              <>
                                <FaHandPaper className="text-blue-700" />
                                <span>Open Play</span>
                              </>
                          ) : (
                              <>
                                <FaLock className="text-red-700" />
                                <span>Private</span>
                              </>
                          )}
                        </div>
                        <div>
                          {sessionStorage.getItem('role') === 'ROLE_learner' ? (
                              session.status && (
                                  <button
                                      className="mt-1 self-start bg-white cursor-pointer text-blue-600 text-xs font-bold px-2 py-1 rounded-full border border-blue-400 hover:bg-blue-50 transition"
                                      onClick={() => openPackageModal(session.schedule)}
                                  >
                                    Book Now
                                  </button>
                              )
                          ) : session.status ? (
                              <button
                                  className="mt-1 self-start bg-white cursor-not-allowed text-gray-400 text-xs font-bold px-2 py-1 rounded-full border border-gray-300"
                              >
                                available
                              </button>
                          ) : (
                              <button
                                  className="mt-1 self-start bg-white cursor-not-allowed text-gray-400 text-xs font-bold px-2 py-1 rounded-full border border-gray-300"
                              >
                                booked
                              </button>
                          )}
                        </div>
                      </div>
                  ) : (
                      <div
                          key={dayIdx}
                          className="min-h-[100px] border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                      ></div>
                  );
                })}
              </React.Fragment>
          ))}
        </div>
      </div>
  );
};

export default WeeklySchedule;