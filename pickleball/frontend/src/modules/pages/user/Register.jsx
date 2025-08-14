import { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { registerCoach } from "../../../api/user/register_coach";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CERTIFICATION_OPTIONS = [
  "Certified Personal Trainer",
  "Yoga Alliance 200-Hour",
  "CrossFit Level 1",
  "Nutrition Coach",
];
const SPECIALTY_OPTIONS = ["Fitness", "Yoga", "CrossFit", "Nutrition", "Pilates","Bodybuilding"];

const Register = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      certifications: [],
      availability: [],
      specialties: [],
    },
  });
  const calendarRef = useRef(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("id_user");
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");
    if (userId && email && role) {
      setUserData({ userId, email, role });
    }
  }, []);

  // Hàm format availability thành "Tuesday 14:00-17:00"
  const formatAvailability = (events) => {
    const weekdays = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return events.map(event => {
      const start = new Date(event.start);
      const end = new Date(start.getTime() + (event.extendedProps?.duration || 3) * 60 * 60 * 1000);
      const day = weekdays[start.getDay()];
      const pad = n => n.toString().padStart(2, "0");
      const startTime = `${pad(start.getHours())}:00`;
      const endTime = `${pad(end.getHours())}:00`;
      return `${day} ${startTime}-${endTime}`;
    });
  };

  const onSubmit = async (data) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }
    try {
      const payload = {
        userId: userData.userId,
        user: {
          userId: userData.userId,
          email: userData.email,
          role: userData.role,
          name: "..",
          password: "..",
        },
        certifications: data.certifications,
        availability: formatAvailability(data.availability), // Lưu dạng "Tuesday 14:00-17:00"
        specialties: data.specialties,
      };
      await registerCoach(payload);
      Swal.fire({
        title: "Success!",
        text: "Please wait for admin confirmation, you can login after that",
        icon: "success",
        confirmButtonText: "OK",
      });
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Generate predefined slots from 8:00 AM to 10:00 PM in 3-hour increments
  const generateAvailabilitySlots = () => {
    const slots = [];
    const startHour = 8; // 8:00 AM
    const endHour = 22;  // 10:00 PM
    for (let hour = startHour; hour < endHour; hour += 3) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 3).toString().padStart(2, '0')}:00`;
      slots.push(`${startTime} - ${endTime}`);
    }
    return slots;
  };

  const handleDateClick = (arg) => {
    const slots = generateAvailabilitySlots();
    const clickedHour = arg.date.getHours();
    const slotIndex = Math.floor((clickedHour - 8) / 3); // Map to nearest 3-hour slot
    if (slotIndex >= 0 && slotIndex < slots.length) {
      const [startHour] = slots[slotIndex].split(" - ")[0].split(":");
      const startDateTime = new Date(arg.date);
      startDateTime.setHours(parseInt(startHour), 0, 0, 0);
      const newEvent = {
        title: `Session ${slotIndex + 1}`,
        start: startDateTime,
        allDay: false,
        extendedProps: { duration: 3 }, // 3-hour duration
      };
      setValue("availability", [...(control._formValues.availability || []), newEvent]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CERTIFICATION_OPTIONS.map((option) => (
                    <label
                        key={option}
                        className="relative flex items-start p-4 space-x-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-1 has-[:checked]:ring-blue-200"
                    >
                      <Controller
                          name="certifications"
                          control={control}
                          rules={{ required: "Please select at least one certification" }}
                          render={({ field }) => (
                              <div className="flex items-center h-5">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={field.value.includes(option)}
                                    onChange={(e) => {
                                      const updated = e.target.checked
                                          ? [...field.value, option]
                                          : field.value.filter((item) => item !== option);
                                      field.onChange(updated);
                                    }}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                              </div>
                          )}
                      />
                      <span className="block text-sm font-medium text-gray-700">{option}</span>
                    </label>
                ))}
              </div>
              {errors.certifications && (
                  <p className="mt-2 text-sm text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.certifications.message}
                  </p>
              )}
            </div>
        );
      case 2:
        return (
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-grandstander font-bold text-indigo-800 mb-1">Step 2: Select Availability</h3>
                <p className="text-indigo-600 font-grandstander">Select your 3-hour availability windows</p>
              </div>

              <Controller
                  name="availability"
                  control={control}
                  rules={{ required: "Please add at least one availability slot" }}
                  render={({ field }) => (
                      <div className="relative">
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-indigo-50 overflow-hidden">
                          <FullCalendar
                              ref={calendarRef}
                              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                              initialView="timeGridWeek"
                              selectable={true}
                              events={field.value}
                              dateClick={handleDateClick}
                              slotMinTime="08:00:00"
                              slotMaxTime="22:00:00"
                              slotDuration="03:00:00"
                              selectConstraint={{
                                startTime: '08:00',
                                endTime: '22:00',
                                duration: '03:00'
                              }}
                              headerToolbar={{
                                left: "prev,next today",
                                center: "title",
                                right: "dayGridMonth,timeGridWeek,timeGridDay",
                              }}
                              buttonText={{
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                day: "Day"
                              }}
                              contentHeight="auto"
                              selectOverlap={false}
                              selectAllow={(selectInfo) => {
                                // Only allow exact 3-hour selections
                                const diffHours = (selectInfo.end - selectInfo.start) / (1000 * 60 * 60);
                                return diffHours === 3;
                              }}
                              eventContent={(eventInfo) => (
                                  <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white px-2 py-7 rounded-xl shadow-md font-semibold text-xs text-center w-full h-full flex items-center justify-center transform hover:scale-[1.02] transition-transform">
                                    <div>
                                      <div className="font-bold">{eventInfo.event.title}</div>
                                      <div className="text-indigo-100 text-xxs mt-1">
                                        {eventInfo.timeText}
                                      </div>
                                    </div>
                                  </div>
                              )}
                              dayHeaderClassNames="bg-indigo-100/80 text-indigo-800 font-bold font-grandstander text-sm uppercase py-3 border-b border-indigo-200"
                              slotLabelClassNames="text-indigo-600/90 font-grandstander text-sm font-medium"
                              dayCellClassNames="hover:bg-indigo-50/50 transition-colors duration-300 border-r border-indigo-100 last:border-r-0"
                              viewClassNames="rounded-lg font-grandstander"
                              nowIndicatorClassNames="bg-red-500 h-full opacity-80"
                              dayHeaderContent={(arg) => (
                                  <span className="px-1 py-0.5 rounded-md">{arg.text}</span>
                              )}
                              slotLabelContent={(arg) => (
                                  <span className="px-1">{arg.text}</span>
                              )}
                          />
                        </div>

                        {/* Visual guide */}
                        <div className="mt-4 flex items-center justify-center space-x-4">
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-indigo-500 rounded-md mr-2"></div>
                            <span className="text-sm text-gray-600 font-grandstander">Selected slot</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-4 h-4 bg-indigo-100 rounded-md mr-2 border border-indigo-200"></div>
                            <span className="text-sm text-gray-600 font-grandstander">Available</span>
                          </div>
                        </div>
                      </div>
                  )}
              />

              {errors.availability && (
                  <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-grandstander text-red-700 text-sm">{errors.availability.message}</span>
                  </div>
              )}
            </div>
        );
      case 3:
        return (
            <div className="space-y-4">
              <h3 className="text-xl font-grandstander font-bold text-indigo-800">Select Your Specialties</h3>
              <p className="text-indigo-600 font-grandstander text-sm">Choose all that apply</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SPECIALTY_OPTIONS.map((option) => (
                    <label
                        key={option}
                        className="relative flex items-start p-4 space-x-3 bg-white border-2 border-indigo-100 rounded-xl hover:border-indigo-300 transition-all duration-200 cursor-pointer has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/30"
                    >
                      <Controller
                          name="specialties"
                          control={control}
                          rules={{ required: "Please select at least one specialty" }}
                          render={({ field }) => (
                              <div className="flex items-center h-5 mt-0.5">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={field.value.includes(option)}
                                    onChange={(e) => {
                                      const updated = e.target.checked
                                          ? [...field.value, option]
                                          : field.value.filter((item) => item !== option);
                                      field.onChange(updated);
                                    }}
                                    className="w-5 h-5 text-indigo-600 border-2 border-gray-300 rounded-lg focus:ring-indigo-500 focus:ring-offset-2 focus:ring-2 checked:border-indigo-600"
                                />
                              </div>
                          )}
                      />
                      <span className="block text-gray-800 font-medium font-grandstander">{option}</span>

                      {/* Checked indicator corner */}
                      <div className="absolute top-0 right-0 w-5 h-5 bg-indigo-500 rounded-bl-xl rounded-tr-xl opacity-0 transition-opacity duration-200 has-[:checked]:opacity-100">
                        <svg
                            className="w-3 h-3 text-white absolute top-1 right-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>
                ))}
              </div>

              {errors.specialties && (
                  <div className="flex items-start text-red-600 mt-2">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-grandstander text-sm">{errors.specialties.message}</span>
                  </div>
              )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
      <>
        <div className="py-20 flex items-center justify-center bg-gradient-to-br from-indigo-0 to-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl transform transition-all duration-300 hover:shadow-2xl">
            <div>
              <img
                  src="https://www.pickleheads.com/images/duotone-icons/vacation.svg"
                  alt="Logo"
                  className="mx-auto h-12 w-auto mb-6"
              />
              <h2 className="font-grandstander font-bold text-3xl mb-8 text-center text-gray-900 tracking-tight">
                Coach Registration
              </h2>
            </div>
            {userData ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="relative mb-8">
                    {/* Thanh tiến trình */}
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
                      <div
                          className="h-1 bg-gradient-to-r from-indigo-500 to-blue-200 transition-all duration-500"
                          style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                      />
                    </div>
                    {/* Các bước */}
                    <div className="flex justify-between items-center relative z-10">
                      {[1, 2, 3].map((step) => (
                          <div key={step} className="flex-1 text-center">
                            <div
                                className={`
                        w-12 h-12 mx-auto rounded-full flex items-center justify-center text-lg font-bold shadow-lg border-2 transition-all duration-300
                        ${currentStep === step
                                    ? "bg-indigo-600 text-white border-indigo-600 scale-110"
                                    : currentStep > step
                                        ? "bg-white text-indigo-600 border-indigo-400"
                                        : "bg-gray-200 text-gray-400 border-gray-200"
                                }
                      `}
                                style={{
                                  boxShadow: currentStep === step
                                      ? "0 4px 16px 0 rgba(99,102,241,0.25)"
                                      : "0 2px 8px 0 rgba(0,0,0,0.05)"
                                }}
                            >
                              {step}
                            </div>
                            <p
                                className={`mt-2 text-xs font-semibold transition-colors duration-300
                        ${currentStep === step
                                    ? "text-indigo-600"
                                    : currentStep > step
                                        ? "text-indigo-400"
                                        : "text-gray-400"
                                }`}
                            >
                              {step === 1
                                  ? "Certifications"
                                  : step === 2
                                      ? "Availability"
                                      : "Specialties"}
                            </p>
                          </div>
                      ))}
                    </div>
                  </div>
                  {renderStep()}
                  <div className="flex justify-between pt-6">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="bg-gray-200 cursor-pointer text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                        >
                          Back
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white py-2 px-6 cursor-pointer rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      {currentStep === 3 ? "Register as Coach" : "Next"}
                    </button>
                  </div>
                </form>
            ) : (
                <p className="text-center text-red-500 font-medium">
                  No user data found in sessionStorage. Please log in.
                </p>
            )}
          </div>
        </div>
        <div className="bg-white mt-30 px-22 font-grandstander container-main max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">

          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl font-bold font-grandstander text-[#0a0b3d] mb-4 leading-tight">
              Get paid to organize<br />pickleball
            </h2>
            <p className="text-gray-700 text-base mb-6">
              Bring fun pickleball programming to your area and make money out on the court.
              You can run your whole business on Pickleheads – we’ll show you how!
            </p>

            <div className="flex items-center gap-7">
              <Button
                  onClick={()=>{navigate("/review-coach")}}
              >Get a live walkthrough</Button>
              <a href="" className="text-[#35211a] font-bold text-sm hover:underline">
                See it in action →
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-1/2 relative">
            <img
                src="https://cdn.filestackcontent.com/resize=w:1254/auto_image/hL9qw5NmTiGMimEePhyL"
                alt="organizer"
                className="w-full max-w-md mx-auto"
            />

            {/* Badge 1 - Top right */}
            <div className="absolute top-4 right-8 bg-white border-2 border-blue-100 shadow-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <img
                  src="https://www.pickleheads.com/images/duotone-icons/calendar.svg"
                  alt="calendar"
                  className="w-5 h-5"
              />
              <span>15 sessions per week</span>
            </div>

            {/* Badge 2 - Bottom left */}
            <div className="absolute bottom-4 left-8 bg-white border-2 border-blue-100 shadow-md rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
              <img
                  src="https://www.pickleheads.com/images/duotone-icons/money-bag.svg"
                  alt="money"
                  className="w-5 h-5"
              />
              <div className="leading-tight">
                <div>$10,320</div>
                <div className="text-xs text-gray-500">Last month</div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}

export default Register;