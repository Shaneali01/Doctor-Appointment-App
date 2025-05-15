import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { PhoneCall, Play } from 'lucide-react';
import doctorAnimation from '../../../../public/assets/Animation - 1742210070922.json';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  const HandleClick=()=>{
    const token=localStorage.getItem("Token");
    if(!token){
      navigate("/login");
    }
    else{
      navigate("/booked-appointments");
    }
  }


  return (
    <section
      className="relative py-16  md:px-12 lg:pl-20 font-sans flex flex-col md:flex-row items-center justify-between min-h-screen w-full overflow-hidden"
    >
      {/* Wave Background */}
      <div
        className="absolute inset-0 bg-teal-100 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23007E85' fill-opacity='1' d='M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Left Side - Text Content */}
      <div data-aos="fade-left" style={{ fontFamily: 'lato' }} className=" space-y-6 font-semi-bold text-center md:text-left relative z-10">
        <h1 className="text-3xl font-bold text-gray-700 mt-6 lg:text-5xl  leading-tight">
          Providing Quality <span className="text-[#007E85]">Healthcare</span> For A
          <br />
          <span className="text-[#6EAB36]">Brighter</span> And <span className="text-[#6EAB36]">Healthy</span> Future
        </h1>
        <p className="text-lg  lg:text-xl text-gray-800">
          At our hospital, we are dedicated to providing exceptional medical care to our patients and their families.
          Our experienced team of medical professionals, cutting-edge technology, and compassionate approach make us a
          leader in the healthcare industry.
        </p>
        <div className="flex gap-4 justify-center md:justify-start mt-4">
          <button 
            onClick={HandleClick}
            className="bg-[#007E85] cursor-pointer text-white px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-teal-600 transition duration-300 flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5" /> Appointments
          </button>
          <button onClick={()=>window.location.href="https://youtu.be/-TnwFvHUIp8"}  className="bg-white border-2 cursor-pointer border-gray-300 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition duration-300 flex items-center gap-2">
            <Play className="w-5 h-5" /> Watch Video
          </button>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div data-aos="fade-right" className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative z-10">
        <div className="bg-[#007E85] rounded-full p-4 w-[350px] h-[350px] md:w-[400px] md:h-[400px] overflow-hidden">
          <Lottie animationData={doctorAnimation} className="w-full h-full" />
        </div>

        {/* 24/7 Service Badge */}
        <div className="absolute top-9 right-9 p-2 text-center">
          <img src="../../../assets/SocialMedia/Rectangle 6.png" className="absolute" alt="" />
          <img src="../../../assets/SocialMedia/Group 7.png" className="relative mt-2.5 ml-2.5" alt="" />
        </div>

        {/* Professionals Badge */}
        <div className="absolute bottom-4 left-4 p-2 rounded-full flex items-center gap-2">
          <img src="../../../assets/SocialMedia/Group 8.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Hero;