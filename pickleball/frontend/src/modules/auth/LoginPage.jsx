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
  const Navigate = useNavigate();
  const [check, setCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
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
      const { token, role, id_user } = response;
      login(token, role, id_user, email); 
      if (response) {
        Swal.fire({
          title: response.message,
          icon: "success",
          draggable: true,
          timer: 1500,
        });
        if (role === 'ROLE_admin') {
          Navigate('/admin');
        }else if( role === 'ROLE_coach' ){
          Navigate('/coach');
        }else {
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
    navigate('/');
  };
  const handleRegister = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password-email');
  };

  return (
      <>
        {submitted && check ? (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-[#dff5f9] px-4">
              <div className="relative w-full max-w-2xl p-10 bg-white rounded-3xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-black text-[#2c91aa] mb-6 text-center">Sign in with</h2>

                <div className="flex justify-between mb-6">
                  <button
                      className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300"
                  >
                    <FaFacebookF className="mr-2 text-blue-600" /> Facebook
                  </button>
                  <a
                      href="http://localhost:8080/oauth2/authorization/google"
                      className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300"
                  >
                    <FaGoogle className="mr-2 text-red-500" /> Google
                  </a>
                  <button
                      className="flex items-center justify-center w-1/3 py-5 mx-1 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 transition duration-300"
                  >
                    <FaApple className="mr-2 text-black" /> Apple
                  </button>
                </div>

                <div className="relative mb-6">
                  <hr className="border-gray-300" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-500">
                or
              </span>
                </div>

                <input
                    type="text"
                    placeholder="Email Address or Phone Number"
                    className="w-full p-4 mb-5 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#2c91aa]"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative w-full">
                  <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full p-4 pr-10 mb-5 border border-gray-300 rounded-xl text-lg focus:ring-2 focus:ring-[#2c91aa]"
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                      className="absolute top-4 right-4 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>

                {message && (
                    <div className="mb-5">
                      <Alert message={message} type="error" onClose={() => setMessage('')} />
                    </div>
                )}

                <button
                    className="w-full py-4 bg-[#2c91aa] text-white rounded-full text-xl font-semibold hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b] transition duration-300"
                    onClick={(e) => handleSubmitLogin(e)}
                >
                  Continue
                </button>

                <p className="text-base text-gray-500 mt-5 text-center">
                  We'll ask for your password next.
                </p>
                <p className="text-lg font-bold text-center mt-3">
                  New here?{' '}
                  <button onClick={handleRegister} className="text-[#2c91aa] font-semibold hover:underline">
                    Sign up!
                  </button>
                </p>
                <p className="text-lg font-bold text-center mt-3">
                  <button onClick={handleForgotPassword} className="text-[#2c91aa] font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </p>
              </div>

              <div className="absolute top-10 right-8">
                <button
                    className="flex items-center gap-2 px-5 py-2 bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645] transition duration-300"
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
            <div className="relative flex items-center justify-center min-h-screen bg-white px-4">
              <div className="w-full max-w-2xl text-center bg-white px-10 py-14 rounded-3xl  ">
                <div className="mb-6">
                  <img
                      src="https://www.pickleheads.com/assets/logo-mark.svg"
                      alt="PickleHeads Logo"
                      className="w-40 h-40 mx-auto"
                  />
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">PickleHeads®</h1>
                <p className="text-3xl font-black text-[#2a7e93] mb-6">
                  Join the fastest growing pickleball community
                </p>

                <div className="mb-6">
                  <label className="flex items-center justify-center text-sm text-gray-700">
                    <input
                        type="checkbox"
                        onChange={handleCheck}
                        checked={check}
                        className="mr-2 w-6 h-6 accent-[#288299]"
                    />
                    <div className="text-sm text-gray-600">
                      I am 16 years of age or older and agree to the{' '}
                      <a href="#" className="hover:text-[#288299] underline">
                        Terms of Use and Privacy Policy
                      </a>.
                    </div>
                  </label>
                </div>

                <button
                    className={`w-full py-4 rounded-full text-xl font-semibold transition duration-300 ${
                        check
                            ? 'bg-[#2c91aa] text-white hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b]'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    onClick={handleSubmit}
                    disabled={!check}
                >
                  SIGN IN
                </button>

                <p className="text-base font-bold text-gray-600 mt-5">
                  Have not an account?{' '}
                  <Link to="/signup" className="text-[#2c91aa] hover:underline">
                    Sign up!
                  </Link>
                </p>

                <div className="text-sm text-[#2c91aa] flex justify-center gap-4 mt-4">
                  <a href="#" className="hover:underline flex items-center">
                    <span className="mr-1">⚙️</span> Accessibility
                  </a>
                  <span>|</span>
                  <a href="#" className="hover:underline">Terms of Use</a>
                  <span>|</span>
                  <a href="#" className="hover:underline">Privacy Policy</a>
                </div>
              </div>

              <div className="absolute top-10 right-8">
                <button
                    className="flex items-center gap-2 px-5 py-2 bg-[#ffe6e6] hover:bg-[#efc8c8] text-[#ea6645] font-medium rounded-md border border-[#ea6645] transition duration-300"
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
