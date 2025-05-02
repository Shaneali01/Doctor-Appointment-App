import React, { useEffect } from "react";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import { stats } from "../../../Constants/ConstantData";

const Reviews = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);


  return (
    <section
      data-aos="fade-up"
      className="py-16 px-6 md:px-12 lg:px-6 text-gray-80"
    >
      <h2 className="text-3xl lg:text-5xl font-semibold text-center text-teal-700 mb-10">
        Our results in numbers
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-5xl font-bold text-teal-700">
              <CountUp start={0} end={stat.number} duration={4} />
              {stat.unit}
            </h3>
            <p className="text-gray-600 text-lg">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;