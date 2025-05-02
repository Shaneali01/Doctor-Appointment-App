import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { LayoutDashboard, Calendar, User } from "lucide-react";
import DoctorDashboard from "../../Components/Doctor/Dashboard";
import DoctorAppointments from "../../Components/Doctor/Appoinments";
import DoctorProfile from "../../Components/Doctor/Profile";
import DoctorNavbar from "../../Components/Doctor/DoctorNavbar";

// Category icons for the sidebar
const categoryIcons = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Appointments: <Calendar className="w-5 h-5" />,
  Profile: <User className="w-5 h-5" />,
};

const DoctorPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map URL paths to category names
  const pathToCategory = {
    "/dashboard": "Dashboard",
    "/appointments": "Appointments",
    "/profile": "Profile",
  };

  // Derive selectedCategory from the current URL
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return pathToCategory[location.pathname] || "Dashboard";
  });

  // Sync selectedCategory with URL changes
  useEffect(() => {
    const category = pathToCategory[location.pathname] || "Dashboard";
    setSelectedCategory(category);
  }, [location.pathname]);

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const categories = ["Dashboard", "Appointments", "Profile"];

  // Map category names to URL paths
  const categoryToPath = {
    Dashboard: "/dashboard",
    Appointments: "/appointments",
    Profile: "/profile",
  };

  // Handle category click to navigate to the corresponding route
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(categoryToPath[category]);
  };

  // Render content based on the route
  const renderContent = () => (
    <Routes>
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/appointments" element={<DoctorAppointments />} />
      <Route path="/profile" element={<DoctorProfile />} />
      {/* Default route */}
      <Route path="*" element={<DoctorDashboard />} />
    </Routes>
  );

  return (
    <>
      <DoctorNavbar />
      <div className="min-h-screen pt-16 sm:pt-20 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Categories Sidebar */}
            <div
              data-aos="fade-up"
              className="bg-white p-4 sm:p-6 rounded-xl shadow-md lg:sticky lg:top-16 sm:lg:top-20 h-fit border-t-4 border-teal-500"
            >
              <h2 className="text-xl sm:text-2xl text-gray-900 font-semibold mb-4 sm:mb-6 text-center">
                Categories
              </h2>
              <ul className="space-y-3 sm:space-y-4">
                {categories.map((category) => (
                  <li
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center justify-start gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 cursor-pointer rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-[#007e85] text-white shadow-md"
                        : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    }`}
                  >
                    {categoryIcons[category]}
                    <span className="font-medium text-sm sm:text-base">{category}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Main Content */}
            <div data-aos="fade-up" className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorPage;