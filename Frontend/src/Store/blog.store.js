import { create } from "zustand";
import axios from "../lib/axios"; // Use the Axios instance
import { toast } from "react-hot-toast";

const useBlogStore = create((set, get) => ({
  blog: [],
  comment: [],
  numberOfLikes: null,
  loading: false,
  error: null,
  setBlog: (blog) => set({ blog }),
  getAllBlogs: async () => {
    try {
      const res = await axios.get("/blog/post/getblogs");
      set({ blog: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  createBlog: async (formDataToSend) => {
    set({ loading: true });

    try {
      const res = await axios.post("/blog/post/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure correct content type
        },
      });

      set({ blog: res.data, loading: false });
      toast.success("Blog created successfully");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },

  // Add confirmation before deleting a blog
  deleteBlog: async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await axios.delete(`/blog/post/delete/${id}`);
      set({ blog: res.data });
      toast.success("Blog deleted successfully");
      get().getAllBlogs();
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to delete blog");
    }
  },

  // Add confirmation before updating a blog
  updateBlog: async ( id, editedPost ) => {
    if (!window.confirm("Are you sure you want to update this blog?")) return;

    set({ loading: true });
    try {
      const res = await axios.put(`/blog/post/update/${id}`, { editedPost });
      set({ blog: res.data, loading: false });
      toast.success("Blog updated successfully");
      get().getAllBlogs();
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  },

  getSingleBlog: async (id) => {
    try {
      const res = await axios.get(`/blog/post/detail/${id}`);
      set({ blog: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  likeBlog: async (userId, blogId) => {
    try {
      const res = await axios.post(`/blog/like/:${blogId}`, { userId, blogId, itemType: "blog" });
      set({ numberOfLikes: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  createComment: async (content, blogId, userId) => {
    try {
      const res = await axios.post(`/blog/detail/create/comment/:${blogId}`, {
        content,
        user: userId,
        blog: blogId,
      });
      set({ comment: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
  getComment: async (id) => {
    try {
      const res = await axios.get(`/blog/detail/comment/${id}`);
      set({ comment: res.data });
    } catch (error) {
      set({ error: error.message });
    }
  },
}));

export default useBlogStore;
