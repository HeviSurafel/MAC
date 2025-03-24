import React, { useState, useEffect } from "react";
import { User2Icon } from "lucide-react";
import { Link } from "react-router-dom";
import useBlogStore from "../Store/blog.store.js";
import useAuthStore from "../Store/useAuthStore.js";

function Blog() {
  function getReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return readTime;
  }

  const { user } = useAuthStore();
  const { blog, getAllBlogs, deleteBlog, updateBlog } = useBlogStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [editedPost, setEditedPost] = useState({
    title: "",
    description: "",
    subdescription: "",
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await getAllBlogs();
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deleteBlog(postId);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Error deleting blog");
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setEditedPost({
      title: post.title,
      description: post.description,
      subdescription: post.subdescription,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentPost(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await updateBlog(currentPost._id, editedPost);
      handleModalClose();
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Error updating blog");
    }
  };

  if (!blog || blog.length === 0 || !Array.isArray(blog)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>No Blogs Found</h1>
      </div>
    );
  }
  console.log(blog)

  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blog.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {/* Image Section */}
              <div className="w-full">
                {post.images && post.images.length > 0 ? (
                  post.images.length === 1 ? (
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={`http://localhost:5000${post.images[0]}`}
                        alt="Single Blog Image"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1 p-1">
                      {post.images.slice(0, 4).map((image, idx) => (
                        <div
                          key={idx}
                          className="relative w-full h-24 overflow-hidden"
                        >
                          <img
                            src={`http://localhost:5000${image}`}
                            alt={`Blog Image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                          {idx === 3 && post.images.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                +{post.images.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500">No images available</p>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                <Link
                  to={`/blog/detail/${post._id}`}
                  className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors duration-200"
                >
                  {post.title}
                </Link>
                <p className="text-gray-600 mb-4">{post.subdescription}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <User2Icon className="text-gray-700" />
                    <span className="text-sm text-gray-600">
                      {post.user.firstName || "Anonymous"}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {getReadTime(post.description)} min read
                  </span>
                </div>
                {(user?.role === "admin" || user?._id === post.user._id) && (
                  <div className="flex justify-between space-x-4 mt-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Blog Post</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-semibold">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={editedPost.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="subdescription"
                  className="block text-sm font-semibold"
                >
                  Subdescription
                </label>
                <input
                  type="text"
                  id="subdescription"
                  name="subdescription"
                  value={editedPost.subdescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={editedPost.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;
