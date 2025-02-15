import React, { useState } from 'react';
import useAuthStore from '../Store/AuthStore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (username && password) {
      login({ username });
      alert('Login successful!');
    } else {
      alert('Please enter username and password.');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
        <div className="text-center text-2xl font-bold text-blue-800">
          You are already logged in!
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-green-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-2xl w-96"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Welcome Back
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-blue-700" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-blue-400"
            placeholder="Enter your username"
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
        >
          Login
        </button>
        <div className="mt-6 text-center">
          <span className="text-sm text-blue-600">Don't have an account? </span>
          <a href="#" className="text-sm text-green-600 hover:underline">
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;