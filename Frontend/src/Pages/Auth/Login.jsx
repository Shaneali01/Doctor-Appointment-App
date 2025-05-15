import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail, Lock, Loader2 } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleForgotPasswordChange = (e) => {
    setForgotPasswordEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      toast.success(response.data.message);
      localStorage.setItem("User", JSON.stringify(response.data.user));
      localStorage.setItem("Token", response.data.token);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email: forgotPasswordEmail });
      toast.success(response.data.message);
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-aos='fade-up' className="flex h-screen w-full max-w-full overflow-x-hidden">
      <div className="hidden md:flex w-[60%] h-full justify-center items-center">
        <img
          src="/assets/Empty_hall.png"
          className="h-full w-full object-cover"
          alt="Empty hospital hall"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8">
        <h1 className="text-3xl sm:text-4xl text-[#007E85] font-bold mb-4">
          WELCOME BACK
        </h1>
        <p className="mb-6 text-sm sm:text-base text-gray-500">
          Welcome back! Please enter your details.
        </p>
        
        {error && (
          <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
        )}

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
            <Mail className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full focus:outline-none text-base sm:text-lg"
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 rounded-md p-3 mb-4">
            <Lock className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full focus:outline-none text-base sm:text-lg"
              required
            />
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-gray-700 text-sm sm:text-base hover:text-[#007E85] transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <button 
            type="submit"
            className="w-full px-6 sm:px-8 py-3 bg-[#007E85] text-white rounded-full text-base sm:text-lg font-bold shadow-xl hover:bg-[#006669] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#007E85] disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
            aria-label="Sign in"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          {/* Uncomment if Google Sign-In is needed */}
          {/* <button 
            type="button"
            className="w-full px-6 sm:px-8 py-3 mt-4 bg-white text-[#007E85] border-2 border-[#007E85] rounded-full text-base sm:text-lg font-semibold shadow-xl hover:bg-[#007E85] hover:text-white hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#007E85] disabled:bg-gray-400 cursor-pointer"
            disabled={loading}
            aria-label="Sign in with Google"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJg75LWB1zIJt1VTZO7O68yKciaDSkk3KMdw&s"
              alt="Google Icon"
              className="w-5 h-5"
            />
            Sign in with Google
          </button> */}
        </form>
        
        <p className="mt-6 text-sm sm:text-base">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#007E85] hover:bg-[#007E85] hover:text-white px-3 py-1 rounded-full font-semibold transition-all duration-300"
          >
            Sign up for free!
          </Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl sm:text-2xl text-[#007E85] font-bold mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              Enter your email to receive a password reset link.
            </p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
                <Mail className="text-gray-400 mr-2 w-5 h-5" />
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={handleForgotPasswordChange}
                  placeholder="Enter your email"
                  className="w-full focus:outline-none text-base sm:text-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="px-4 py-2 text-gray-700 text-sm sm:text-base hover:text-[#007E85] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-[#007E85] text-white rounded-full text-base sm:text-lg font-semibold shadow-xl hover:bg-[#006669] hover:scale-105 transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#007E85] disabled:bg-gray-400 cursor-pointer"
                  disabled={loading}
                  aria-label="Send reset link"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;