import React, { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../Lib/axios";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('/auth/reset-password', {
        token,
        password: formData.password
      });
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center p-8 bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl text-[#007E85] font-bold mb-4">
          Reset Password
        </h1>
        <p className="text-gray-500 mb-4">
          Enter your new password below.
        </p>
        
        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
            <Lock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="New password"
              className="w-full focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border-2 border-[#007E85] rounded-md p-3 mb-4">
            <Lock className="text-gray-400 mr-2" />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm new password"
              className="w-full focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-[#007E85] text-white rounded-md hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;