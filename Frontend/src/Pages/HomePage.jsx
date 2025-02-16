import React from 'react'
import HeroSection from '../Components/HeroSection'
import Features from '../Components/Features'
import Carousel from '../Components/Carousel'
import WhyChooseUs from "../Components/WhyChooseUs"
import InstructorsPage from '../Components/InstructorsPage'
import HowItWorks from '../Components/HowItWorks'
function HomePage() {
  return (
    <div>
      <HeroSection />
      <Features />
      <HowItWorks />
      <WhyChooseUs/>
      <InstructorsPage />
      <Carousel />
    </div>
  )
}

export default HomePage
