import React from "react";

const Reviews = () => {
  return (
    <section className="py-20 px-4 sm:px-8 md:px-16 mt-[-70px]">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-5xl md:text-4xl font-bold text-[#007E85] mb-2">
          what our customers say
        </h2>
        <p className="text-gray-700 font-bold mt-10 max-w-2xl mx-auto">
          Problems trying to resolve the conflict between the two major realms
          of Classical physics: Newtonian mechanics and which is the main thing
          to occur
        </p>
      </div>

      <div className="grid grid-cols-1 mt-20 lg:px-11  sm:grid-cols-2 md:grid-cols-3 gap-6  sm:px-8 md:px-0">
        <div className="bg-teal-500 font-bold p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <span className="text-yellow-300 font-bold text-xl">★★★★★</span>
          </div>
          <p className="text-gray-700 mb-4">
            Slate helps you see how many more days you need to work to reach
            your financial goal.
          </p>
          <div className="flex items-center">
            <img
              src="../../../assets/DoctorImages/doctor1.jpg"
              alt="User"
              className="rounded-full w-12 h-12 mr-4 object-cover"
            />
          </div>
        </div>

        <div className="bg-teal-500 font-bold p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <span className="text-yellow-300 font-bold text-xl">★★★★★</span>
          </div>
          <p className="text-gray-700 mb-4">
            Slate helps you see how many more days you need to work to reach
            your financial goal.
          </p>
          <div className="flex items-center">
            <img
              src="../../../assets/DoctorImages/doctor2.jpg"
              alt="User"
              className="rounded-full w-12 h-12 mr-4 object-cover"
            />
          </div>
        </div>

        <div className="bg-teal-500 font-bold p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <span className="text-yellow-300 font-bold text-xl">★★★★★</span>
          </div>
          <p className="text-gray-700 mb-4">
            Slate helps you see how many more days you need to work to reach
            your financial goal.
          </p>
          <div className="flex items-center">
            <img
              src="../../../assets/DoctorImages/doctor3.jpg"
              alt="User"
              className="rounded-full w-12 h-12 mr-4 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
