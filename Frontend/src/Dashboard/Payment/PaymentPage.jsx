import React, { useState, useEffect } from "react";
import useAdminStore from "../../Store/AdminStore";

export default function PaymentPage() {
  const { courses, unpaidStudents,makePayment, fetchUnpaidStudents, getCourses } =
    useAdminStore();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [paymentType, setPaymentType] = useState("monthly");
  const [validMonths, setValidMonths] = useState([]);

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchUnpaidStudents(selectedCourseId);
    }
  }, [selectedCourseId]);

  const generateValidMonths = (startDate) => {
    const start = new Date(startDate);
    let months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(start);
      date.setMonth(start.getMonth() + i);
      months.push(date.toLocaleString("default", { month: "short" }));
    }
    setValidMonths(months);
  };

  const handlePayNow = (student) => {
    setSelectedStudent(student);
    if (student.startDate) {
      generateValidMonths(student.startDate);
    }
    setIsModalOpen(true); // Open modal first
  };
  
  const handlePayment = async () => {
    await makePayment(
      selectedStudent.student._id, // ✅ Use selected student
  selectedStudent.courseId, // ✅ Use selected student
      parseFloat(amount),
      paymentType,
      selectedMonths
    );
  
    setIsModalOpen(false); // Close modal after payment
  };
  console.log(unpaidStudents)
  
  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Unpaid Students</h1>

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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Registration Fee</th>
                <th className="p-3 text-left">Paid Months</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidStudents.unpaidStudents?.length > 0 ? (
                unpaidStudents.unpaidStudents.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="p-3 text-gray-700">
                      {item.student?.firstName} {item.student?.lastName}
                    </td>
                    <td className="p-3 text-gray-700">{item.student?.email}</td>
                    <td className="p-3 text-gray-700">{item.courseName || "N/A"}</td>
                    <td className="p-3 text-gray-700">{item.section || "N/A"}</td>
                    <td className="p-3 text-gray-700">
                      {item.student?.registrationFee || "0"} birr
                    </td>
                    <td className="p-3 text-gray-700">
                      {validMonths.join(", ")}
                    </td>
                    <td className="p-3">
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={() => handlePayNow(item)}
                      >
                        Pay Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-600">
                    No unpaid students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Select Months:</label>
              <select
                multiple
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={selectedMonths}
                onChange={(e) =>
                  setSelectedMonths(Array.from(e.target.selectedOptions, (option) => option.value))
                }
              >
                {validMonths.map((month, index) => (
                  <option key={index} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Amount:</label>
              <input
                type="number"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">Payment Type:</label>
              <select
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
              >
                <option value="monthly">Monthly</option>
              </select>
            </div>

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