// src/components/Appointments.jsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Calendar, XCircle } from "lucide-react";
import ConfirmModal from "../Common/ConfirmationModel";

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/admin/GetAllAppointments");
        setAppointments(response.data || []);
      } catch (err) {
        setError("Failed to fetch appointments.");
        console.error("Appointments fetch error:", err);
        toast.error("Error loading appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (appointmentId) => {
    try {
      await axiosInstance.delete(`/admin/delete-appointment/${appointmentId}`);
      setAppointments((prev) => prev.filter((appt) => appt.id !== appointmentId));
      toast.success("Appointment deleted successfully");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      toast.error(err.response?.data?.message || "Failed to delete appointment");
    }
  };

  const openDeleteModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointmentId) {
      handleDelete(selectedAppointmentId);
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
          Appointments
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10 animate-fadeInUp delay-100">
            <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
              <XCircle className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Loading appointments...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-100">
            <p className="text-lg font-medium text-red-600">{error}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-100">
            <p className="text-lg text-gray-500 font-medium">No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 rounded-full">
                    <Calendar className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm sm:text-base">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">Doctor: {appointment.doctor}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.date} | {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : appointment.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  {appointment.status !== "Pending" && (
                    <button
                      onClick={() => openDeleteModal(appointment.id)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <XCircle className="w-4 h-4" />
                      Delete
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
        onConfirm={confirmDelete}
        title="Confirm Appointment Deletion"
        message="Are you sure you want to delete this appointment?"
      />
    </div>
  );
};

export default Appointments;