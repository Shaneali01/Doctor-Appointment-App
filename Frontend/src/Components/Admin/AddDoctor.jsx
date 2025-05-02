import React, { useState } from "react";
import { specialtyOptions } from "../../Constants/ConstantData";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";

const AddDoctor = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    specialty: "",
    fees: "",
    degree: "",
    experience: "",
    address: "",
    about: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };

      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts
    
    try {
      const response = await axiosInstance.post('doctor/add-doctor', formData);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <>
      
          <div className="p-3 sm:p-4 lg:p-6 bg-white rounded-lg shadow-md border-t- border-teal-500">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 lg:mb-6">
        Add New Doctor
      </h2>

      <div className="flex justify-center mb-4 lg:mb-6">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all duration-300 ${
                step >= num
                  ? "bg-teal-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`h-1 w-6 sm:w-8 lg:w-12 transition-all duration-500 ease-in-out ${
                  step > num ? "bg-[#007e85]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
        {step === 1 && (
          <div className="animate-fade-in">
            <h3 className="text-md sm:text-lg lg:text-xl font-semibold text-gray-700 mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                  placeholder="Dr. John Smith"
                  required
                  disabled={isLoading} // Disable input during loading
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                  placeholder="john.smith@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-3 sm:mt-4">
              <label
                htmlFor="image"
                className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
              >
                Doctor's Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImage}
                accept="image/*"
                className="block w-full text-xs sm:text-sm lg:text-base text-gray-500 file:mr-3 file:py-1 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-all duration-200"
                disabled={isLoading}
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                Upload JPG, PNG, or GIF (max 5MB)
              </p>
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h3 className="text-md sm:text-lg lg:text-xl font-semibold text-gray-700 mb-3">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="specialty"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Specialty
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base bg-white transition-all duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Specialty</option>
                  {specialtyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="fees"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Fees ($)
                </label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                  placeholder="150.00"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="degree"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                  placeholder="MD, MBBS, etc."
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="experience"
                  className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
                >
                  Experience (Years)
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                  placeholder="10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-md sm:text-lg lg:text-xl font-semibold text-gray-700 mb-3">
              Additional Details
            </h3>
            <div>
              <label
                htmlFor="address"
                className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="2"
                className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                placeholder="123 Health St, Medical City"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mt-3 sm:mt-4">
              <label
                htmlFor="about"
                className="block text-xs sm:text-sm lg:text-base font-medium text-gray-700 mb-1"
              >
                About Doctor
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows="3"
                className="block w-full px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-xs sm:text-sm lg:text-base transition-all duration-200"
                placeholder="Brief bio or professional summary"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4 lg:mt-6 gap-3">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1 || isLoading}
            className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-1.5 lg:px-6 lg:py-2 rounded-md font-semibold text-xs sm:text-sm lg:text-base transition-all duration-200 ${
              step === 1 || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            }`}
          >
            Back
          </button>
          {step < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isLoading}
              className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-1.5 lg:px-6 lg:py-2 font-semibold rounded-md shadow-md text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#007E85] text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto px-3 py-1 sm:px-4 sm:py-1.5 lg:px-6 lg:py-2 font-semibold rounded-md shadow-md text-xs sm:text-sm lg:text-base transition-all duration-200 ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center"
                  : "bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Doctor"
              )}
            </button>
          )}
        </div>
      </form>
    </div>

    </>
   
  );
};

export default AddDoctor;