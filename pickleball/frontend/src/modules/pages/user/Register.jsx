import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { registerCoach } from "../../../api/user/register_coach";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";// Predefined options
import { useNavigate } from "react-router-dom";
const CERTIFICATION_OPTIONS = [
  "Certified Personal Trainer",
  "Yoga Alliance 200-Hour",
  "CrossFit Level 1",
  "Nutrition Coach",
];
const SPECIALTY_OPTIONS = ["Fitness", "Yoga", "CrossFit", "Nutrition", "Pilates"];
const AVAILABILITY_SLOTS = [
  "Monday 9:00-12:00",
  "Monday 14:00-17:00",
  "Tuesday 9:00-12:00",
  "Tuesday 14:00-17:00",
  "Wednesday 9:00-12:00",
  "Wednesday 14:00-17:00",
];

const Register = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      certifications: [],
      availability: [],
      specialties: [],
    },
  });

  // Fetch user data from sessionStorage on mount
  useEffect(() => {
    const userId = sessionStorage.getItem("id_user");
    const email = sessionStorage.getItem("email");
    const role = sessionStorage.getItem("role");
    if (userId && email && role) {
      setUserData({ userId, email, role });
    }
  }, []);

  // Handle form submission
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
        availability: data.availability,
        specialties: data.specialties,
      };
      await registerCoach(payload);
      Swal.fire({
      title: "Success!",
      text: "please wait for admin confirmation, you can login after that",
      icon: "success",
      confirmButtonText: "OK",
    });
      logout(); 
      navigate("/login");
      alert("Coach registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register coach. Please try again.");
    }
  };

  // Render step content
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800">Step 1: Select Certifications</h3>
            <Controller
              name="certifications"
              control={control}
              rules={{ required: "Please select at least one certification" }}
              render={({ field }) => (
                <div className="space-y-2">
                  {CERTIFICATION_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
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
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                  {errors.certifications && (
                    <p className="text-red-500 text-sm mt-2">{errors.certifications.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800">Step 2: Select Availability</h3>
            <Controller
              name="availability"
              control={control}
              rules={{ required: "Please select at least one availability slot" }}
              render={({ field }) => (
                <div className="space-y-2">
                  {AVAILABILITY_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={slot}
                        checked={field.value.includes(slot)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...field.value, slot]
                            : field.value.filter((item) => item !== slot);
                          field.onChange(updated);
                        }}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700">{slot}</span>
                    </label>
                  ))}
                  {errors.availability && (
                    <p className="text-red-500 text-sm mt-2">{errors.availability.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-gray-800">Step 3: Select Specialties</h3>
            <Controller
              name="specialties"
              control={control}
              rules={{ required: "Please select at least one specialty" }}
              render={({ field }) => (
                <div className="space-y-2">
                  {SPECIALTY_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
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
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                  {errors.specialties && (
                    <p className="text-red-500 text-sm mt-2">{errors.specialties.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 tracking-tight">
          Coach Registration
        </h2>
        {userData ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="flex justify-between items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1 text-center">
                    <div
                      className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        currentStep >= step
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {step}
                    </div>
                    <p
                      className={`mt-2 text-xs font-medium ${
                        currentStep >= step ? "text-indigo-600" : "text-gray-400"
                      }`}
                    >
                      {step === 1 ? "Certifications" : step === 2 ? "Availability" : "Specialties"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                <div
                  className="h-1 bg-indigo-600 transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
              </div>
            </div>

            {/* User Email Display */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-gray-900 font-semibold">{userData.email}</p>
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
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
};

export default Register;