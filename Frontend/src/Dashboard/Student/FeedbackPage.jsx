import React, { useState } from "react";

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comments: "",
    suggestions: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionMessage("Thank you for your feedback!");
      setFeedback({ rating: 0, comments: "", suggestions: "" });
    }, 2000);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Feedback Form</h1>
        <p className="text-gray-600 mb-8">
          Your feedback is valuable to us. Please take a moment to share your thoughts.
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
              value={feedback.comments}
              onChange={handleFeedbackChange}
              placeholder="Share your experience or thoughts here..."
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-3 rounded-lg text-white font-bold ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transition duration-300"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {/* Success Message */}
        {submissionMessage && (
          <div className="mt-6 text-center text-green-500 font-medium">
            {submissionMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
