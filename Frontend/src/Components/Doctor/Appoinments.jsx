// src/components/DoctorAppointments.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, CheckCircle, Loader2, Calendar } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../Common/ConfirmationModel";

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    const doctorId = user?.id;

    if (!doctorId) {
      setError("Doctor ID not found. Please log in.");
      setLoading(false);
      toast.error("Please log in to view appointments", { id: "login-error" });
      navigate("/login");
      return;
    }

    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/get-appointments/${doctorId}`);
        setAppointments(response.data.appointments || []);
      } catch (err) {
        setError("Failed to fetch appointments. Please try again.");
        toast.error(err.response?.data?.message || "Error loading appointments", {
          id: "fetch-error",
        });
        console.error("Fetch appointments error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleCompleteAppointment = async (appointmentId) => {
    try {
      const user = JSON.parse(localStorage.getItem("User"));
      const doctorId = user?.id;
      if (!doctorId) {
        toast.error("Doctor ID not found", { id: "doctor-id-error" });
        return;
      }

      const response = await axiosInstance.put(`/doctor/complete-appointments/${doctorId}/${appointmentId}`);
      toast.success(response.data.message || "Appointment marked as completed");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete appointment", {
        id: "complete-error",
      });
      console.error("Complete appointment error:", err);
    }
  };

  const openCompleteModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const confirmComplete = () => {
    if (selectedAppointmentId) {
      handleCompleteAppointment(selectedAppointmentId);
      setIsModalOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg animate-fadeInUp">
          <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 animate-fadeInUp">
          <p className="text-lg font-medium text-red-600">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 transform hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500 animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl text-teal-700 font-bold mb-6">
          Your Appointments
        </h2>
        {appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-100">
            <p className="text-lg text-gray-500 font-medium">No appointments scheduled.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt, index) => (
              <div
                key={appt._id || index}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <img
                        src={appt.patientImage || "https://via.placeholder.com/40"}
                        alt={appt.patientName}
                        className="w-8 h-8 rounded-full object-cover border-2 border-teal-400 shadow-sm"
                      />
                      <p className="text-gray-800 font-bold text-sm sm:text-base">{appt.patientName}</p>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {appt.time}
                    </p>
                    <p className="text-sm text-gray-600">Age: {appt.patientAge || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      Payment:{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appt.feePaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appt.feePaid ? "PAID" : "CASH"}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {appt.status === "Cancelled" ? (
                    <span className="px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 bg-red-100 text-red-800">
                      <XCircle className="w-4 h-4" /> Cancelled
                    </span>
                  ) : appt.status === "Completed" ? (
                    <span className="px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4" /> Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => openCompleteModal(appt._id)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Complete</span>
                      <span className="sm:hidden">Done</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmComplete}
        title="Confirm Appointment Completion"
        message="Are you sure you want to mark this appointment as completed?"
      />
    </div>
  );
};

export default DoctorAppointments;