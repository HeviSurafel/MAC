import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../Store/AuthStore';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/image01.jpg';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-600  shadow-lg fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src={logo} className="h-10 mr-2 rounded-full" alt="Logo" />
            <Link
              to="/"
              className="text-white text-2xl font-bold hover:text-blue-200 transition duration-200"
            >
              Makalla Academy
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none hover:text-blue-200 transition duration-200"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`md:flex items-center space-x-8 ${menuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-gradient-to-r from-blue-600 to-green-500 py-4 shadow-lg' : 'hidden md:flex'}`}
          >
            {['Home', 'About', 'Services', 'Blog', 'Contact'].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="text-white text-sm font-medium hover:text-blue-200 transition duration-200 py-2 px-4 rounded-lg hover:bg-blue-500/10"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Login/Logout & Signup Section */}
          <div className="hidden md:flex items-center justify-end space-x-4">
  {isLoggedIn ? (
    <>
      <span className="text-white text-sm font-medium">
        Welcome, {user?.username}!
      </span>
      <button
        onClick={logout}
        className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 hover:shadow-md transition duration-200"
      >
        Logout
      </button>
    </>
  ) : (
    <div className="flex space-x-4"> {/* Increased space-x to ensure equal spacing */}
      <Link
        to="/login"
         className=" text-white p-2  rounded-lg font-semibold hover:bg-green-500 hover:shadow-md transition duration-200"
      >
        Login
      </Link>
      <Link
        to="/signup"
        className=" text-white p-2  rounded-sm font-semibold hover:bg-green-500 hover:shadow-md transition duration-200"
      >
        Sign Up
      </Link>
    </div>
  )}
</div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;