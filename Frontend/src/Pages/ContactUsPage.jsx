import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useUserStore } from "../Store/useAuthStore";
import makalla from "../assets/makala man.JPG";

const ContactUsPage = () => {
  const { contactUs, loading } = useUserStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("All fields are required!");
      return;
    }
    const response = await contactUs(formData.name, formData.email, formData.subject, formData.message);
    console.log(response);
  };

  return (
    <div className="container mx-auto px-6 py-18 bg-white">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-blue-700">Get in Touch</h2>
        <p className="text-lg text-gray-600 mt-2">
          We'd love to hear from you! Fill out the form below and we’ll get back to you soon.
        </p>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <img 
            src={makalla} 
            alt="Contact Us" 
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.subject}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <textarea
                name="message"
                rows="4"
                placeholder="How can we help?"
                className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
