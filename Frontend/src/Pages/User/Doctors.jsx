import { useEffect, useState } from "react";
import { FaTooth } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Stethoscope, Brain, Bone, Baby, Heart, Eye, ChevronDown, Calendar } from "lucide-react";
import backgroundImage from "../../../public/assets/hospital_building.jpg";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";

// Expanded category icons
const categoryIcons = {
  Cardiologist: <Stethoscope className="w-5 h-5" />,
  Orthodontist: <FaTooth className="w-5 h-5" />,
  Neurologist: <Brain className="w-5 h-5" />,
  Orthopedic: <Bone className="w-5 h-5" />,
  Pediatrician: <Baby className="w-5 h-5" />,
  "Heart Surgeon": <Heart className="w-5 h-5" />,
  Ophthalmologist: <Eye className="w-5 h-5" />,
  Pulmonologist: <Heart className="w-5 h-5" />,
};

const DoctorCard = ({ doctor }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
    <div className="flex items-center gap-3">
      <Calendar className="w-6 h-6 text-teal-500" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
        <p className="text-gray-600 text-sm">{doctor.specialty}</p>
        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <span>Experience: {doctor.experience} years</span>
          <span>|</span>
          <span>Hospital: {doctor.address || "Not specified"}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
        Available
      </span>
      <Link
        to={`/appointment/${doctor._id}`}
        className="px-3 py-1 bg-teal-500 text-white rounded-full text-sm font-medium hover:bg-teal-600 transition-all duration-200"
      >
        Book
      </Link>
    </div>
  </div>
);

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Cardiologist");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctor/get-approved-doctors");
        const fetchedDoctors = response.data || [];
        setDoctors(fetchedDoctors);

        const categories = [...new Set(fetchedDoctors.map((doctor) => doctor.specialty))];

        if (categoryFromUrl && categories.includes(categoryFromUrl)) {
          setSelectedCategory(categoryFromUrl);
        } else if (!categories.includes("Cardiologist") && categories.length > 0) {
          setSelectedCategory(categories[0]);
        }
      } catch (err) {
        setError("Failed to fetch doctors. Please try again later.");
        toast.error("Error loading doctors");
        console.error("Doctors fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [location.search]);

  const filteredDoctors = doctors.filter((doctor) => doctor.specialty === selectedCategory);
  const categories = [...new Set(doctors.map((doctor) => doctor.specialty))];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading with Background Image and Animated Arrow */}
        <div
          data-aos="fade-up"
          className="relative mb-12 h-[360px] flex items-center justify-center rounded-xl overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0" />
          <div className="relative z-10 text-center px-6 py-10">
            <h1 className="text-4xl md:text-6xl text-teal-600 font-bold tracking-tight">
              Find Your Doctor Below
            </h1>
            <p className="text-lg md:text-xl font-bold text-gray-200 mt-4 max-w-2xl">
              Connect with top healthcare professionals tailored to your needs.
            </p>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <ChevronDown
              className="w-12 h-12 text-teal-500 animate-bounce"
              strokeWidth={3}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-700 text-center">Loading doctors...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            {/* Categories Sidebar */}
            <div
              data-aos="fade-up"
              className="bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-20 h-fit border-t-4 border-teal-500"
            >
              <h2 className="text-3xl text-teal-600 font-bold mb-6 text-center">
                Specialties
              </h2>
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center justify-start gap-3 px-4 py-3 cursor-pointer rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-teal-600 text-white shadow-md"
                        : "text-gray-700 font-bold hover:bg-teal-50 hover:text-teal-600"
                    }`}
                  >
                    {categoryIcons[category] || <Stethoscope className="w-5 h-5" />}
                    <span className="font-medium text-base">{category}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Doctors List */}
            <div data-aos="fade-up" className="lg:col-span-1">
              <div className="mb-6 flex items-center justify-between p-4 bg-teal-500 text-white rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                  <span className="text-lg font-bold">Total Doctors: {filteredDoctors.length}</span>
                </div>
                <Link
                  to="/booked-appointments"
                  className="px-4 py-2 bg-white text-teal-500 rounded-lg font-semibold shadow hover:bg-gray-100 transition-all duration-200"
                >
                  Your Appointments
                </Link>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Doctors</h2>
              {filteredDoctors.length === 0 ? (
                <p className="text-gray-600 text-center">No doctors found for this specialty.</p>
              ) : (
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard key={doctor._id} doctor={doctor} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div data-aos="fade-up" className="mt-16"></div>
      </div>
    </div>
  );
}