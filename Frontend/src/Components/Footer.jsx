import React from 'react';
import { FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance } from 'react-icons/fa';
import logo from '../assets/image01.jpg';

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-teal-500 py-12 px-6 md:px-10">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo and Contact Section */}
        <div>
          <img src={logo} className="h-[40px]" alt="Logo" />
          <h3 className="text-2xl font-bold mt-4 text-white">Contact Us</h3>
          <p className="text-gray-200 text-base mt-2">Call: +251964945647</p>
          <p className="text-gray-200 text-base mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <p className="text-gray-200 text-base mt-2">Email: surafelwondu5647@mail.com</p>
          <div className="flex gap-3 py-3">
            {[FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance].map((Icon, index) => (
              <div
                key={index}
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition duration-300 cursor-pointer"
              >
                <Icon size={20} className="text-white hover:text-blue-200 transition duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <h3 className="text-xl font-bold text-white">Explore</h3>
          <ul className="mt-4">
            {['Home', 'About', 'Products', 'Blog', 'Contact'].map((item, index) => (
              <li
                key={index}
                className="py-2 text-gray-200 hover:text-white transition duration-200 cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Category Section */}
        <div>
          <h3 className="text-xl font-bold text-white">Category</h3>
          <ul className="mt-4">
            {['Web Development', 'App Development', 'Computer Maintenance', 'Graphics Design'].map(
              (item, index) => (
                <li
                  key={index}
                  className="py-2 text-gray-200 hover:text-white transition duration-200 cursor-pointer"
                >
                  {item}
                </li>
              ))}
          </ul>
        </div>

        {/* Subscribe Section */}
        <div>
          <h3 className="text-xl font-bold text-white">Subscribe</h3>
          <form className="mt-4">
            <input
              className="bg-white/10 p-3 w-full rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Enter your email"
            />
            <button className="w-full mt-3 px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition duration-200">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-6 text-center">
        <p className="text-gray-200 text-sm">
          &copy; {new Date().getFullYear()} Makalla Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
