import React from 'react';
import { TypeAnimation } from 'react-type-animation'; // Updated library
import Logo from '../assets/image01.jpg'; // Ensure the path is correct

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-30 h-[500px]">
      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Heading */}
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Welcome to Makalla Academy
        </h1>

        {/* Typing Effect */}
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          <TypeAnimation
            sequence={[
              'Learn from Experts', // Text 1
              1000, // Delay after Text 1
              'Boost Your Skills', // Text 2
              1000, // Delay after Text 2
              'Achieve Your Dreams', // Text 3
              1000, // Delay after Text 3
            ]}
            speed={50} // Typing speed
            repeat={Infinity} // Loop infinitely
            style={{ fontSize: '1.5rem', display: 'inline-block' }} // Optional styling
          />
        </p>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-red-500 text-white text-lg font-semibold py-2 px-4 rounded-lg">
            <span>🎉 Limited Time Offer: Get 50% OFF on All Courses! 🎉</span>
          </div>
          <a
            href="#enroll"
            className="bg-yellow-500 text-gray-900 font-semibold py-3 px-6 my-5  rounded-full shadow-lg hover:bg-yellow-400 transition duration-300"
          >
            Enroll Now
          </a>
        </div>
      </div>

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${Logo})` }}
      ></div>
    </section>
  );
};

export default HeroSection;