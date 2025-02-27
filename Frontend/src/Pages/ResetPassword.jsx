import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // to navigate after successful submission
import { toast } from "react-hot-toast"; // For displaying success/error notifications
import useUserStore from "../Store/useAuthStore";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const history = useNavigate();
  const { requestPasswordReset } = useUserStore();
  const handleSubmit = (e) => {
    requestPasswordReset(email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Reset Password
        </h2>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
