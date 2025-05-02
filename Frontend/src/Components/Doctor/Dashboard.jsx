// src/components/DoctorDashboard.jsx
import React, { useState, useEffect } from "react";
import { DollarSign, Users, Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../Common/ConfirmationModel";

const DoctorDashboard = () => {
  const [earnings, setEarnings] = useState("$0");
  const [patients, setPatients] = useState(0);
  const [appointments, setAppointments] = useState(0);
  const [latestAppointments, setLatestAppointments] = useState([]);
  const [loading, setLoading] = useState({ earnings: true, patients: true, appointments: true, latest: true });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const doctor = localStorage.getItem("User");
    const doctorId = doctor ? JSON.parse(doctor).id : null;

    if (!token || !doctorId) {
      setErrors({ general: "Please log in to view your dashboard." });
      setLoading({ earnings: false, patients: false, appointments: false, latest: false });
      toast.error("Please log in to view dashboard");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchEarnings = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/total-earnings/${doctorId}`);
        setEarnings(`$${response.data.totalEarnings}`);
      } catch (err) {
        setErrors((prev) => ({ ...prev, earnings: "Failed to fetch earnings" }));
        toast.error("Error loading earnings");
        console.error("Earnings fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, earnings: false }));
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/total-patients/${doctorId}`);
        setPatients(response.data.patients);
      } catch (err) {
        setErrors((prev) => ({ ...prev, patients: "Failed to fetch patients" }));
        toast.error("Error loading patients");
        console.error("Patients fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, patients: false }));
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/total-appointments/${doctorId}`);
        setAppointments(response.data.appointments);
      } catch (err) {
        setErrors((prev) => ({ ...prev, appointments: "Failed to fetch appointments" }));
        toast.error("Error loading appointments");
        console.error("Appointments fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, appointments: false }));
      }
    };

    const fetchLatestAppointments = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/latest-appointments/${doctorId}`);
        setLatestAppointments(response.data.latestAppointments || []);
      } catch (err) {
        setErrors((prev) => ({ ...prev, latest: "Failed to fetch latest appointments" }));
        toast.error("Error loading latest appointments");
        console.error("Latest appointments fetch error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, latest: false }));
      }
    };

    fetchEarnings();
    fetchPatients();
    fetchAppointments();
    fetchLatestAppointments();
  }, []);

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      const doctorId = JSON.parse(localStorage.getItem("User")).id;
      const response = await axiosInstance.put(`/doctor/complete-appointments/${doctorId}/${appointmentId}`);
      toast.success(response.data.message);
      setLatestAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Completed" } : appt
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete appointment");
      console.error("Accept error:", err);
    }
  };

  const openCompleteModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const confirmComplete = () => {
    if (selectedAppointmentId) {
      handleAcceptAppointment(selectedAppointmentId);
      setIsModalOpen(false);
      setSelectedAppointmentId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointmentId(null);
  };

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
          Doctor Dashboard
        </h2>

        {errors.general ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-100">
            <p className="text-lg font-medium text-red-600">{errors.general}</p>
            <button
              onClick={() => (window.location.href = "/login")}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 transform hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-100">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <DollarSign className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Earnings</p>
                  {loading.earnings ? (
                    <Loader2 className="w-6 h-6 text-teal-200 animate-spin" />
                  ) : errors.earnings ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{earnings}</p>
                  )}
                </div>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-200">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Patients</p>
                  {loading.patients ? (
                    <Loader2 className="w-6 h-6 text-teal-200 animate-spin" />
                  ) : errors.patients ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{patients}</p>
                  )}
                </div>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-300">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Calendar className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Appointments</p>
                  {loading.appointments ? (
                    <Loader2 className="w-6 h-6 text-teal-200 animate-spin" />
                  ) : errors.appointments ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{appointments}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Latest Appointments Section */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 animate-fadeInUp delay-400">
                Latest Appointments
              </h3>
              {loading.latest ? (
                <div className="flex items-center justify-center py-10 animate-fadeInUp delay-400">
                  <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                    <p className="text-lg font-medium text-gray-700">Loading appointments...</p>
                  </div>
                </div>
              ) : errors.latest ? (
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-400">
                  <p className="text-lg font-medium text-red-600">{errors.latest}</p>
                </div>
              ) : latestAppointments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-400">
                  <p className="text-lg text-gray-500 font-medium">No recent appointments found.</p>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Back to Home
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestAppointments.map((appt, index) => (
                    <div
                      key={appt.id}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 rounded-full">
                          <Calendar className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-bold text-sm sm:text-base">{appt.patient}</p>
                          <p className="text-sm text-gray-600">{appt.time}</p>
                        </div>
                      </div>
                      {appt.status === "Pending" ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => openCompleteModal(appt.id)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Complete</span>
                            <span className="sm:hidden">Done</span>
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                            appt.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : appt.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appt.status === "Completed" && <CheckCircle className="w-4 h-4" />}
                          {appt.status === "Cancelled" && <XCircle className="w-4 h-4" />}
                          {appt.status}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Modal for Completing Appointment */}
            <ConfirmModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={confirmComplete}
              title="Confirm Appointment Completion"
              message="Are you sure you want to mark this appointment as completed?"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;