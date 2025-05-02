import React, { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Mail, Lock, Loader2 } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
    <div data-aos='fade-up' className="flex h-screen w-full">
      <div className="hidden md:flex w-[60%] h-full justify-center items-center">
        <img
          src="/assets/Empty_hall.png"
          className="h-full"
          alt="Empty hall"
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
        <h1 className="text-4xl text-[#007E85] font-bold mb-4">
          WELCOME BACK
        </h1>
        <p className="mb-8 text-md text-gray-500">
          Welcome back! Please enter your details.
        </p>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
            <Mail className="text-gray-400 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full focus:outline-none"
              required
            />
          </div>

          <div className="flex items-center border-2 border-gray-300 rounded-md p-3 mb-4">
            <Lock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-between items-center mb-4">
           
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-gray-700 cusor-pointer hover:text-[#007E85]"
            >
              Forgot password
            </button>
          </div>

          <button 
            type="submit"
            className="w-full p-3 cursor-pointer bg-[#007E85] font-bold text-white rounded-md mb-4 hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            disabled={loading}
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

          {/* <button 
            type="button"
            className="w-full p-3 border rounded-md flex items-center justify-center gap-2"
            disabled={loading}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJg75LWB1zIJt1VTZO7O68yKciaDSkk3KMdw&s"
              alt="Google Icon"
              className="w-5"
            />
            Sign in with Google
          </button> */}
        </form>
        
        <p className="mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-gray-700 hover:text-[#007E85]">
            Sign up for free!
          </a>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl text-[#007E85] font-bold mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-500 mb-4">
              Enter your email to receive a password reset link.
            </p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
                <Mail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={handleForgotPasswordChange}
                  placeholder="Enter your email"
                  className="w-full focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="p-2 text-gray-700 hover:text-[#007E85]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 bg-[#007E85] text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center gap-2"
                  disabled={loading}
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