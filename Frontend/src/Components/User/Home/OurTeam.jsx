import React, { useEffect } from 'react';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { members } from '../../../Constants/ConstantData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TeamMembers = () => {
  const iconMap = {
    facebook: <Facebook className="w-5 h-5 text-blue-600" />,
    twitter: <Twitter className="w-5 h-5 text-blue-400" />,
    linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
    instagram: <Instagram className="w-5 h-5 text-orange-400" />,
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
  }, []);

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8  w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-teal-700 text-center mb-4">
          Meet Our Team Members
        </h2>
        <p
          data-aos="fade-right"
          className="text-center mb-8 text-gray-700 font-bold max-w-2xl mx-auto"
        >
          Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar
          elementum tempus hac tellus libero accumsan.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {members.map((member, index) => (
            <div
              data-aos="fade-left"
              data-aos-delay={index * 100}
              key={index}
              className="bg-transparent p-6 rounded-2xl shadow-md text-center max-w-full"
            >
              <img
                src={member.img}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-2xl font-bold text-teal-600">{member.name}</h3>
              <p className="text-gray-700 font-bold">{member.role}</p>
              <p className="text-gray-700 font-bold mt-2">{member.desc}</p>
              <div className="flex justify-center space-x-4 mt-4">
                {member.socials.map((social, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    {iconMap[social.toLowerCase()] || social.charAt(0).toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;