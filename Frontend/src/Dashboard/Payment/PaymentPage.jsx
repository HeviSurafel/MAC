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
    resetUnpaidStudents,
  } = useAdminStore();

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState(""); // State for selected batch
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [amount, setAmount] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [batches, setBatches] = useState([]); // State for batches

  useEffect(() => {
    getCourses();

    // Cleanup function to reset state when the component unmounts
    return () => {
      resetUnpaidStudents();
    };
  }, [getCourses, resetUnpaidStudents]);

  // Fetch batches when a course is selected
  useEffect(() => {
    if (selectedCourseId) {
      const selectedCourse = courses.find((course) => course._id === selectedCourseId);
      if (selectedCourse) {
        setBatches(selectedCourse.batches || []); // Set batches for the selected course
      }
    } else {
      setBatches([]); // Clear batches if no course is selected
    }
  }, [selectedCourseId, courses]);

  // Fetch unpaid students when a course or batch is selected
  useEffect(() => {
    if (selectedCourseId && selectedBatchId) {
      fetchUnpaidStudents(selectedCourseId, selectedBatchId,batches); // Pass batch ID to fetchUnpaidStudents
    }
  }, [selectedCourseId, selectedBatchId, fetchUnpaidStudents]);

  const handlePayNow = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handlePayment = async () => {
    if (!selectedStudent || !selectedCourseId) {
      toast.error("Please select a student and course.");
      return;
    }

    if (selectedMonths.length === 0) {
      toast.error("Please select at least one month.");
      return;
    }

    const totalAmount = unpaidStudents.find(
      (student) => student.student._id === selectedStudent.student._id
    )?.monthlyPayment;
    setAmount(totalAmount);

    await makePayment(
      selectedStudent.student._id,
      selectedStudent.courseId,
      totalAmount,
      selectedMonths,selectedBatchId
    );

    setIsModalOpen(false);
    setSelectedMonths([]);
    fetchUnpaidStudents(selectedCourseId, selectedBatchId); // Refresh the unpaid students list
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Unpaid Students</h1>

      {/* Course Selection Dropdown */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Select a Course:
        </label>
        <select
          className="border p-2 mb-4 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={selectedCourseId}
          onChange={(e) => {
            setSelectedCourseId(e.target.value);
            setSelectedBatchId(""); // Reset batch selection when course changes
          }}
        >
          <option value="">-- Select a Course --</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>

        {/* Batch Selection Dropdown */}
        {selectedCourseId && (
          <div className="mt-4">
            <label className="block mb-2 font-semibold text-gray-700">
              Select a Batch:
            </label>
            <select
              className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              <option value="">-- Select a Batch --</option>
              {batches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
        )}
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
                <th className="p-3 text-left">Monthly Payment</th>
                <th className="p-3 text-left">Discount Type</th>
                <th className="p-3 text-left">Registration Fee</th>
                <th className="p-3 text-left">Total Paid</th>
                <th className="p-3 text-left">Unpaid Months</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {unpaidStudents?.length > 0 ? (
                unpaidStudents.map((student, index) => {
                  const paymentDetails = studentPayments[student.student._id];
                  const isPaymentComplete = student.unpaidMonths.length === 0;

                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition duration-200"
                    >
                      <td className="p-3 text-gray-700">
                        {student.student?.firstName} {student.student?.lastName}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.student?.email}
                      </td>
                      <td className="p-3 text-gray-700">
                        {paymentDetails?.paidMonths?.join(", ") || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student?.monthlyPayment}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.discountType}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.registrationFee}
                      </td>
                      <td className="p-3 text-gray-700">
                        {student.totalAmountPaid}
                      </td>
                      <td className="p-3 text-gray-700">
                        {isPaymentComplete
                          ? "No unpaid months"
                          : student.unpaidMonths.join(", ")}
                      </td>
                      <td className="p-3">
                        {isPaymentComplete ? (
                          <span className="text-green-600 font-semibold">
                            Payment Complete
                          </span>
                        ) : (
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                            onClick={() => handlePayNow(student)}
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="text-center p-4 text-gray-600">
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
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Process Payment
            </h2>
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="font-semibold text-gray-700">
                {selectedStudent.student?.firstName}{" "}
                {selectedStudent.student?.lastName}
              </p>
              <p className="text-gray-600">{selectedStudent.student?.email}</p>
              <p className="text-gray-600">{selectedStudent.courseName}</p>
            </div>

            {/* Unpaid Months Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-gray-700">
                Select Unpaid Months:
              </label>
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
                        setSelectedMonths(
                          selectedMonths.filter((m) => m !== month)
                        );
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
              <label className="block mb-2 font-semibold text-gray-700">
                Amount:
              </label>
              <input
                type="number"
                className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                value={selectedStudent?.monthlyPayment}
                readOnly
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