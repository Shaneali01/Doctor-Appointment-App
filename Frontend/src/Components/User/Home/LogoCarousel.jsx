import React, { useState } from 'react';
import { logos } from '../../../Constants/ConstantData';

const LogoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < logos.length - visibleCount) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Heading */}
      <h2 className="text-5xl font-semibold text-gray-700 text-center mb-6">
        Our <span className="text-[#007E85]">Trusted</span> Partners
      </h2>
      <div className="relative flex mt-28 items-center justify-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`absolute left-0 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none ${
            currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="overflow-hidden w-[800px]">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentIndex * (100 / visibleCount)}%)` }}
          >
            {logos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-[200px] flex justify-center">
                <img src={logo} alt={`Logo ${index + 1}`} className="h-20 object-contain" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex >= logos.length - visibleCount}
          className={`absolute right-0 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none ${
            currentIndex >= logos.length - visibleCount ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LogoCarousel;