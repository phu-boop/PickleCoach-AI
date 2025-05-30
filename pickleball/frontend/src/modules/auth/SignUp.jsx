import React, { useState } from 'react';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import ApiRegister from '../../api/auth'; // Import hàm gọi API
import { Navigate, useNavigate } from 'react-router-dom';
import Alert from '../../components/Alert'; // Import Alert component if needed
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import biểu tượng con mắt
const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailOrPhone: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // Trạng thái hiển thị/ẩn mật khẩu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    navigate('/');
    console.log('cancel');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.emailOrPhone || !formData.password) {
      setMessage("Please fill in all fields");
      return;
    }else if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }else if (!formData.emailOrPhone.includes('@') && !/^\d+$/.test(formData.emailOrPhone)) {
      setMessage("Please enter a valid email or phone number");
      return;
    }
    try {
      const response = await ApiRegister(formData.firstName, formData.emailOrPhone, formData.password);
      setMessage(response);
      navigate('/login'); 
    } catch (error) {
      setMessage("email already exists");
      console.error('Error during registration:', error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-black text-[#2b8ba3] mb-4">Create your account</h2>

        <div className="flex justify-between mb-4">
          <button
            className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
          >
            <FaFacebookF className="mr-2 text-blue-600" />
            Facebook
          </button>
          <button
            className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Google
          </button>
          <button
            className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
          >
            <FaApple className="mr-2 text-black" />
            Apple
          </button>
        </div>

        <div className="relative mb-4">
          <hr className="border-gray-300" />
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500">
            or
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
          />
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email Address or Phone Number"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} // Chuyển đổi type dựa trên trạng thái
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-4 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị biểu tượng tương ứng */}
            </button>
          </div>
          {message && (
            <div className="mb-4">
            <Alert type="error" message={message} onClose={() => setMessage('')} />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#2c8fa8] text-white rounded-full hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] cursor-pointer transition-colors duration-300"
            onClick={(e)=>{handleSubmit(e)}}
          >
            Sign Up
          </button>
        </form>

        <p className="text-base text-gray-500 mt-4 text-center">
          Already have an account?
        </p>
        <p className="text-lg font-bold text-center mt-2">
          <a href="/login" className="text-[#2c8fa8] font-semibold hover:underline">
            Sign in!
          </a>
        </p>
      </div>
      <div className="absolute top-10 right-8">
        <button
          className="cursor-pointer flex items-center justify-center gap-1 px-[13px] py-[6px] bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645] transition-colors duration-300"
          onClick={(e)=>{handleCancel(e)}}
        >
          Cancel
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SignUp;