import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import useBlogStore from "../Store/blog.store";
import { useParams } from "react-router-dom";
import useAuthStore from "../Store/useAuthStore";
import Loading from "../components/LoadingSpinner";
import { User2Icon, Heart } from "lucide-react";

function BlogDetail() {
  const { id } = useParams();
  const { blog, getSingleBlog } = useBlogStore();
  const { user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await getSingleBlog(id);
      } catch (error) {
        console.error("Failed to fetch single blogs or comments:", error);
      }
    };
    fetchBlogs();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites!");
  };

  if (!blog || blog.length === 0 || blog === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-18">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Blog Image */}
        <div className="w-full mb-8">
          {blog.images && blog.images.length > 0 ? (
            blog.images.length === 1 ? (
              // Single Image
              <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
                <img
                  src={`http://localhost:5000${blog.images[0]}`}
                  alt="Single Blog Image"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            ) : (
              // Multiple Images
              <div className="grid grid-cols-2 gap-2">
                {blog.images.slice(0, 4).map((image, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg"
                  >
                    <img
                      src={`http://localhost:5000${image}`}
                      alt={`Blog Image ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay for more than 4 images */}
                    {idx === 3 && blog.images.length > 4 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          +{blog.images.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            // No Images
            <div className="w-full h-48 flex items-center justify-center bg-white rounded-lg shadow-lg">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Blog Title and Metadata */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <User2Icon className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-700">
                {blog.user?.firstName || "Anonymous"}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>5 min read</span>
                <span className="mx-2">•</span>
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{blog.description}</p>
        </div>

      
      </main>
    </div>
  );
}

export default BlogDetail;