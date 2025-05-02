import React, { useState, useEffect, useRef } from "react";
import { LogOut, Bell } from "lucide-react";
import logo from "../../../public/assets/Doclink.png";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../Lib/axios";

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const doctor = JSON.parse(localStorage.getItem("User") || "{}");
  const doctorId = doctor.id;
  const notificationRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(`/doctor/get-notifications/${doctorId}`);
      setNotifications(response.data || []);
    } catch (err) {
      toast.error("Failed to fetch notifications");
      console.error("Notifications fetch error:", err);
      setNotifications([
        {
          message: "A new appointment with John Doe has been booked for 5/1/2025 at 10:00 AM",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchNotifications();
    }
  }, [doctorId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Clear notifications
  const handleClearNotifications = async () => {
    try {
      await axiosInstance.delete(`/doctor/clear-notifications/${doctorId}`);
      setNotifications([]);
      toast.success("Notifications cleared");
    } catch (err) {
      toast.error("Failed to clear notifications");
      console.error("Clear notifications error:", err);
    }
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("Token");
    localStorage.removeItem("User");
    toast.success("Logout successful!");
    navigate("/");
  };

  return (
    <nav className="p-4 fixed navbar text-gray-700 bg-transparent top-0 left-0 w-full z-50 h-16 flex items-center font-lato">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center">
          <img src={logo} alt="Logo" className="h-52 w-auto object-contain" />
        </Link>

        {/* Notification Bell and Logout Button */}
        <div className="flex space-x-4 items-center">
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative flex items-center focus:outline-none p-2"
              aria-label="View notifications"
            >
              <Bell size={24} className="text-[#008080] hover:text-[#006666] transition-colors duration-200" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-56 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl z-50 border border-gray-100 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-dropdown">
                {notifications.length === 0 ? (
                  <p className="px-4 py-3 text-gray-700 text-sm text-center">No notifications</p>
                ) : (
                  <>
                    {notifications.map((notification, index) => (
                      <div
                        key={notification._id || index}
                        className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-[#008080] hover:text-white transition-colors duration-200"
                      >
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                    <div className="sticky bottom-0 bg-white border-t border-gray-100">
                      <button
                        onClick={fetchNotifications}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white transition-colors duration-200"
                        aria-label="Refresh notifications"
                      >
                        Refresh Notifications
                      </button>
                      <button
                        onClick={handleClearNotifications}
                        className="w-full text-left px-4 py-3 text-gray-700 hover:bg-[#008080] hover:text-white rounded-b-lg transition-colors duration-200"
                        aria-label="Clear all notifications"
                      >
                        Clear Notifications
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="bg-[#008080] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#006666] flex items-center"
          >
            <LogOut size={20} className="mr-2" />
            Log Out
          </button>
        </div>
      </div>

      {/* Dropdown Animation CSS */}
      <style jsx>{`
        @keyframes dropdown {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-dropdown {
          animation: dropdown 0.2s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default DoctorNavbar;