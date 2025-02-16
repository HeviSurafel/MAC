import React from 'react'
import { FaStar } from 'react-icons/fa'

function Features() {
  return (
    <section id="features" className="py-20 bg-white text-gray-900 -z-10">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="flex items-center mb-12">
        <div className="flex-grow border-t border-gray-400"></div>
        <h2 className="text-3xl font-semibold mx-4">Courses Offered</h2>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
          <h3 className="text-2xl font-semibold mb-4">Graphics Course</h3>
          <p>Comprehensive lessons on graphic design, image editing, and visual creativity.</p>
          <div className="mt-2 flex justify-center items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
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
          <h3 className="text-2xl font-semibold mb-4">Computer Maintenance</h3>
          <p>Understand hardware components, troubleshooting, and maintenance practices.</p>
          <div className="mt-2 flex justify-center items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <p className="mt-1">Enrolled: 1100 students</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Features
