import React from "react";

const AccessCertificates = ({ certificates, onDownload }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Certificates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{certificate.name}</h3>
            <p className="text-sm text-gray-600">Issued on: {certificate.date}</p>
            <button
              onClick={() => onDownload(certificate.id)}
              className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessCertificates;