import React from 'react';
import HeroSection from "../../Components/User/Services/HeroSection";
import FindDoctor from '../../Components/User/Home/FindDoctor'
import Reviews from '../../Components/User/Services/Reviews';
import Categories from '../../Components/User/Services/Categories';
import FAQ from '../../Components/User/Services/FAQ';




const ServicesSection = () => {
  return (
    <>
     <HeroSection/>
     <FindDoctor/>
   <Categories/>
    <Reviews/>
    <FAQ/>
    </>
   
  );
};

export default ServicesSection;
