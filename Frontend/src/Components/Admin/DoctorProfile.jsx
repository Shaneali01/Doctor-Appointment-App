import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Mail, MapPin, Briefcase, DollarSign, TrendingUp, Award, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

const FullDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/get-doctor/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to fetch doctor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  // Handle doctor removal with confirmation
  const handleRemoveDoctor = async () => {
    if (window.confirm("Are you sure you want to remove this doctor?")) {
      try {
        const response = await axiosInstance.delete(`/doctor/delete-doctor/${id}`);
        toast.success(response.data.message);
        navigate("/");
      } catch (err) {
        setError("Failed to remove doctor");
      }
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.2 } },
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-gray-100">
        <motion.div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded flex-1 animate-pulse"></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <div className="h-10 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded-lg flex-1 animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-gray-100">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-red-100"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="text-red-600 text-center font-semibold text-base">{error}</p>
          <Link
            to="/doctors"
            className="mt-4 block text-center text-teal-600 hover:text-teal-800 font-semibold text-base transition-colors duration-300"
          >
            Back to Doctor List
          </Link>
        </motion.div>
      </div>
    );
  }

  // No Doctor Found State
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-gray-100">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="text-gray-600 text-center font-semibold text-base">No doctor found</p>
          <Link
            to="/doctors"
            className="mt-4 block text-center text-teal-600 hover:text-teal-800 font-semibold text-base transition-colors duration-300"
          >
            Back to Doctor List
          </Link>
        </motion.div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-teal-50 to-gray-100">
      <motion.div
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-6">
          <div className="flex items-center space-x-4">
            <motion.img
              src={doctor.image || "https://via.placeholder.com/150?text=Doctor"}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
            <div>
              <motion.h2
                className="text-xl font-bold text-white tracking-tight"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {doctor.name}
              </motion.h2>
              <motion.p
                className="text-teal-100 text-sm italic"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {doctor.specialty || "Specialty Not Specified"}
              </motion.p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 bg-gray-50">
          <div className="space-y-3">
            <DetailItem
              icon={<Mail size={16} />}
              label="Email"
              value={doctor.email || "Not provided"}
              variants={itemVariants}
            />
            <DetailItem
              icon={<MapPin size={16} />}
              label="Address"
              value={doctor.address || "Not specified"}
              variants={itemVariants}
            />
            <DetailItem
              icon={<Briefcase size={16} />}
              label="Experience"
              value={doctor.experience || "N/A"}
              variants={itemVariants}
            />
            <DetailItem
              icon={<DollarSign size={16} />}
              label="Specialty Fee"
              value={`$${doctor.fees}`}
              variants={itemVariants}
            />
            <DetailItem
              icon={<TrendingUp size={16} />}
              label="Earnings"
              value={doctor.earnings}
              variants={itemVariants}
            />
            <DetailItem
              icon={<Award size={16} />}
              label="Degree"
              value={doctor.degree || "N/A"}
              variants={itemVariants}
            />
            <DetailItem
              icon={<Info size={16} />}
              label="About"
              value={doctor.about || "No description"}
              variants={itemVariants}
            />
          </div>

          {/* Action Buttons */}
          <motion.div
            className="mt-6 flex gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              to="/doctor-list"
              className="flex-1 text-center py-2 px-6 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg hover:from-teal-700 hover:to-teal-900 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-xl transform hover:scale-105"
            >
              Back to List
            </Link>
            <motion.button
              onClick={handleRemoveDoctor}
              className="flex-1 py-2 px-6 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:from-red-700 hover:to-red-900 transition-all duration-300 font-semibold text-base shadow-md hover:shadow-xl transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Detail Item Component
const DetailItem = ({ icon, label, value, variants }) => (
  <motion.div
    className="flex items-center gap-3 py-2 hover:bg-teal-50 transition-colors duration-300 rounded-lg px-3"
    variants={variants}
    initial="hidden"
    animate="visible"
  >
    <span className="text-teal-600">{icon}</span>
    <span className="font-semibold text-teal-700 w-1/4 text-sm">{label}</span>
    <span className="text-gray-700 flex-1 text-sm break-words">{value}</span>
  </motion.div>
);

export default FullDetails;