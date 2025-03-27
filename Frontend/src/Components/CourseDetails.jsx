import React from 'react'
import { useParams } from 'react-router-dom';
import { FaStar, FaClock, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function CourseDetails() {
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
    const courseId = useParams();
    console.log(courseId)
    const course = courses.find((course) => course.id === courseId.id);
 
    if (!course) {
      return <div className="py-20 text-center">Course not found</div>;
    }
  
    return (
      <section className="py-12 bg-white text-gray-900 py-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <Link to="/" className="text-blue-600 hover:underline">← Back to Courses</Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-full">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6">{course.description}</p>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.skills.map((skill, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2 text-green-500">✓</span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Course Details</h2>
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <FaChalkboardTeacher className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <h3 className="font-semibold">Instructor</h3>
                        <p>{course.instructor}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <h3 className="font-semibold">Duration</h3>
                        <p>{course.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaStar className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <h3 className="font-semibold">Rating</h3>
                        <p>{course.rating}/5 ({Math.floor(course.students * 0.9)} reviews)</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FaUserGraduate className="text-blue-600 mr-3 text-xl" />
                      <div>
                        <h3 className="font-semibold">Enrolled Students</h3>
                        <p>{course.students.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
           
            </div>
          </div>
        </div>
      </section>
    );
}

export default CourseDetails
