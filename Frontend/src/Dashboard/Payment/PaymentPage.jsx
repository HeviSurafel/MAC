import React, { useState, useEffect } from "react";
import useAdminStore from "../../Store/AdminStore";
import { toast } from "react-hot-toast";

export default function PaymentPage() {
  const {
    studentPayments,
    courses,
    unpaidStudents,
    fetchUnpaidStudents,
    getCourses,
    makePayment,
  } = useAdminStore();

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedMonths, setSelectedMonths] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchUnpaidStudents(selectedCourseId);
    }
  }, [selectedCourseId]);

  const handlePayNow = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedStudent || !selectedCourseId || selectedMonths.length === 0) {
      toast.error("Please select months and enter an amount.");
      return;
    }

    await makePayment(
      selectedStudent.student._id,
      selectedStudent.courseId,
      parseFloat(amount),
      selectedMonths
    );

    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Unpaid Students</h1>

      {/* Course Selection Dropdown */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Select a Course:</label>
        <select
          className="border p-2 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Unpaid Students Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Paid Months</th>
                <th className="p-3 text-left">Unpaid Months</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidStudents?.length > 0 ? (
                unpaidStudents.map((student, index) => {
                  const paymentDetails = studentPayments[student.student._id]; // Get payment details for the student
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="p-3 text-gray-700">
                        {student.student?.firstName} {student.student?.lastName}
                      </td>
                      <td className="p-3 text-gray-700">{student.student?.email}</td>
                      <td className="p-3 text-gray-700">
                        {paymentDetails?.paidMonths?.join(", ") || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {paymentDetails?.unpaidMonths?.join(", ") || "N/A"}
                      </td>
                      <td className="p-3">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                          onClick={() => handlePayNow(student)}
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-600">
                    No unpaid students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Process Payment</h2>
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="font-semibold text-gray-700">
                {selectedStudent.student?.firstName} {selectedStudent.student?.lastName}
              </p>
              <p className="text-gray-600">{selectedStudent.student?.email}</p>
              <p className="text-gray-600">{selectedStudent.courseName}</p>
            </div>

            {/* Unpaid Months Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Select Unpaid Months:</label>
              {selectedStudent.unpaidMonths?.map((month) => (
                <div key={month} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={month}
                    checked={selectedMonths.includes(month)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMonths([...selectedMonths, month]);
                      } else {
                        setSelectedMonths(selectedMonths.filter((m) => m !== month));
                      }
                    }}
                    className="mr-2"
                  />
                  <span>{month}</span>
                </div>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Amount:</label>
              <input
                type="number"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-500 transition duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                onClick={handlePayment}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}