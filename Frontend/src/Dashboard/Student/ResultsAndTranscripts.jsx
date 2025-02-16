import React from "react";

const ResultsAndTranscripts = ({ results, onViewTranscript }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results and Transcripts</h2>
      <div className="space-y-4">
        {results.map((result) => (
          <div
            key={result.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-gray-800">{result.course}</h3>
            <p className="text-sm text-gray-600">Result: {result.result}</p>
            <button
              onClick={() => onViewTranscript(result.id)}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              View Transcript
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsAndTranscripts;