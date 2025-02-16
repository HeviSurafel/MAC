import React from "react";

const CourseMaterials = ({ materials, onDownload }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Materials</h2>
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{material.name}</h3>
            <p className="text-sm text-gray-600">Course: {material.course}</p>
            <button
              onClick={() => onDownload(material.id)}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseMaterials;