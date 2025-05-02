import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const steps = ["1", "2", "3", "4", "5"];

// List of specialties for the dropdown
const specialties = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "Dermatology",
  "Oncology",
  "Gastroenterology",
  "Psychiatry",
  "Endocrinology",
  "General Practice",
];

const DoctorApplication = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const formData = watch();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToFirstStep = () => {
    setCurrentStep(0);
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("Token");

    if (!token) {
      navigate("/login");
      toast.error("Please log in to apply for a doctor position.");
      return;
    }
    setIsSubmitting(true);
    try {
      let imageBase64 = null;
      if (data.image && data.image.length > 0) {
        const file = data.image[0];
        imageBase64 = await convertImageToBase64(file);
      }

      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        specialty: data.specialty,
        degree: data.degree,
        experience: data.experience,
        fees: data.fees,
        address: data.address,
        about: data.about,
        image: imageBase64,
      };

      const response = await axiosInstance.post("/user/apply", payload);
      toast.success(response.data.message || "Application submitted successfully!");
      setCurrentStep(0);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      toast.error(errorMessage);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div data-aos="zoom-in" className="min-h-screen mt-12 py-8 px-4 sm:px-6 lg:px-8 bg-white  ">
      <style>
        {`
          @keyframes iconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .animate-iconBounce {
            animation: iconBounce 0.5s ease-in-out infinite;
          }
          .input-container {
            position: relative;
          }
          .input-container label {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            color: #6B7280;
            font-size: 0.9rem;
            transition: all 0.2s ease;
            pointer-events: none;
          }
          .input-container input:not(:placeholder-shown) + label,
          .input-container textarea:not(:placeholder-shown) + label,
          .input-container select:not(:placeholder-shown) + label,
          .input-container input:focus + label,
          .input-container textarea:focus + label,
          .input-container select:focus + label {
            top: -10px;
            left: 10px;
            font-size: 0.75rem;
            color: #007E85;
            background: white;
            padding: 0 4px;
          }
          .input-container input,
          .input-container textarea,
          .input-container select {
            transition: all 0.2s ease;
          }
          .input-container input:focus,
          .input-container textarea:focus,
          .input-container select:focus {
            border-color: #007E85;
            box-shadow: 0 0 0 3px rgba(0, 126, 133, 0.1);
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 py-10">
          <h1 className="text-4xl sm:text-5xl  text-[#007E85] font-extrabold tracking-tight">
            Become a Doctor
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mt-3 max-w-3xl mx-auto leading-relaxed">
            Join our esteemed network of healthcare professionals with a seamless application process.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-0">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Doctor with patient"
              className="w-full h-80 md:h-full object-cover"
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-10 bg-gray-50">
            <div className="flex flex-wrap items-center  mb-8 ">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center w-[18%] sm:w-[18%]">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-md ${
                      index <= currentStep ? "bg-[#007E85]" : "bg-gray-200"
                    }`}
                  >
                    {step}
                  </div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className="flex-1 h-1 bg-gray-200"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        background: index < currentStep ? "linear-gradient(to right, #007E85, #00A3AD)" : "#D1D5DB",
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Personal Information
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <input
                          {...register("name", { required: "Full name is required" })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="name"
                        />
                        <label htmlFor="name">Full Name</label>
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address",
                            },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="email"
                        />
                        <label htmlFor="email">Email</label>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                          })}
                          type="password"
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="password"
                        />
                        <label htmlFor="password">Password</label>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 1 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Professional Details
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <select
                          {...register("specialty", { required: "Specialty is required" })}
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="specialty"
                        >
                          <option value="" disabled hidden></option>
                          {specialties.map((specialty) => (
                            <option key={specialty} value={specialty}>
                              {specialty}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="specialty">Specialty</label>
                        {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("degree", { required: "Degree is required" })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="degree"
                        />
                        <label htmlFor="degree">Degree</label>
                        {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 2 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Experience & Fees
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <input
                          {...register("experience", {
                            required: "Experience is required",
                            pattern: { value: /^[0-9]+$/, message: "Please enter a valid number" },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="experience"
                        />
                        <label htmlFor="experience">Years of Experience</label>
                        {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("fees", {
                            required: "Fees are required",
                            pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: "Please enter a valid amount" },
                          })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="fees"
                        />
                        <label htmlFor="fees">Consultation Fees</label>
                        {errors.fees && <p className="text-red-500 text-sm mt-1">{errors.fees.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 3 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Additional Information
                    </h2>
                    <div className="space-y-6">
                      <div className="input-container">
                        <input
                          {...register("address", { required: "Address is required" })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="address"
                        />
                        <label htmlFor="address">Address</label>
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                      </div>
                      <div className="input-container">
                        <textarea
                          {...register("about", { required: "About section is required" })}
                          placeholder=" "
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          rows="4"
                          id="about"
                        />
                        <label htmlFor="about">About</label>
                        {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>}
                      </div>
                      <div className="input-container">
                        <input
                          {...register("image")}
                          type="file"
                          accept="image/*"
                          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none text-gray-700 bg-white"
                          id="image"
                        />
                        <label htmlFor="image">Profile Image</label>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
                {currentStep === 4 && (
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                      Review & Submit
                    </h2>
                    <div className="space-y-4 text-gray-700 bg-gray-100 p-6 rounded-lg">
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Name:</strong> <span>{formData.name || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Email:</strong> <span>{formData.email || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Specialty:</strong> <span>{formData.specialty || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Degree:</strong> <span>{formData.degree || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Experience:</strong> <span>{formData.experience || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Fees:</strong> <span>{formData.fees || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Address:</strong> <span>{formData.address || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">About:</strong> <span>{formData.about || "Not provided"}</span></p>
                      <p className="flex gap-2"><strong className="text-[#007E85] w-24">Image:</strong> <span>{formData.image?.[0]?.name || "Not provided"}</span></p>
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition-all w-full sm:w-auto shadow-md"
                  >
                    Previous
                  </button>
                )}
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 cursor-pointer bg-gradient-to-r from-[#007E85] to-[#00A3AD] text-white font-semibold rounded-full hover:from-[#006668] hover:to-[#008A93] transition-all w-full sm:w-auto sm:ml-auto shadow-md"
                  >
                    Next
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-8 py-3 bg-gradient-to-r from-[#007E85] to-[#00A3AD] text-white font-semibold rounded-full hover:from-[#006668] hover:to-[#008A93] transition-all flex items-center justify-center w-full sm:w-auto shadow-md ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-iconBounce mr-2" size={20} />
                          Submitting...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={goToFirstStep}
                      className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full hover:from-gray-600 hover:to-gray-700 transition-all w-full sm:w-auto shadow-md"
                    >
                      Go Back to First Step
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorApplication;