import React from 'react';
import { FaTools, FaRocket, FaShieldAlt, FaRegClock } from 'react-icons/fa';
import {Link} from "react-router-dom"
import image from "../assets/6K6A3618.JPG"
const ServicePage = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen text-white" style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 animate__animated animate__fadeIn animate__delay-1s">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate__animated animate__fadeIn animate__delay-2s">
              Offering innovative and tailored solutions to meet your unique business needs.
            </p>
            <button className="bg-indigo-600 px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:bg-indigo-700">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-20 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">What We Offer</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="text-indigo-600 text-4xl mb-6">
              <FaTools />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Web Development</h3>
            <p className="text-gray-600">Tailored software solutions designed to meet the unique needs of your business, built with scalability and flexibility in mind.</p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="text-teal-600 text-4xl mb-6">
              <FaRocket />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Social Media Verification</h3>
            <p className="text-gray-600">Boost your online presence with our cutting-edge digital marketing strategies to increase traffic, engagement, and conversions.</p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="text-green-600 text-4xl mb-6">
              <FaShieldAlt />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Acadamy Service</h3>
            <p className="text-gray-600">Protect your business from digital threats with our comprehensive cybersecurity services and proactive threat mitigation.</p>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="text-orange-600 text-4xl mb-6">
              <FaRegClock />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">App Development</h3>
            <p className="text-gray-600">Our expert team is available around the clock to provide you with ongoing support, ensuring your systems are always running smoothly.</p>
          </div>

        </div>
      </section>

      {/* Service Details Section */}
      <section className="py-20 bg-gray-100 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Approach</h2>
        <div className="max-w-4xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Approach 1 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tailored Solutions</h3>
            <p className="text-gray-600">We believe in providing solutions that are customized to meet the specific challenges and goals of your business, ensuring maximum impact.</p>
          </div>

          {/* Approach 2 */}
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Transparent Process</h3>
            <p className="text-gray-600">Our process is open and transparent, keeping you informed at every step of the way. We work closely with you to ensure your vision is realized.</p>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 text-center bg-teal-600 text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg mb-8">Let’s work together to create something amazing for your business. Get in touch today to discuss your project!</p>
        <button className="bg-white text-teal-600 px-8 py-3 rounded-full font-bold text-lg transition-transform transform hover:scale-105 hover:bg-teal-700">
         <Link to={"/contact"} >contact</Link>
        </button>
      </section>

    </div>
  );
};

export default ServicePage;