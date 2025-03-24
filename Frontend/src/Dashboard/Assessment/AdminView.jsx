import React, { useEffect, useState } from "react";

const AdminView = ({
  user,
  courses: adminCourses,
  getFilteredStudent,
  selectedCourse,
  setSelectedCourse,
  selectedSection,
  setSelectedSection,
  selectedBatch,
  setSelectedBatch,
  resetCertificatesAndCourseStatus,
  resetGradeAndRegenerateCertificate,
}) => {
  const [loading, setLoading] = useState(false);
  const [studentScores, setStudentScores] = useState({});
  const [editable, setEditable] = useState(false);
  const [error, setError] = useState("");
  const [studentFiltered, setStudentFiltered] = useState([]); // Add state to store filtered students

  useEffect(() => {
    const fetchFilteredStudents = async () => {
      if (selectedCourse && selectedSection && selectedBatch) {
        setLoading(true);
        try {
          const filteredCourses = await getFilteredStudent(
            selectedCourse,
            selectedSection,
            selectedBatch
          );

          // Debugging: log the filtered courses to inspect the format
          console.log("Filtered courses response:", filteredCourses);

          // Check if filteredCourses is an array and contains at least one course
          if (Array.isArray(filteredCourses) && filteredCourses.length > 0) {
            const course = filteredCourses[0]; // Assuming we are getting one course

            // Check if the course has a 'studentsEnrolled' array
            if (
              course?.studentsEnrolled &&
              Array.isArray(course.studentsEnrolled)
            ) {
              const students = course.studentsEnrolled; // Extract students array
              setStudentFiltered(students);

              // Initialize student scores with default values
              const initialScores = {};
              students.forEach((student) => {
                initialScores[student._id] = {
                  assignmentScore: student.assignmentScore ?? 0,
                  examScore: student.examScore ?? 0,
                  finalScore: student.finalScore ?? 0,
                };
              });
              setStudentScores(initialScores);
            } else {
              setError("No students found for this course.");
              console.error("Error: No students found for the course", course);
            }
          } else {
            setError("Invalid response format or no courses found.");
            console.error("Error: Invalid response format or no courses found");
          }
        } catch (err) {
          setError("Error fetching filtered students: " + err.message);
          console.error("Error fetching filtered students:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilteredStudents();
  }, [selectedCourse, selectedSection, selectedBatch, getFilteredStudent]);

  const handleScoreChange = (studentId, field, value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      alert("Score must be a number.");
      return;
    }
    if (numericValue < 0 || numericValue > 50) {
      alert("Score must be between 0 and 50.");
      return;
    }

    // Update the studentScores state
    setStudentScores((prevScores) => ({
      ...prevScores,
      [studentId]: {
        ...prevScores[studentId],
        [field]: numericValue,
        finalScore:
          field === "assignmentScore"
            ? numericValue + (prevScores[studentId]?.examScore || 0)
            : (prevScores[studentId]?.assignmentScore || 0) + numericValue,
      },
    }));

    // Update the studentFiltered state
    setStudentFiltered((prevStudents) => {
      return prevStudents.map((student) => {
        if (student._id === studentId) {
          const assignmentScore =
            field === "assignmentScore" ? numericValue : student.assignmentScore;
          const examScore =
            field === "examScore" ? numericValue : student.examScore;
          return {
            ...student,
            assignmentScore,
            examScore,
            finalScore: assignmentScore + examScore,
          };
        }
        return student;
      });
    });
  };

  const handleReset = async () => {
    setError("");
    try {
      await resetCertificatesAndCourseStatus(selectedCourse);
      setEditable(true);
    } catch (err) {
      setError("Failed to reset course. Please try again.");
      console.error(err);
    }
  };

  const handleUpdateAllStudents = async () => {
    setError("");
    setLoading(true);

    try {
      // Format the data as an array of objects
      const updates = studentFiltered.map((student) => {
        const { assignmentScore, examScore, finalScore } =
          studentScores[student._id];
        return {
          studentId: student._id, // Ensure this is the correct student ID
          assignmentScore: Number(assignmentScore),
          examScore: Number(examScore),
          finalScore: Number(finalScore),
        };
      });

      console.log(updates);

      // Filter out invalid updates (e.g., NaN scores)
      const validUpdates = updates.filter(
        ({ assignmentScore, examScore, finalScore }) =>
          !isNaN(assignmentScore) && !isNaN(examScore) && !isNaN(finalScore)
      );

      console.log("Valid updates:", validUpdates);

      if (validUpdates.length > 0) {
        // Send the valid updates to the backend
        await resetGradeAndRegenerateCertificate(
          selectedCourse,
          selectedSection,
          selectedBatch,
          validUpdates // This should be an array of objects
        );
        setEditable(false); // Disable edit mode after saving
      } else {
        setError("Please ensure all scores are valid.");
      }
    } catch (err) {
      setError("Failed to update students. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseDetails = adminCourses.find(
    (course) => course._id === selectedCourse
  );

  const selectedBatches = selectedCourseDetails?.batches || [];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Admin: {user?.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select a course</option>
            {adminCourses?.map(({ _id, courseName }) => (
              <option key={_id} value={_id}>
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
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          >
            <option value="">Select a section</option>
            {["A", "B", "C", "D", "E", "F", "G"].map((section) => (
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

      {selectedCourse && selectedSection && selectedBatch && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Student Assessments
          </h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading students...</p>
          ) : !Array.isArray(studentFiltered) ||
            studentFiltered.length === 0 ? (
            <p className="text-center text-gray-500">
              No students found for this section and batch.
            </p>
          ) : (
            <>
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border p-3">First Name</th>
                    <th className="border p-3">Last Name</th>
                    <th className="border p-3">Assignment Score</th>
                    <th className="border p-3">Exam Score</th>
                    <th className="border p-3">Final Score</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFiltered.map((student) => (
                    <tr key={student._id}>
                      <td className="border p-3">{student.firstName}</td>
                      <td className="border p-3">{student.lastName}</td>
                      <td className="border p-3">
                        <input
                          type="number"
                          value={studentScores[student._id]?.assignmentScore ?? 0}
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              "assignmentScore",
                              e.target.value
                            )
                          }
                          disabled={!editable}
                          className="border p-2 w-full"
                        />
                      </td>
                      <td className="border p-3">
                        <input
                          type="number"
                          value={studentScores[student._id]?.examScore ?? 0}
                          onChange={(e) =>
                            handleScoreChange(
                              student._id,
                              "examScore",
                              e.target.value
                            )
                          }
                          disabled={!editable}
                          className="border p-2 w-full"
                        />
                      </td>
                      <td className="border p-3">
                        {studentScores[student._id]?.finalScore ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={
                    editable ? handleUpdateAllStudents : () => setEditable(true)
                  }
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                >
                  {editable ? "Save Scores" : "Edit Scores"}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg"
                >
                  Reset Course
                </button>
              </div>
            </>
          )}
        </div>
      )}

    
    </div>
  );
};

export default AdminView;