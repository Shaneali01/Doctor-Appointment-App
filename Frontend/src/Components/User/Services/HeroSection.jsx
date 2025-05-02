import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    time: '',
  });

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    // Map department to category if needed (ensure they match DoctorsPage categories)
    const category = formData.department || 'Cardiologist'; // Fallback to Cardiologist
    navigate(`/doctors?category=${encodeURIComponent(category)}`);
  };

  return (
    <section
      data-aos="fade-up"
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1586773860418-d37222d8fce3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9zcGl0YWwlMjBidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D)`,
      }}
    >
      <div className="absolute inset-0 bg-opacity-40"></div>
      <div className="relative mx-auto h-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-8 max-w-7xl mx-auto">
          <div className="lg:px-6 lg:mt-14 lg:ml-52 mt-7 z-10 w-full lg:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl text-[#007E85] sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Meet the Best Hospital
            </h1>
            <p className="text-xl text-white md:text-2xl mb-8">
              We know how large objects will act, but things on a small scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/doctors')} className="bg-[#007E85] cursor-pointer hover:bg-teal-600 font-bold text-white py-3 px-8 rounded-full transition duration-300">
                Get Doctors
              </button>
              <button onClick={() => navigate('/contact')} className="rounded-full cursor-pointer text-white font-bold hover:bg-zinc-600 py-3 px-8 border-[#007E85] border-2 transition duration-300">
                Contact Us
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-96 mt-10 z-10">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h2 className="text-2xl  font-semibold mb-4 text-gray-800">
                Book Appointment
              </h2>
              <form className="space-y-4" onSubmit={handleBookAppointment}>
                
                <select
                  name="department"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-700"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option value="">Select Department</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>

                  {/* Add more categories to match DoctorsPage */}
                </select>
               
                <button
                  type="submit"
                  className="w-full bg-[#007E85] cursor-pointer hover:bg-teal-600 font-bold text-white py-3 px-6 rounded transition duration-300"
                >
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="lg:hidden w-full max-w-md mx-auto mt-12 z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Book Appointment
            </h2>
            <form className="space-y-4" onSubmit={handleBookAppointment}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              <select
                name="department"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007E85] text-gray-700"
                required
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Orthopedic">Orthopedic</option>
                {/* Add more categories to match DoctorsPage */}
              </select>
              <input
                type="time"
                name="time"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#007E85]"
                required
                value={formData.time}
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="w-full bg-[#007E85] hover:bg-teal-600 text-white py-3 px-6 rounded transition duration-300"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;