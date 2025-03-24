import React, { useEffect, useState } from "react";

const UserModal = ({
  isModalOpen,
  setIsModalOpen,
  formData,
  setFormData,
  createUser,
  courses,
}) => {
  if (!isModalOpen) return null;

  const [section, setSection] = useState(["A", "B", "C", "D", "E"]); // Sections A to E
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectValue, setSelectValue] = useState("");
  const [selectedSection, setSelectedSection] = useState(""); // State for selected section
  const [selectedCourseFee, setSelectedCourseFee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [discountType, setDiscountType] = useState("");
  const [customDiscount, setCustomDiscount] = useState(0);
  const [batches, setBatches] = useState([]); // State for batches
  const [selectedBatch, setSelectedBatch] = useState(""); // State for selected batch

  // Generate a random password on component mount
  useEffect(() => {
    const generatePassword = () => {
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
      let password = Array.from({ length: 10 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join("");
      setFormData((prev) => ({ ...prev, password }));
    };
    generatePassword();
  }, [setFormData]);

  // Update formData with selected courses, section, and batch
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      courses: selectedCourses,
      section: selectedSection, // Update formData with selected section
      batch: selectedBatch, // Update formData with selected batch
    }));
  }, [selectedCourses, selectedSection, selectedBatch, setFormData]);

  // Handle course selection
  const handleCourseSelection = (e) => {
    const selectedCourseId = e.target.value;
    setSelectValue(""); // Clear the select value to reset the dropdown.

    if (selectedCourseId && !selectedCourses.includes(selectedCourseId)) {
      setSelectedCourses((prev) => [...prev, selectedCourseId]);

      // Find the selected course
      const selectedCourse = courses.find((c) => c._id === selectedCourseId);
      if (selectedCourse) {
        // Update registration fee
        setSelectedCourseFee(selectedCourse.registrationFee);
        setFormData((prev) => ({
          ...prev,
          registrationFee: selectedCourse.registrationFee,
        }));

        // Update batches to the selected course's batches
        setBatches(
          selectedCourse.batches?.filter(
            (batch) => batch.batchStatus !== "completed"
          ) || []
        );
        setSelectedBatch(""); // Reset selected batch when a new course is selected
      }
    }
  };

  // Handle removing a course
  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => {
      const updatedCourses = prev.filter((c) => c !== courseId);

      if (formData.role === "student" && updatedCourses.length === 0) {
        setSelectedCourseFee(null);
        setFormData((prev) => ({
          ...prev,
          registrationFee: null,
        }));
        setBatches([]); // Clear batches if no course is selected
        setSelectedBatch(""); // Reset selected batch
      }

      return updatedCourses;
    });
  };

  // Handle discount type change
  const handleDiscountChange = (e) => {
    setDiscountType(e.target.value);
  };

  // Handle custom discount change
  const handleCustomDiscountChange = (e) => {
    setCustomDiscount(parseFloat(e.target.value));
  };

  // Handle section change
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value); // Update selected section
  };

  // Handle batch selection
  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value); // Update selected batch
  };

  // Calculate final fee based on selected courses and discount
  const calculateFinalFee = () => {
    const totalCourseCost =
      formData.role === "student"
        ? selectedCourses.reduce((total, courseId) => {
            const course = courses.find((c) => c._id === courseId);
            return total + (course ? parseFloat(course.cost) : 0);
          }, 0)
        : 0;

    const registrationFee =
      formData.role === "student" && selectedCourses.length > 0
        ? courses.find((c) => c._id === selectedCourses[0])?.registrationFee ||
          0
        : 0;

    let discount = 0;
    let finalRegistrationFee = registrationFee;

    if (formData.role === "student") {
      switch (discountType) {
        case "staff":
          discount = 0.2; // 20% discount
          finalRegistrationFee = 0; // No registration fee for staff
          break;
        case "relative":
          discount = 0.2; // 20% discount
          break;
        case "friend":
          discount = 0.1; // 10% discount
          break;
        case "other":
          discount = customDiscount / 100; // Custom discount
          break;
        default:
          discount = 0; // No discount if nothing is selected
      }
    }

    const discountedCost = totalCourseCost * (1 - discount);

    return {
      finalCost: discountedCost,
      registrationFee: finalRegistrationFee,
    };
  };

  // Handle creating a new user
  const handleCreateUser = async () => {
    const { finalCost, registrationFee } = calculateFinalFee();
    await createUser({
      ...formData,
      courses: selectedCourses,
      section: selectedSection, // Include selected section in the payload
      batch: selectedBatch, // Include selected batch in the payload
      registrationFee: formData.role === "student" ? registrationFee : 0, // No registration fee for instructors
      monthlyCost: formData.role === "student" ? finalCost : 0, // No monthly payment for instructors
      discountType: formData.role === "student" ? discountType : "", // No discount for instructors
    });
    setIsModalOpen(false);
  };
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-[900px] max-h-[80vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form>
          {/* Page 1: Basic User Details */}
          {currentPage === 1 && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="text"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={formData.role || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              {/* Section Dropdown (Visible for Students and Instructors) */}
              {(formData.role === "student" ||
                formData.role === "instructor") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Section
                  </label>
                  <select
                    value={selectedSection}
                    onChange={handleSectionChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Section</option>
                    {section.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-between ">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Page 2: Discount Type and Course Selection */}
          {currentPage === 2 && (
            <div>
              {/* Discount Section (Only for Students) */}
              {formData.role === "student" && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Discount Type
                    </label>
                    <select
                      value={discountType}
                      onChange={handleDiscountChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Discount Type</option>
                      <option value="staff">
                        Staff (20% off, No registration fee)
                      </option>
                      <option value="relative">
                        Relative (20% off, Pays registration fee)
                      </option>
                      <option value="friend">
                        Friend (10% off, Pays registration fee)
                      </option>
                      <option value="other">Other (Custom discount)</option>
                    </select>
                  </div>

                  {discountType === "other" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Custom Discount (%)
                      </label>
                      <input
                        type="number"
                        value={customDiscount}
                        onChange={handleCustomDiscountChange}
                        className="w-full p-2 border rounded-lg"
                        max="100"
                        min="0"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Course Selection (Visible for Students and Instructors) */}
              {(formData.role === "student" ||
                formData.role === "instructor") && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {formData.role === "student"
                      ? "Select Course"
                      : "Assign Courses"}
                  </label>
                  <select
                    onChange={handleCourseSelection}
                    className="w-full p-2 border rounded-lg"
                    value={selectValue}
                  >
                    <option value="" disabled>
                      {formData.role === "student"
                        ? "-- Select a Course --"
                        : "-- Select Courses --"}
                    </option>
                    {courses?.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>

                  {/* Batch Dropdown (Visible for Students) */}
                  {formData.role === "student" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Batch
                      </label>
                      <select
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Batch</option>
                        {batches
                          .filter((batch) => batch.batchStatus !== "completed") // Ensures filtering at the rendering stage
                          .map((batch, index) => (
                            <option key={index} value={batch._id}>
                              {batch.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  {formData.role === "instructor" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Batch
                      </label>
                      <select
                        value={selectedBatch}
                        onChange={handleBatchChange}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="">Select Batch</option>
                        {batches.map((batch, index) => (
                          <option key={index} value={batch._id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Registration Fee (Only for Students) */}
                  {formData.role === "student" && (
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Registration Fee
                      </label>
                      <input
                        type="text"
                        value={`${calculateFinalFee().registrationFee}`}
                        readOnly
                        className="w-full p-2 border rounded-lg bg-gray-100"
                      />
                    </div>
                  )}

                  {selectedCourses.length > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Selected Courses
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedCourses.map((courseId) => {
                          const course = courses.find(
                            (c) => c._id === courseId
                          );
                          return (
                            <div
                              key={courseId}
                              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg flex items-center"
                            >
                              {course?.courseName}
                              <button
                                type="button"
                                className="ml-2 text-red-500 hover:text-red-700"
                                onClick={() => handleRemoveCourse(courseId)}
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Monthly Payment (Only for Students) */}
              {formData.role === "student" && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Monthly Payment
                  </label>
                  <input
                    type="text"
                    value={`${calculateFinalFee().finalCost}`}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleCreateUser}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserModal;
