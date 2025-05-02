import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { XCircle, CheckCircle, Trash2, DollarSign, Loader, Calendar } from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import ConfirmModal from "../../Components/Common/ConfirmationModel";

const BookedAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const patientId = user?.id;

    if (!token || !patientId) {
      setError("Please log in to view your appointments.");
      setLoading(false);
      toast.error("Please log in to view appointments", { id: "login-error" });
      navigate("/login");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get(`user/get-appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
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

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem("Token");
      const user = JSON.parse(localStorage.getItem("User") || "{}");
      const patientId = user?.id;

      if (!token || !patientId) {
        toast.error("Please log in again", { id: "auth-error" });
        navigate("/login");
        return;
      }

      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axiosInstance.put(
        `/user/cancel-appointments/${patientId}/${appointmentId}`
      );
      toast.success(response.data.message || "Cancellation requested successfully");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status: "Cancellation Requested" } : appt
        )
      );
      navigate(`/RefundRequest/${appointmentId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request cancellation", {
        id: "cancel-error",
      });
      console.error("Cancel appointment error:", err);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await axiosInstance.delete(`/user/delete-appointment/${appointmentId}`);
      toast.success(response.data.message || "Appointment deleted successfully");
      setAppointments((prev) => prev.filter((appt) => appt._id !== appointmentId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete appointment", {
        id: "delete-error",
      });
      console.error("Delete appointment error:", err);
    }
  };

  const handleRefundRequest = (appointmentId) => {
    navigate(`/RefundRequest/${appointmentId}`);
  };

  const openCancelModal = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setIsModalOpen(true);
  };

  const confirmCancel = () => {
    if (selectedAppointmentId) {
      handleCancelAppointment(selectedAppointmentId);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader className="w-14 h-14 text-teal-500 animate-spin" />
          <p className="text-gray-700 text-xl font-semibold">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border-l-4 border-red-500 max-w-lg text-center transform transition-all duration-300 hover:shadow-xl">
          <p className="text-gray-800 text-xl font-semibold mb-6">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-medium hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-14 from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl shadow-xl p-8 mb-10 flex items-center justify-between transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-yellow-400 rounded-full shadow-lg">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <div>
              <p className="text-xl font-semibold tracking-tight">Total Appointments</p>
              <p className="text-5xl font-extrabold tracking-tight">{appointments.length}</p>
            </div>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center px-6 py-3 bg-white text-teal-600 rounded-lg text-base font-medium hover:bg-teal-50 transition-all duration-300 shadow-md"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Your Booked Appointments
        </h2>

        {appointments.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-xl text-center transform transition-all duration-300 hover:shadow-2xl">
            <Calendar className="w-20 h-20 text-teal-500 mx-auto mb-6" />
            <p className="text-gray-800 text-2xl font-semibold mb-3">No appointments booked yet</p>
            <p className="text-gray-600 text-lg mb-6">
              Schedule a visit with a doctor to get started!
            </p>
            <Link
              to="/doctors"
              className="inline-flex items-center px-6 py-3 bg-teal-500 text-white rounded-lg text-base font-medium hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Find a Doctor
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-5 mb-4 sm:mb-0">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <Calendar className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 text-xl font-bold">{appt.doctorName}</p>
                    <p className="text-gray-600 text-base font-medium">{appt.specialty || "N/A"}</p>
                    <p className="text-gray-500 text-sm">
                      {new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                      , {appt.time}
                    </p>
                    <p className="text-gray-500 text-sm font-medium">
                      Fees: ${appt.fees || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold ${
                      appt.status === "Cancellation Requested"
                        ? "bg-orange-100 text-orange-700"
                        : appt.status === "Cancelled"
                        ? "bg-red-100 text-red-700"
                        : appt.status === "Completed"
                        ? "bg-teal-100 text-teal-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    {appt.status === "Pending" && (
                      <button
                        onClick={() => openCancelModal(appt._id)}
                        className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Cancel appointment"
                        aria-label="Cancel appointment"
                      >
                        Cancel
                      </button>
                    )}
                    {appt.status === "Cancellation Requested" && (
                      <span className="text-gray-500 text-sm italic">
                        Awaiting Refund Approval
                      </span>
                    )}
                    {appt.status === "Cancelled" && (
                      <>
                        <button
                          onClick={() => handleRefundRequest(appt._id)}
                          className="inline-flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Request refund"
                          aria-label="Request refund"
                        >
                          Refund
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(appt._id)}
                          className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
                          title="Delete appointment"
                          aria-label="Delete appointment"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmCancel}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this appointment? You will need to request a refund."
      />
    </div>
  );
};

export default BookedAppointments;