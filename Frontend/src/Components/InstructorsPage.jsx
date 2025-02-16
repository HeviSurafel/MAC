import React from 'react';
import image from "../assets/image01.jpg";
const instructors = [
  {
    name: 'Mikael',
    title: 'Web development Instructor',
    image: image,
    description:
      'Mikael is an expert in advanced mathematics with over 10 years of teaching experience in both high school and college-level courses.',
  },
  {
    name: 'Mikael',
    title: 'Web development Instructor',
    image: image,
    description:
      'Mikael is an expert in advanced mathematics with over 10 years of teaching experience in both high school and college-level courses.',
  },
  {
    name: 'Mikael',
    title: 'Web development Instructor',
    image: image,
    description:
      'Mikael is an expert in advanced mathematics with over 10 years of teaching experience in both high school and college-level courses.',
  },
  {
    name: 'Mikael',
    title: 'Web development Instructor',
    image: image,
    description:
      'Mikael is an expert in advanced mathematics with over 10 years of teaching experience in both high school and college-level courses.',
  },
];

const InstructorsPage = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold text-blue-600 mb-12">Meet Our Instructors</h2>
        <p className="text-lg text-gray-600 mb-16">Our dedicated instructors are experts in their fields and are passionate about teaching. Get to know them below.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {instructors.map((instructor, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-32 h-32 mx-auto rounded-full border-4 border-blue-600 mb-6"
              />
              <h3 className="text-2xl font-semibold text-blue-600 mb-2">{instructor.name}</h3>
              <p className="text-lg text-gray-700 mb-4">{instructor.title}</p>
              <p className="text-gray-600">{instructor.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstructorsPage;