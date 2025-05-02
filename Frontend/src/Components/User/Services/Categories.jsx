import React, { useEffect } from 'react'
import { services } from '../../../Constants/ConstantData'
import AOS from 'aos';

import 'aos/dist/aos.css';

const Categories = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);
  return (
    <div>
       <section className=" py-20 px-12 mt-[-26px]">
      <div className="text-center mb-12">
        <h2 className="text-5xl mb-6 font-bold text-[#007E85] ">Services we provide</h2>
        <p className="text-gray-700 font-bold max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan.
        </p>
      </div>

      <div  className="grid grid-cols-1 sm:grid-cols-2 mt-20 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <div data-aos="fade-up" key={index} className="bg-transparent shadow-lg rounded-2xl p-6 flex flex-col gap-4">
            <img src={service.image} alt={service.title} className="rounded-lg w-full h-48 object-cover" />
            <h3 className="text-2xl font-bold text-[#007E85]">{service.title}</h3>
            <p className="text-gray-700 font-bold">{service.description}</p>
            <a href={service.link} className="text-teal-700 font-bold hover:underline flex items-center">
              Learn more <span className="ml-2">&rarr;</span>
            </a>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}

export default Categories
