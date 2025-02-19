import React, { useState } from 'react';

const ContactUsPage = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form after submission
    } catch (error) {
      console.error("Error sending message: ", error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-8 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-600">Get in Touch</h2>
        <p className="text-lg text-blue-500">We'd love to hear from you! Fill out the form below.</p>
      </div>

      <div className="flex justify-center items-center space-x-8">
        {/* Left side: Image */}
        <div className="w-1/2">
          <img 
            src="https://via.placeholder.com/400x400" 
            alt="Contact Us" 
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Right side: Contact Form */}
        <div className="w-1/2 max-w-lg p-6 bg-white border border-blue-300 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit}>
            {/* Name and Email Fields */}
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject Field */}
            <div className="mb-4">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            {/* Message Field */}
            <div className="mb-4">
              <textarea
                name="message"
                rows="5"
                placeholder="How can we help?"
                className="w-full p-4 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
