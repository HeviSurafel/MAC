import React from 'react';
import { FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance } from 'react-icons/fa';
import logo from '../assets/image01.jpg';

const Footer = () => {
  return (
    <div className="w-full bg-white py-5 shadow-lg px-6 md:px-10 h-[300px] flex flex-col justify-between">
      <div className="max-w-[1480px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <img src={logo} className="h-[40px]" alt="Logo" />
          <h3 className="text-2xl font-semibold mt-2 text-blue-800">Contact Us</h3>
          <p className="text-[#6D737A] text-base">Call: +251964945647</p>
          <p className="text-[#455363] text-base">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          <p className="text-[#363A3D] text-base">Email: surafelwondu5647@mail.com</p>
          <div className="flex gap-3 py-3">
            {[FaFacebookF, FaDribbble, FaLinkedinIn, FaInstagram, FaBehance].map((Icon, index) => (
              <div
                key={index}
                className="p-3 bg-[#E9F8F3] rounded-lg hover:bg-[#4DC39E] transition duration-300 cursor-pointer"
              >
                <Icon size={20} className="text-gray-700 hover:text-white transition duration-300" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-blue-800">Explore</h3>
          <ul className="text-[#6D737A] text-base">
            {['Home', 'About', 'Products', 'Blog', 'Contact'].map((item, index) => (
              <li key={index} className="py-1 hover:text-blue-600 transition duration-200 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-blue-800">Category</h3>
          <ul className="text-[#6D737A] text-base">
            {['Web development', 'App Development', 'Computer maintenance', 'Graphics Design'].map(
              (item, index) => (
                <li key={index} className="py-1 hover:text-blue-600 transition duration-200 cursor-pointer">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-blue-800">Subscribe</h3>
          <form className="py-2">
            <input
              className="bg-[#F2F3F4] p-2 w-full rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email here"
            />
            <button className="w-full mt-2 px-3 py-2 rounded-md bg-[#20B486] text-white text-base font-medium hover:bg-[#1A9367] transition duration-200">
              Subscribe Now
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-blue-200 text-center pt-2 text-base">
        <p className="text-[#6D737A]">&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;