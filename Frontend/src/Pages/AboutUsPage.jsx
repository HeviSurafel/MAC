import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const AboutUsPage = () => {
  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen text-white" style={{ backgroundImage: 'url(https://via.placeholder.com/1920x1080)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 animate__animated animate__fadeIn animate__delay-1s">
              Welcome to Our Company
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate__animated animate__fadeIn animate__delay-2s">
              We are passionate about delivering innovative solutions and creating exceptional experiences for our clients.
            </p>
            <button className="bg-indigo-600 px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 hover:bg-indigo-700">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Company Mission */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
          Our mission is to bring innovative and effective solutions to our clients, helping them succeed in their goals while ensuring that we operate with integrity and excellence.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="transform transition duration-300 hover:scale-105 hover:shadow-xl p-6 bg-white rounded-lg shadow-lg">
            <div className="text-indigo-600 text-4xl mb-4">
              <FaCheckCircle />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Innovation</h3>
            <p className="text-gray-600">We believe in the power of innovative ideas to drive growth and change in every industry we touch.</p>
          </div>
          <div className="transform transition duration-300 hover:scale-105 hover:shadow-xl p-6 bg-white rounded-lg shadow-lg">
            <div className="text-teal-600 text-4xl mb-4">
              <FaCheckCircle />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Customer Success</h3>
            <p className="text-gray-600">Our top priority is ensuring that our customers succeed, by providing top-tier service and support tailored to their needs.</p>
          </div>
          <div className="transform transition duration-300 hover:scale-105 hover:shadow-xl p-6 bg-white rounded-lg shadow-lg">
            <div className="text-orange-600 text-4xl mb-4">
              <FaCheckCircle />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Excellence</h3>
            <p className="text-gray-600">We are committed to delivering exceptional results, maintaining high standards of quality and performance.</p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Our Journey</h2>
          <div className="space-y-10">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-1 bg-gray-300 h-full left-1/2 transform -translate-x-1/2"></div>
              <div className="relative z-10 animate__animated animate__fadeIn animate__delay-1s">
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  <div className="text-2xl font-semibold text-indigo-600">2015</div>
                  <div className="flex-1 h-px bg-indigo-600 mx-4"></div>
                  <div className="flex-1 text-gray-700">
                    <p className="font-semibold">Company Founded</p>
                    <p className="text-gray-600">We started our journey with a passion for innovation and customer satisfaction.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  <div className="text-2xl font-semibold text-teal-600">2017</div>
                  <div className="flex-1 h-px bg-teal-600 mx-4"></div>
                  <div className="flex-1 text-gray-700">
                    <p className="font-semibold">First Major Project</p>
                    <p className="text-gray-600">Completed our first large-scale project, exceeding client expectations.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  <div className="text-2xl font-semibold text-orange-600">2020</div>
                  <div className="flex-1 h-px bg-orange-600 mx-4"></div>
                  <div className="flex-1 text-gray-700">
                    <p className="font-semibold">Global Expansion</p>
                    <p className="text-gray-600">Launched our services in three additional countries, scaling operations globally.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Meet Our Team</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white p-6 rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">John Doe</h3>
            <p className="text-gray-600 mb-4">CEO & Founder</p>
            <p className="text-gray-700">John is the visionary behind our company, driving growth and innovation.</p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white p-6 rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Jane Smith</h3>
            <p className="text-gray-600 mb-4">Lead Designer</p>
            <p className="text-gray-700">Jane’s designs create the seamless user experience our clients love.</p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white p-6 rounded-lg shadow-xl transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800">Mark Lee</h3>
            <p className="text-gray-600 mb-4">Lead Developer</p>
            <p className="text-gray-700">Mark ensures that our products are not only functional but exceptional in every way.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-indigo-600 text-white py-20 text-center">
      <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          We're always looking for passionate individuals to join our team. If you're ready to make an impact, let's connect.
        </p>
        <button className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg transition-transform transform hover:scale-105 hover:bg-indigo-700">
          Contact Us
        </button>
      </section>

    </div>
  );
};

export default AboutUsPage;