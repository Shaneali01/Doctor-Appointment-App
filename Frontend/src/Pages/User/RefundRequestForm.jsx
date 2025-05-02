import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const RefundRequestForm = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const user = JSON.parse(localStorage.getItem("User") || "{}");
    const patientId = user?.id;

    if (!token || !patientId) {
      setError("Please log in to submit a refund request.");
      setLoading(false);
      toast.error("Please log in to submit a refund request", { id: "login-error" });
      navigate("/login");
      return;
    }

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const fetchAppointment = async () => {
      try {
        const response = await axiosInstance.get(`/user/appointment/${appointmentId}`);
        setAppointment(response.data.appointment);
      } catch (err) {
        setError("Failed to fetch appointment details. Please try again.");
        toast.error(err.response?.data?.message || "Error loading appointment", {
          id: "fetch-error",
        });
        console.error("Fetch appointment error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please provide a reason for the refund", { id: "reason-error" });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("Token");
      const response = await axiosInstance.post(
        "/refund/request",
        {
          appointmentId,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "Refund request submitted successfully");
      setTimeout(() => navigate("/booked-appointments"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit refund request", {
        id: "submit-error",
      });
      console.error("Submit refund request error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <Loader className="w-12 h-12 text-teal-500 animate-spin" />
          <p className="text-gray-700 text-lg font-semibold">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-l-4 border-red-500 max-w-md text-center transform transition-all duration-300 hover:shadow-xl">
          <p className="text-gray-800 text-lg font-semibold mb-4">{error || "Appointment not found"}</p>
          <button
            onClick={() => navigate("/booked-appointments")}
            className="inline-flex items-center px-5 py-2 bg-teal-500 text-white rounded-lg text-base font-medium hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-teal-500 transform transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-3xl font-extrabold text-teal-800 mb-6 text-center tracking-tight">
          Refund Request Form
        </h2>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-teal-50 p-5 rounded-xl">
          <p className="text-gray-700 text-base">
            <span className="font-semibold">Doctor:</span> {appointment.doctorName}
          </p>
          <p className="text-gray-700 text-base">
            <span className="font-semibold">Specialty:</span> {appointment.specialty || "N/A"}
          </p>
          <p className="text-gray-700 text-base">
            <span className="font-semibold">Date & Time:</span>{" "}
            {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {appointment.time}
          </p>
          <p className="text-gray-700 text-base">
            <span className="font-semibold">Fees Paid:</span> ${appointment.fees || "N/A"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-gray-700 text-base font-semibold mb-2">
              Reason for Refund
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
              rows="4"
              placeholder="Please explain why you are requesting a refund..."
              required
            ></textarea>
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/booked-appointments")}
              className="px-5 py-2 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg text-sm ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Submitting..." : "Submit Refund Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestForm;