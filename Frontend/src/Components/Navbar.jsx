import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaCaretDown } from "react-icons/fa";
import logo from "../assets/Makalla Code Acadamey-01.jpg";
import { useUserStore } from "../Store/useAuthStore";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUserStore();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = ["Home", "About", "Services", "Blog", "Contact"];

  return (
    <nav className="bg-blue-600 shadow-lg fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src={logo} className="h-10 mr-2 rounded-full" alt="Logo" />
            <Link
              to="/"
              className="text-white text-2xl font-bold hover:text-blue-200 transition duration-200"
            >
              Makalla Academy
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          <div
            className={`${
              menuOpen
                ? "absolute top-16 left-0 w-full bg-blue-600 py-4 shadow-lg flex flex-col items-center"
                : "hidden"
            } md:flex md:items-center md:space-x-8`}
          >
            {navLinks.map((item) => (
              <Link
                key={item}
                to={
                  item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`
                }
                className="text-white text-sm font-medium hover:text-blue-200 transition duration-200 py-2 px-4 md:rounded-lg hover:bg-blue-500/10"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative dropdown">
                <span className="text-white text-sm font-medium">
                  Welcome, {user?.name}!
                </span>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="ml-2 text-white text-sm font-medium flex items-center"
                >
                  <FaCaretDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg w-40">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
                          onClick={() => setDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-500 hover:text-white transition duration-200"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-white p-2 rounded-lg font-semibold hover:bg-green-500 hover:shadow-md transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white p-2 rounded-lg font-semibold hover:bg-green-500 hover:shadow-md transition duration-200"
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
