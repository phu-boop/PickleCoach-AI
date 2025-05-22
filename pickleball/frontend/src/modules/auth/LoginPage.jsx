import { useState } from 'react';
import { FaFacebookF, FaGoogle, FaApple } from 'react-icons/fa';
const LoginPage = () => {
  const [check, setCheck] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCheck = () => {
    setCheck(!check);
  };

  const handleSubmit = () => {
    if (check) {
      setSubmitted(true);
    }
  };

  const handleCancel = () => {
    setSubmitted(false);
    setCheck(false);
  };

  return (
    <>
      {submitted && check ? (
        <div>
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
              {/* Tiêu đề */}
              <h2 className="text-lg font-semibold text-teal-600 mb-4">Sign in with</h2>

              {/* Nút đăng nhập với Facebook, Google, Apple */}
              <div className="flex justify-between mb-4">
                <button
                  className="flex items-center justify-center w-1/3 py-2 mx-1 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gradient-to-b hover:from-[#1d6172] hover:to-[#0a2f38] hover:text-white transition-colors duration-300"
                >
                  <FaFacebookF className="mr-2 text-blue-600" />
                  Facebook
                </button>
                <button
                  className="flex items-center justify-center w-1/3 py-2 mx-1 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gradient-to-b hover:from-[#1d6172] hover:to-[#0a2f38] hover:text-white transition-colors duration-300"
                >
                  <FaGoogle className="mr-2 text-red-500" />
                  Google
                </button>
                <button
                  className="flex items-center justify-center w-1/3 py-2 mx-1 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gradient-to-b hover:from-[#1d6172] hover:to-[#0a2f38] hover:text-white transition-colors duration-300"
                >
                  <FaApple className="mr-2 text-black" />
                  Apple
                </button>
              </div>

              {/* Dòng "or" */}
              <div className="relative mb-4">
                <hr className="border-gray-300" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500">
                  or
                </span>
              </div>

              {/* Trường nhập Email hoặc Số điện thoại */}
              <input
                type="text"
                placeholder="Email Address or Phone Number"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {/* Nút Continue */}
              <button
                className="w-full py-3 bg-teal-600 text-white rounded-full hover:bg-gradient-to-b hover:from-[#1d6172] hover:to-[#0a2f38] transition-colors duration-300"
              >
                Continue
              </button>

              {/* Text phụ và liên kết Sign up */}
              <p className="text-sm text-gray-500 mt-4 text-center">
                We'll ask for your password next.
              </p>
              <p className="text-sm text-center mt-2">
                New here?{' '}
                <a href="#" className="text-teal-600 font-semibold hover:underline">
                  Sign up! →
                </a>
              </p>
            </div>
          </div>
          <div className='absolute top-10 right-8'>
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
      ) : (
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="flex items-center justify-center max-w-99 bg-white">
            <div className="text-center">
              {/* Logo */}
              <div className="mb-6">
                <img
                  src="https://www.pickleheads.com/assets/logo-mark.svg"
                  alt="PickleHeads Logo"
                  className="w-40 h-40 mx-auto"
                />
              </div>

              {/* Title */}
              <h1 className="text-5xl font-bold font-grandstander text-gray-800 mb-4">PickleHeads®</h1>

              {/* Subtitle */}
              <p className="text-3xl font-black text-[#2a7e93] mb-6">
                Join the fastest growing pickleball community
              </p>

              {/* Checkbox */}
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

              {/* Create Account Button */}
              <button
                className={`w-full py-3 rounded-full mb-4 transition-colors duration-300 cursor-pointer ${
                  check
                    ? 'bg-[#2c91aa] text-white hover:bg-gradient-to-b hover:from-[#2d97b2] hover:to-[#135a6b]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleSubmit}
                disabled={!check}
              >
                CREATE AN ACCOUNT
              </button>

              {/* Sign In Link */}
              <p className="text-base font-bold text-gray-600 mb-4">
                Have an account?{' '}
                <a href="#" className="text-[#2c91aa] hover:underline">
                  Sign in!
                </a>
              </p>

              {/* Footer Links */}
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

          {/* Cancel Button */}
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
