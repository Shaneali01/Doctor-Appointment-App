import React from 'react'
import Hero from '../../Components/User/Home/Hero'
import Reviews from '../../Components/User/Home/Reviews'
import LogoCarousel from '../../Components/User/Home/LogoCarousel'
import WhyChooseUs from '../../Components/User/Home/WhyChooseUs'
import FindDoctor from '../../Components/User/Home/FindDoctor'
import TeamMembers from '../../Components/User/Home/OurTeam'
import TestimonialSection from '../../Components/User/Home/Testimonial'
import Categories from '../../Components/User/Services/Categories'

const Home = () => {
  return (
    <div className='font-sans'>
        <Hero/>
        <FindDoctor/>
        <Reviews/>
        <WhyChooseUs/>
        <Categories/>
        <TeamMembers/>
        <TestimonialSection/> 
        <LogoCarousel/>
    </div>
  )
}

export default Home
