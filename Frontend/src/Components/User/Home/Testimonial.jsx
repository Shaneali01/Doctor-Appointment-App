import React, { useEffect } from 'react';
import { testimonials } from '../../../Constants/ConstantData';
import AOS from 'aos';
import 'aos/dist/aos.css';


const TestimonialSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  },[])
  return (
    <section className=" py-20 px-6 sm:px-16 text-center">
     <div className='pb-4'>
     <h2 className="text-5xl font-bold text-[#007E85] mb-4">Testimonial</h2>
      <p className=" text-gray-700 px-20 font-bold mb-8">
        Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan
        consectetur adipiscing elit semper
        consectetur adipiscing elit semper dalar dalar.
      </p>
     </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8 gap-6">
        {testimonials.map((item, index) => (
          <div  data-aos="fade-right" key={index} className="  p-8 rounded-2xl shadow-md bg-teal-600">
            <img
              src={item.img}
              alt={item.name}
              className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
            />
            <p className="text-xl font-bold text-gray-800">&quot;{item.feedback}&quot;</p>
            <p className="text-white font-bold mt-2">{item.desc}</p>
            <div className="mt-4">
              <h4 className="text-yellow-300 text-xl font-bold">{item.name}</h4>
              <p className="text-white font-bold text-md">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
