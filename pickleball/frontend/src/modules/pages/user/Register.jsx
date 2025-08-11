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
          <div className="grid grid-cols-2 gap-4">
            {CERTIFICATION_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
              >
                <Controller
                  name="certifications"
                  control={control}
                  rules={{ required: "Please select at least one certification" }}
                  render={({ field }) => (
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
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  )}
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
            {errors.certifications && (
              <p className="text-red-500 text-sm mt-2 col-span-2">{errors.certifications.message}</p>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
  <h3 className="text-lg font-grandstander font-bold text-gray-800">Step 2: Select Availability</h3>
  <Controller
    name="availability"
    control={control}
    rules={{ required: "Please add at least one availability slot" }}
    render={({ field }) => (
      <div>
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
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          contentHeight="auto"
          eventContent={(eventInfo) => (
            <div className="bg-indigo-500 text-white px-3 py-4 rounded-lg shadow font-semibold text-xs text-center w-full">
              {eventInfo.event.title}
            </div>
          )}
          dayHeaderClassNames="bg-indigo-100 text-indigo-700 font-bold font-grandstander"
          slotLabelClassNames="text-indigo-600 font-grandstander" 
          dayCellClassNames="hover:bg-indigo-50 transition-colors duration-200 rounded font-grandstander py-6" 
          viewClassNames="rounded-xl h-full font-grandstander"
        />
      </div>
    )}
  />
</div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-4">
            {SPECIALTY_OPTIONS.map((option) => (
              <label
                key={option}
                className="flex items-center p-3 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
              >
                <Controller
                  name="specialties"
                  control={control}
                  rules={{ required: "Please select at least one specialty" }}
                  render={({ field }) => (
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
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  )}
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
            {errors.specialties && (
              <p className="text-red-500 text-sm mt-2 col-span-2">{errors.specialties.message}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl transform transition-all duration-300 hover:shadow-2xl">
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
  );
}

export default Register;