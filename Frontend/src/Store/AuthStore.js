import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  isLoggedIn: false, 
  user: null, 
  error: null, 

  // Login function
  login: async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', userData);
      set({ isLoggedIn: true, user: response.data, error: null });
    } catch (error) {
      // Handle errors
      console.error('Login failed:', error);
      set({ error: error.response?.data?.message || 'Login failed. Please try again.' });
    }
  },

  // Logout function
  logout: () => {
    // Reset state on logout
    set({ isLoggedIn: false, user: null, error: null });
  },
}));

export default useAuthStore;