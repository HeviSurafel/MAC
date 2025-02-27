import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCheck, FaTrash } from "react-icons/fa";
import useAdminStore from "../../Store/AdminStore";
const FeedbackList = () => {
  const { feedbacks, fetchFeedbacks,deleteFeedback } = useAdminStore();
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const markAsRead = (id) => {
    // setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, read: true } : f)));
    toast.success("Marked as read");
  };

  const handledeleteFeedback = (id) => {
    deleteFeedback(id);
    toast.error("Feedback deleted");
  };
  console.log(feedbacks)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Feedback List
      </h1>
      {feedbacks?.length === 0 ? (
        <p className="text-gray-500 text-center">No feedback available.</p>
      ) : (
        <div className="space-y-4">
          {feedbacks?.map(({ _id, comment, student, createdAt }) => (
  <div
    key={_id}
    className="p-6 border rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-white"
  >
    <h2 className="font-semibold text-lg text-gray-900">
      Student ID: {student}
    </h2>
    <p className="text-gray-700 mt-2">{comment}</p>
    <p className="text-gray-500 text-sm">Posted on: {new Date(createdAt).toLocaleString()}</p>

    <div className="flex gap-4 mt-4">
      <button
        onClick={() => markAsRead(_id)}
        className="flex items-center gap-2 text-green-600 hover:text-green-800"
      >
        <FaCheck /> Mark as Read
      </button>
      <button
        onClick={() => handledeleteFeedback(_id)}
        className="flex items-center gap-2 text-red-600 hover:text-red-800"
      >
        <FaTrash /> Delete
      </button>
    </div>
  </div>
))}

        </div>
      )}
    </div>
  );
};

export default FeedbackList;
