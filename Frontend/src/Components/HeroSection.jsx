import React from 'react';
import TypingEffect from 'react-typing-effect';
import Logo from '../assets/image01.jpg'; // Ensure the path is correct

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-teal-500 text-white py-20">
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Welcome to Makalla Academy
        </h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          <TypingEffect
            text={['Learn from Experts', 'Boost Your Skills', 'Achieve Your Dreams']}
            speed={100}
            eraseSpeed={50}
            eraseDelay={2000}
            typingDelay={1000}
            cursorRenderer={(cursor) => <span>{cursor}</span>} // Adjusted to span element
          />
        </p>

        {/* Discount Banner */}
        <div className="bg-red-500 text-white text-lg font-semibold py-2 px-4 rounded-lg mb-6 inline-block">
          <span>🎉 Limited Time Offer: Get 50% OFF on All Courses! 🎉</span>
        </div>

        <a
          href="#enroll"
          className="bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-yellow-400 transition duration-300"
        >
          Enroll Now
        </a>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${Logo})` }}></div>
    </section>
  );
};

export default HeroSection;
