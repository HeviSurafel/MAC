import React from 'react';

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">Why Choose Us?</h2>
        <p className="text-lg text-gray-600 mb-16">We provide an intuitive and secure school management system that streamlines administrative tasks and enhances student learning. Here’s why you should choose us:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Easy to Use</h3>
            <p className="text-gray-600">
              Our system is designed with simplicity in mind, allowing users to quickly navigate through the platform with minimal training.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Secure & Scalable</h3>
            <p className="text-gray-600">
              We prioritize data security with encryption, SSL protocols, and role-based access control. Plus, our system grows with your institution.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Comprehensive Modules</h3>
            <p className="text-gray-600">
              From student registration to course management and assessments, our platform covers all aspects of school management in one place.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Customizable</h3>
            <p className="text-gray-600">
              Tailor the system to your institution’s unique needs with configurable features and settings, ensuring a perfect fit.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">24/7 Support</h3>
            <p className="text-gray-600">
              Our dedicated support team is available round-the-clock to ensure your institution runs smoothly without any technical hiccups.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Innovative Features</h3>
            <p className="text-gray-600">
              We offer cutting-edge features like QR code-based student certifications and online assessments, helping you stay ahead of the curve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;