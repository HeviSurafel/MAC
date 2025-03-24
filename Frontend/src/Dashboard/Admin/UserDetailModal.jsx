import React from 'react';

const UserDetailModal = ({ userDetails, isOpen, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Information */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700"><strong>Name:</strong> {userDetails?.user.name}</p>
            <p className="text-gray-700"><strong>Email:</strong> {userDetails?.user.email}</p>
            <p className="text-gray-700"><strong>Role:</strong> {userDetails?.user.role}</p>
            <p className="text-gray-700"><strong>Status:</strong> {userDetails?.user.status}</p>
          </div>
        </div>

        {/* Course Information */}
        {userDetails?.courses && userDetails.courses.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Enrolled Course(s)</h3>
            {userDetails.courses.map((course) => (
              <div key={course._id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700"><strong>Course Name:</strong> {course.courseName}</p>
                    <p className="text-gray-700"><strong>Course Code:</strong> {course.courseCode}</p>
                    <p className="text-gray-700"><strong>Description:</strong> {course.description}</p>
                    <p className="text-gray-700"><strong>Status:</strong> {course.courseStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-700"><strong>Duration:</strong> {course.durationInMonths} months</p>
                    <p className="text-gray-700"><strong>Start Date:</strong> {new Date(course.startDate).toLocaleDateString()}</p>
                    <p className="text-gray-700"><strong>End Date:</strong> {new Date(course.endDate).toLocaleDateString()}</p>
                    <p className="text-gray-700"><strong>Cost:</strong> ${course.cost}</p>
                    <p className="text-gray-700"><strong>Registration Fee:</strong> ${course.registrationFee}</p>
                    <p className="text-gray-700"><strong>Instructors:</strong> {course.instructors.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;