import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../Lib/axios"; // Adjust path
import toast from "react-hot-toast";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const doctor = localStorage.getItem("User"); // Fetch ID from localStorage
    const doctorId= JSON.parse(doctor).id;
    if (!doctorId) {
      setError("Doctor ID not found in localStorage. Please log in again.");
      setLoading(false);
      toast.error("Please log in to view profile");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get(`doctor/get-doctor/${doctorId}`);
        console.log(response)
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to fetch profile data. Please try again later.");
        toast.error(err.response?.data?.message || "Error loading profile");
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-t-4 border-teal-500">
        <p className="text-gray-700 text-center">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-t-4 border-teal-500">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border-t-4 border-teal-500">
      <h2 className="text-xl sm:text-2xl text-gray-900 font-semibold mb-4 sm:mb-6">
        Profile
      </h2>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-32 h-32 rounded-full object-cover border-2 border-teal-500"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Specialty:</span> {doctor.specialty}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Email:</span> {doctor.email}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Phone:</span> {doctor.phone}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Experience:</span> {doctor.experience}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fees:</span> ${doctor.fees}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Degree:</span> {doctor.degree}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Address:</span> {doctor.address}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">About:</span> {doctor.about}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;