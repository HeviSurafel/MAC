import React, { useState, useEffect } from 'react';
import {useUserStore} from "../Store/useAuthStore"
import { useNavigate,Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, user } = useUserStore();

  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to home page if the user is logged in
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Welcome Back
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-blue-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-blue-400"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-blue-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-blue-400"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 transform hover:scale-105"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-6 text-center">
          <span className="text-sm text-blue-600">Forget Password </span>
          <Link to={"/reset-password"} className="text-sm text-green-600 hover:underline">
           Reset Password
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
