
const Feedback = require('../Model/feedBack.model');
// ➡️ Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { course, instructor, rating, comment } = req.body;
    const student = req.user._id;

    const feedback = new Feedback({ course, student, instructor, rating, comment });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully.', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const getCourseFeedback = async (req, res) => {
  try {
    const { courseId } = req.params;

    const feedbacks = await Feedback.find({ course: courseId })
      .populate('student', 'firstName lastName')
      .populate('instructor', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// 📊 Get instructor feedback summary
const getInstructorFeedback = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const feedbacks = await Feedback.find({ instructor: instructorId })
      .populate('student', 'firstName lastName')
      .populate('course', 'name')
      .sort('-createdAt');

    const averageRating = feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length || 0;

    res.status(200).json({ averageRating, feedbacks });
  } catch (error) {
    console.error('Error fetching instructor feedback:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports = { submitFeedback, getCourseFeedback, getInstructorFeedback };