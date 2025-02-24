import React, { useState } from "react";
import useStudentStore from "../../Store/student.store";
const FeedbackPage = () => {
  const [comment, setComment] = useState("");

  const { submitFeedback } = useStudentStore();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitFeedback(comment);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Feedback Form</h1>
        <p className="text-gray-600 mb-8">
          Your feedback is valuable to us. Please take a moment to share your
          thoughts.
        </p>

        {/* Feedback Form */}
        <form onSubmit={handleFormSubmit}>
          {/* Comments Section */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              name="comments"
              value={comment}
              onChange={(e) => 
                setComment(e.target.value)
              }
              placeholder="Share your experience or thoughts here..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

         
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-blue-600 hover:bg-blue-600 hover:text-white font-bold `}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
