import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import useNotificationStore from "../../Store/NotificationStore";
import Confetti from "react-confetti";

const AppointmentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti
  const hasRun = useRef(false); // Prevent double calls in Strict Mode
  const { fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (hasRun.current) return; // Skip if already run
    hasRun.current = true;

    const bookAppointment = async () => {
      const sessionId = searchParams.get("session_id");
      const doctorId = searchParams.get("doctorId");
      const date = searchParams.get("date");
      const time = searchParams.get("time");
      const patientId = searchParams.get("patientId");

      if (!sessionId || !doctorId || !date || !time || !patientId) {
        setStatus("error");
        toast.error("Invalid booking details", { id: "invalid-params" });
        setTimeout(() => navigate("/booked-appointments"), 2000);
        return;
      }

      try {
        const token = localStorage.getItem("Token");
        if (!token) {
          setStatus("error");
          toast.error("Please log in again", { id: "auth-error" });
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        const response = await axiosInstance.post(
          "/user/set-appointment",
          {
            doctorId,
            date,
            time,
            sessionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setStatus("success");
        setShowConfetti(true); // Trigger confetti on success
        toast.success(response.data.message || "Appointment booked successfully!");
        fetchNotifications(patientId);

        // Stop confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
        // Redirect after 5 seconds
        setTimeout(() => navigate("/booked-appointments"), 5000);
      } catch (err) {
        setStatus("error");
        const errorMessage = err.response?.data?.message || "Failed to confirm appointment";
        toast.error(errorMessage, { id: "confirm-error" });
        setTimeout(() => navigate("/booked-appointments"), 2000);
      }
    };

    bookAppointment();
  }, []); // Empty dependency array to run only once

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {showConfetti && (
        <Confetti
          width={window.innerWidth || document.documentElement.clientWidth}
          height={window.innerHeight || document.documentElement.clientHeight}
          recycle={false}
          numberOfPieces={600}
          gravity={0.5}
          tweenDuration={2000}
        />
      )}
      <div className="flex flex-col items-center z-10">
        {status === "loading" && (
          <>
            <Loader className="w-12 h-12 text-teal-500 animate-spin" />
            <p className="mt-4 text-lg text-gray-700 font-medium">Processing your appointment...</p>
          </>
        )}
        {status === "success" && (
          <p className="text-lg text-teal-500 font-medium">Appointment booked! Redirecting...</p>
        )}
        {status === "error" && (
          <p className="text-lg text-red-500 font-medium">Error booking appointment. Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default AppointmentSuccess;