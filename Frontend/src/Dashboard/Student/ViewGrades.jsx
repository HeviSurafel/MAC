import React from "react";

const ViewGrades = ({ grades }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Grades</h2>
      <div className="space-y-4">
        {grades.map((grade) => (
          <div
            key={grade.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{grade.course}</h3>
            <p className="text-sm text-gray-600">Grade: {grade.grade}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewGrades;