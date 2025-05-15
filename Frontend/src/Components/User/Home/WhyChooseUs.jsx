import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

export default function WhyChooseUs() {
  const navigate=useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <div  className=" py-12 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div data-aos="fade-left" className="text-left">
          <h2 className="md:text-5xl text-4xl font-semibold text-teal-800 mb-4">
            You have lots of reasons <br /> to choose us
          </h2>
          <p className="text-gray-600 mb-6 font-bold">
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit
            phasellus mollis sit aliquam sit nullam.
          </p>
          <div className="flex gap-4">
            <button onClick={()=>{navigate('/doctors')}} className="bg-teal-700 text-white font-bold py-2 px-7 rounded-full shadow-lg hover:bg-teal-700 transition-all">
              Get started
            </button>
            <button onClick={()=>{navigate("/contact")}} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-all">
              Talk to sales
            </button>
          </div>
        </div>
        <div data-aos="fade-right">
          <img
            src="https://cdn-prod.medicalnewstoday.com/content/images/articles/326/326761/doctor-encouraging-a-patient.jpg"
            alt="Healthcare professionals in surgery"
            className="rounded-2xl shadow-lg object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
