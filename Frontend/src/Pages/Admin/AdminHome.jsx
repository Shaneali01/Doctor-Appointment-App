import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Dashboard } from "../../Components/Admin/Dashboard";
import AddDoctor from "../../Components/Admin/AddDoctor";
import DoctorList from "../../Components/Admin/DoctorList";
import Appointments from "../../Components/Admin/Appoinments";
import AOS from "aos";
import "aos/dist/aos.css";
import { LayoutDashboard, Calendar, UserPlus, Users,ChartSpline } from "lucide-react";
import { AdminNavbar } from "../../Components/Admin/AdminNavbar";
import FullDetails from "../../Components/Admin/DoctorProfile";
import Analytics from "../../Components/Admin/Analytics";

// Category icons for the sidebar
const categoryIcons = {
  Dashboard: <LayoutDashboard className="w-5 h-5" />,
  Appointments: <Calendar className="w-5 h-5" />,
  "Add Doctor": <UserPlus className="w-5 h-5" />,
  "Doctor List": <Users className="w-5 h-5" />,
  "Analytics": <ChartSpline className="w-5 h-5" />,

};

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map URL paths to category names for syncing selectedCategory
  const pathToCategory = {
    "/dashboard": "Dashboard",
    "/appointments": "Appointments",
    "/add-doctor": "Add Doctor",
    "/doctor-list": "Doctor List",
    "/analytics": "Analytics",
  };

  // Derive selectedCategory from the current URL
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return pathToCategory[location.pathname] || "Dashboard";
  });

  // Update selectedCategory when the URL changes
  useEffect(() => {
    const category = pathToCategory[location.pathname] || "Dashboard";
    setSelectedCategory(category);
  }, [location.pathname]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const categories = ["Dashboard", "Appointments", "Add Doctor", "Doctor List","Analytics"];

  // Map category names to URL paths for navigation
  const categoryToPath = {
    Dashboard: "/dashboard",
    Appointments: "/appointments",
    "Add Doctor": "/add-doctor",
    "Doctor List": "/doctor-list",
    Analytics: "/analytics",
  };

  // Handle category click to navigate to the corresponding route
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    navigate(categoryToPath[category]);
  };

  // Render the content based on the route
  const renderContent = () => (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/add-doctor" element={<AddDoctor />} />
      <Route path="/doctor-list" element={<DoctorList />} />
      <Route path="/doctors/:id" element={<FullDetails />} />
      <Route path="/analytics" element={<Analytics />} />

      {/* Default route */}
      <Route path="*" element={<Dashboard />} />
    </Routes>
  );

  return (
    <>
      <AdminNavbar />
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

export default AdminPage;