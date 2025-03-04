import React from 'react';
import { FaStar } from 'react-icons/fa';

function Features() {
  return (
    <section id="features" className="py-20 bg-white text-gray-900 -z-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center mb-12">
          <div className="flex-grow border-t border-gray-400"></div>
          <h2 className="text-3xl font-semibold mx-4">Courses Offered</h2>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          Explore our expertly curated courses designed to enhance your skills and creativity. From development to design, we offer hands-on learning experiences for all levels.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">Graphics Design</h3>
            <p>Master visual design principles, branding, and creative software tools.</p>
            <div className="mt-2 flex justify-center items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 5 ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="mt-1">Enrolled: 1200 students</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">Web Development</h3>
            <p>Learn to build responsive and modern websites using the latest technologies.</p>
            <div className="mt-2 flex justify-center items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 5 ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="mt-1">Enrolled: 1500 students</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">App Development</h3>
            <p>Master mobile and desktop application development across platforms.</p>
            <div className="mt-2 flex justify-center items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="mt-1">Enrolled: 1300 students</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">Video Editing</h3>
            <p>Learn professional video production, editing techniques, and storytelling.</p>
            <div className="mt-2 flex justify-center items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 5 ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="mt-1">Enrolled: 1250 students</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
            <h3 className="text-2xl font-semibold mb-4">Basic Computer Skills</h3>
            <p>Gain essential computer literacy, including typing, internet usage, and office applications.</p>
            <div className="mt-2 flex justify-center items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
              ))}
            </div>
            <p className="mt-1">Enrolled: 1400 students</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
