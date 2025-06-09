import { useState } from 'react';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react";
import { ApiLogin } from '../../api/auth';
import Swal from 'sweetalert2';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';
const LoginPage = () => {
  const [check, setCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleCheck = () => {
    setCheck(!check);
  };
  const handleSubmit = () => {
    if (check) {
      setSubmitted(true);
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiLogin(email, password);
      const { token, role } = response;
      login(token, role);
      if (response) {
        Swal.fire({
          title: response.message,
          icon: "success",
          draggable: true,
          timer: 1500,
        });
        if (role === 'ROLE_admin') {
          Navigate('/admin');
        } else {
          Navigate('/');
        }
      }
    } catch (error) {
      setMessage("Invalid email or password");
      console.error('Error during login:', error);
    }
  };

  const handleCancel = () => {
    setSubmitted(false);
    setCheck(false);
    Navigate('/');
  };
  const handleRegister = () => {
    Navigate('/signup');
  }
  return (
      <>
        {submitted && check ? (
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-black text-[#2b8ba3] mb-4">Sign in with</h2>

                <div className="flex justify-between mb-4">
                  <button
                      className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                  >
                    <FaFacebookF className="mr-2 text-blue-600" />
                    Facebook
                  </button>
                  <a
                      href="http://localhost:8080/oauth2/authorization/google"
                      className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer transition-colors duration-300"
                  >
                    <FaGoogle className="mr-2 text-red-500" />
                    Google
                  </a>
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

                <input
                    type="text"
                    placeholder="Email Address or Phone Number"
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative w-full">
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      className="w-full p-3 pr-10 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2c8fa8]"
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                      className="absolute top-3 right-3 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                { message && (
                    <div className="mb-4">
                      <Alert
                          message={message}
                          type="error"
                          onClose={() => setMessage('')}
                      />
                    </div>
                )}

                <button
                    className="w-full py-3 bg-[#2c8fa8] text-white rounded-full hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] cursor-pointer transition-colors duration-300"
                    onClick={(e) => handleSubmitLogin(e)}
                >
                  Continue
                </button>

                <p className="text-base text-gray-500 mt-4 text-center">
                  We'll ask for your password next.
                </p>
                <p className="text-lg font-bold text-center mt-2">
                  New here?{' '}
                  <button onClick={handleRegister} className="text-[#2c8fa8] font-semibold hover:underline cursor-pointer">
                    Sign up!
                  </button>
                </p>
              </div>
              <div className="absolute top-10 right-8">
                <button
                    className="cursor-pointer flex items-center justify-center gap-1 px-[13px] py-[6px] bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645] transition-colors duration-300"
                    onClick={handleCancel}
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
        ) : (
            <div className="relative flex items-center justify-center min-h-screen">
              <div className="flex items-center justify-center max-w-99 bg-white">
                <div className="text-center">
                  <div className="mb-6">
                    <img
                        src="https://www.pickleheads.com/assets/logo-mark.svg"
                        alt="PickleHeads Logo"
                        className="w-40 h-40 mx-auto"
                    />
                  </div>

                  <h1 className="text-5xl font-bold font-grandstander text-gray-800 mb-4">PickleHeads®</h1>

                  <p className="text-3xl font-black text-[#2a7e93] mb-6">
                    Join the fastest growing pickleball community
                  </p>

                  <div className="mb-6">
                    <label className="flex items-center justify-center text-sm text-gray-700">
                      <input
                          type="checkbox"
                          onChange={handleCheck}
                          checked={check}
                          className="mr-2 border-teal-500 w-7 h-7 accent-[#288299] cursor-pointer"
                      />
                      <div className="text-[14px] text-start font-sans text-gray-600">
                        I am 16 years of age or older and agree to the{' '}
                        <a href="#" className="hover:text-[#288299] underline">
                          Terms of Use and Privacy Policy
                        </a>.
                      </div>
                    </label>
                  </div>

                  <button
                      className={`w-full py-3 rounded-full mb-4 transition-colors duration-300 cursor-pointer ${
                          check
                              ? 'bg-[#2c91aa] text-white hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b]'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={handleSubmit}
                      disabled={!check}
                  >
                    SING IN
                  </button>

                  <p className="text-base font-bold text-gray-600 mb-4">
                    Have not an account?{' '}
                    <Link to="/signup" className="text-[#2c91aa] hover:underline cursor-pointer">Sign up!</Link>
                  </p>

                  <div className="text-sm text-[#2c91aa] flex justify-center space-x-2">
                    <a href="#" className="hover:underline flex items-center">
                      <span className="mr-1">⚙️</span> Accessibility
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:underline">
                      Terms of Use
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div>

              <div className="absolute top-10 right-8">
                <button
                    className="cursor-pointer flex items-center justify-center gap-1 px-[13px] py-[6px] bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border-3 border-[#ea6645] transition-colors duration-300"
                    onClick={handleCancel}
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
        )}
      </>
  );
};

export default LoginPage;