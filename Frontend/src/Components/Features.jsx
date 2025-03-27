import React from 'react';
import { FaStar, FaClock, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Course data that can be shared between components
const courses = [
  {
    id: 'graphics-design',
    title: 'Graphics Design',
    description: 'Master visual design principles, branding, and creative software tools like Photoshop, Illustrator, and InDesign. Create stunning visuals for web and print.',
    instructor: 'Ake',
    duration: '11 Weeks',
    skills: ['Branding', 'Typography', 'Digital Illustration', 'Layouts', 'Color Theory'],
    rating: 5,
    students: 1200,
    color: 'bg-blue-600'
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Learn to build responsive and modern websites using HTML, CSS, JavaScript, and backend technologies like Node.js and MongoDB. Become a full stack developer.',
    instructor: 'Mikiyas Tesfaye',
    duration: '11 Weeks',
    skills: ['HTML/CSS/JavaScript', 'Node.js/Express', 'MongoDB/SQL', 'Deployment'],
    rating: 5,
    students: 1500,
    color: 'bg-blue-600'
  },
  {
    id: 'app-development',
    title: 'Mobile App Development',
    description: 'Master mobile and desktop application development across platforms using Flutter, React Native, and other modern frameworks.',
    instructor: 'Eshetu',
    duration: '11 Weeks',
    skills: ['Flutter', 'React Native', 'App UI/UX Design', 'API Integration'],
    rating: 4,
    students: 1300,
    color: 'bg-blue-600'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'Learn professional video production, editing techniques, and storytelling with industry-standard software like Adobe Premiere and Final Cut Pro.',
    instructor: 'Eyerusalem',
    duration: '11 Weeks',
    skills: ['Editing Techniques', 'Motion Graphics', 'Color Grading', 'Audio Editing'],
    rating: 5,
    students: 1250,
    color: 'bg-blue-600'
  },
  {
    id: 'computer-skills',
    title: 'Basic Computer Skills',
    description: 'Gain essential computer literacy, including typing, internet usage, and mastering office applications like Microsoft Word and Excel.',
    instructor: 'Minte',
    duration: '11 Weeks',
    skills: ['Typing', 'Internet Navigation', 'Microsoft Office', 'Basic Troubleshooting'],
    rating: 4,
    students: 1400,
    color: 'bg-blue-600'
  }
];

// Course Card Component
const CourseCard = ({ course }) => {
  console.log(course);
  return (
    <Link to={`/course/${course.id}`} className="transform hover:scale-105 transition-transform duration-300">
      <div className={`${course.color} p-6 rounded-xl shadow-lg text-white h-full flex flex-col`}>
        <h3 className="text-2xl font-semibold mb-4">{course.title}</h3>
        <p className="mb-4 flex-grow">{course.description}</p>
        <div className="mt-auto">
          <p className="flex items-center mb-1">
            <FaChalkboardTeacher className="mr-2" /> <strong>Instructor:</strong> {course.instructor}
          </p>
          <p className="flex items-center mb-1">
            <FaClock className="mr-2" /> <strong>Duration:</strong> {course.duration}
          </p>
          <div className="mt-2 flex justify-center items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < course.rating ? 'text-yellow-400' : 'text-gray-300'} />
            ))}
          </div>
          <p className="flex items-center justify-center mt-1">
            <FaUserGraduate className="mr-2" /> {course.students.toLocaleString()} students
          </p>
        </div>
      </div>
    </Link>
  );
};

// Features Component (Course Listing)
function Features() {
  return (
    <section id="features" className="py-20 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center mb-12">
          <div className="flex-grow border-t border-gray-400"></div>
          <h2 className="text-3xl font-semibold mx-4">Courses Offered</h2>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          Explore our expertly curated courses designed to enhance your skills and creativity. From development to design, we offer hands-on learning experiences for all levels.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Course Details Component


export default Features