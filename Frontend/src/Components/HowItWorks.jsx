import React from 'react';

const steps = [
  {
    step: 1,
    title: 'Register as a User',
    description:
      'Users (students, instructors, or administrators) can create their accounts by providing necessary details and verifying their email addresses.',
    icon: '📋', // Placeholder icon for registration
  },
  {
    step: 2,
    title: 'Login to Your Account',
    description:
      'After registration, users can log in to the platform securely using their credentials. Different roles are granted specific permissions.',
    icon: '🔐', // Placeholder icon for login
  },
  {
    step: 3,
    title: 'Enroll in Courses',
    description:
      'Students can browse available courses and enroll in them directly through the platform, making course registration hassle-free.',
    icon: '📚', // Placeholder icon for courses
  },
  {
    step: 4,
    title: 'Manage Courses and Assessments',
    description:
      'Instructors can manage courses, upload materials, and assign assessments. They can also track student progress and provide feedback.',
    icon: '📝', // Placeholder icon for assessments
  },
  {
    step: 5,
    title: 'Generate Certifications',
    description:
      'Once a student successfully completes a course, the system automatically generates a certificate with a QR code for easy verification.',
    icon: '🏅', // Placeholder icon for certification
  },
  {
    step: 6,
    title: 'Admin Control Panel',
    description:
      'Admins have complete control over the system, including user management, course configuration, and platform settings.',
    icon: '🛠️', // Placeholder icon for admin control
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-blue-600 mb-12">How It Works</h2>
        <p className="text-lg text-gray-600 mb-16">
          Our system is designed to streamline the management of educational institutions. Here’s how it works:
        </p>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative bg-gray-50 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl text-blue-600 mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 right-0 transform -translate-x-6 translate-y-[-50%]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
