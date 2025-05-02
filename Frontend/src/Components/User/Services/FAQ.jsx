import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { faqs } from '../../../Constants/ConstantData';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mb-12  min-h-screen mt-7 flex flex-col items-center p-4">
      <h1 className="text-5xl text-[#007E85] font-bold mb-2">FAQ'S</h1>
      <p className="text-gray-700 font-bold text-center mb-8 max-w-md">
        Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
      </p>
      <div className="grid gap-6 grid-cols-1 mt-11 categories sm:grid-cols-2 lg:grid-cols-3 w-full max-w-5xl">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className=" p-7 rounded-lg bg-teal-500 font-bold  hover:shadow-2xl text-gray-700 transition-shadow duration-300 cursor-pointer"
            onClick={() => toggleAnswer(index)}
          >
            <div className="flex   items-center">
            <span className="text-2xl text-[#007E85]">{openIndex === index ? '\u25BC' : <ChevronRight/>}</span>

              <h3 className="font-semibold mt-2 ml-4 text-lg mb-2">{faq.question}</h3>
            </div>
            <p className="text-white font-bold text-sm mt-2">
              {openIndex === index ? faq.answer : `${faq.answer.substring(0, 60)}...`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
