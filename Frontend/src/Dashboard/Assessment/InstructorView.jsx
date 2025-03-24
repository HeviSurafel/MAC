import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import mongoose from "mongoose";

const sections = ["A", "B", "C", "D", "E", "F", "G"];

const InstructorView = ({
  user,
  courses,
  selectedCourse,
  selectedBatch,
  setSelectedBatch,
  setSelectedCourse,
  selectedSection,
  setSelectedSection,
  fetchCourseStudents,
  editedAssessments,
  setEditedAssessments,
  updateAllAssessments,
  markCourseAsCompleted,
  generateCertificates,
}) => {
  const [courseStudents, setCourseStudents] = useState([]);
  const [courseStatus, setCourseStatus] = useState("");

  // Find the selected course's status
  const selectedCourseDetails = courses.find(
    (course) =>
      course.courseId === selectedCourse && course.section === selectedSection
  );

  // Derive selectedBatches from courses
  const selectedBatches = courses
    .filter(
      (course) =>
        course.courseId === selectedCourse &&
        course.section === selectedSection &&
        course.batchId // Only include courses with a valid batchId
    )
    .map((course) => ({
      _id: course.batchId,
      name: course.batchName,
    }));

  // Update course status when selectedCourseDetails changes
  useEffect(() => {
    if (selectedCourseDetails) {
      setCourseStatus(selectedCourseDetails.courseStatus);
    }
  }, [selectedCourseDetails]);

  // Fetch students when selectedCourse, selectedSection, or selectedBatch changes
  useEffect(() => {
    if (selectedCourse && selectedSection && selectedBatch) {
      console.log("Selected Batch:", selectedBatch); // Log the selected batch
      if (!mongoose.Types.ObjectId.isValid(selectedBatch)) {
        console.error("Invalid batch ID:", selectedBatch);
        toast.error("Invalid batch selected. Please try again.");
        return;
      }
      fetchCourseStudents(selectedCourse, selectedSection, selectedBatch)
        .then((students) => {
          console.log("Fetched students:", students);
          setCourseStudents(students || []);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          toast.error("Failed to fetch students. Please try again.");
        });
    }
  }, [selectedCourse, selectedSection, selectedBatch]);

  // Handle changes to assignment or exam scores
  const handleAssessmentChange = (studentId, key, value) => {
    const numericValue = Number(value);

    // Ensure the score is not more than 50
    if (numericValue > 50) {
      toast.error("Score should not be more than 50.");
      return; // Prevent updating if the value exceeds 50
    }

    setEditedAssessments((prev) => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [key]: numericValue,
        },
      };

      // Calculate final score as the sum of assignmentScore and examScore
      updated[studentId].finalScore =
        (updated[studentId].assignmentScore ?? 0) +
        (updated[studentId].examScore ?? 0);

      return updated;
    });
  };

  // Save all assessments
  const saveAllAssessments = async () => {
    if (!selectedCourse || !selectedSection || !selectedBatch) {
      toast.error("Please select a course, batch, and section.");
      return;
    }

    const assessments = courseStudents.map((student) => {
      const editedData = editedAssessments[student._id] || {};
      const assignmentScore =
        editedData.assignmentScore ?? student.assignmentScore ?? 0;
      const examScore = editedData.examScore ?? student.examScore ?? 0;

      return {
        studentId: student._id,
        assignmentScore,
        examScore,
        finalScore: assignmentScore + examScore,
      };
    });

    await updateAllAssessments(assessments, selectedCourse, selectedSection);
    setEditedAssessments({});
    fetchCourseStudents(selectedCourse, selectedSection, selectedBatch).then(
      setCourseStudents
    );
  };

  // Submit all certificates
  const submitAllCertificates = async () => {
    if (!selectedCourse || !selectedSection) {
      toast.error("Please select a course and section.");
      return;
    }

    const eligibleStudents = courseStudents.filter((student) => {
      const finalScore =
        editedAssessments[student._id]?.finalScore ?? student.finalScore ?? 0;
      return finalScore > 50; // Only students with a final score above 50 qualify
    });
    console.log("Eligible students:", eligibleStudents);

    if (eligibleStudents.length === 0) {
      toast.error("No students qualify for a certificate.");
      return;
    }

    // Mark the course as completed
    await markCourseAsCompleted(selectedCourse, selectedSection);

    // Generate certificates
    await generateCertificates(selectedCourse, selectedSection, eligibleStudents);

    // Immediately disable inputs and buttons by updating the course status
    setCourseStatus("completed");
  };

  // Check if the course is editable
  const isEditable =
    courses?.find(
      (course) =>
        course.courseId === selectedCourse && course.section === selectedSection
    )?.courseStatus === "incomplete";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">
        Instructor: {user?.name}
      </h1>

      {/* Course & Section Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedBatch(""); // Reset selected batch when course changes
            }}
            className="w-full p-3 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select a course</option>
            {courses?.map(({ courseId, courseName }) => (
              <option key={courseId} value={courseId}>
                {courseName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setSelectedBatch(""); // Reset selected batch when section changes
            }}
            className="w-full p-3 border rounded-lg focus:ring-blue-500"
          >
            <option value="">Select a section</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Batch
          </label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select a batch</option>
            {selectedBatches.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      {selectedCourse && selectedSection && selectedBatch && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-lg font-semibold mb-4">Student List</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-3">First Name</th>
                <th className="border p-3">Last Name</th>
                <th className="border p-3">Assignment Score</th>
                <th className="border p-3">Exam Score</th>
                <th className="border p-3">Final Score</th>
              </tr>
            </thead>
            <tbody>
              {courseStudents.length > 0 ? (
                courseStudents.map((student) => {
                  const assignmentScore =
                    editedAssessments[student._id]?.assignmentScore ??
                    student.assignmentScore ??
                    0;
                  const examScore =
                    editedAssessments[student._id]?.examScore ??
                    student.examScore ??
                    0;
                  const finalScore = assignmentScore + examScore;

                  return (
                    <tr key={student._id} className="text-center">
                      <td className="border p-3">{student.firstName}</td>
                      <td className="border p-3">{student.lastName}</td>
                      <td className="border p-3">
                        <input
                          type="number"
                          value={assignmentScore}
                          onChange={(e) =>
                            handleAssessmentChange(
                              student._id,
                              "assignmentScore",
                              e.target.value
                            )
                          }
                          className="w-full border rounded p-2"
                          disabled={!isEditable} // Disable if course is completed
                        />
                      </td>
                      <td className="border p-3">
                        <input
                          type="number"
                          value={examScore}
                          onChange={(e) =>
                            handleAssessmentChange(
                              student._id,
                              "examScore",
                              e.target.value
                            )
                          }
                          className="w-full border rounded p-2"
                          disabled={!isEditable} // Disable if course is completed
                        />
                      </td>
                      <td className="border p-3 font-bold">{finalScore}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border p-3 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Buttons for Update and Generate Certificates */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={saveAllAssessments}
              className={`px-4 py-2 rounded-md transition duration-200 ${
                isEditable
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEditable} // Disable if course is completed
            >
              Update Assessments
            </button>
            <button
              onClick={submitAllCertificates}
              className={`px-4 py-2 rounded-md transition duration-200 ${
                isEditable
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isEditable} // Disable if course is completed
            >
              Generate Certificates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorView;