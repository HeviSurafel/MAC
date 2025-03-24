import { Save, Trash } from "lucide-react"; // Added Trash icon for removing files
import React, { useState } from "react";
import useBlogStore from "../../Store/blog.store";
import useAuthStore from "../../Store/useAuthStore";

function CreateBlog() {
  const { createBlog } = useBlogStore();
  const { user } = useAuthStore();
  console.log(user);
  const [formdata, setFormdata] = useState({
    title: "",
    description: "",
    subdescription: "",
    media: [], // Changed to handle multiple files
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formdata.title);
      formDataToSend.append("subdescription", formdata.subdescription);
      formDataToSend.append("description", formdata.description);
      formDataToSend.append("user", user.id);
  
      // Append each file to FormData
      formdata.media.forEach((media) => {
        formDataToSend.append("images", media.file); // 'images' should match multer field name
      });
  
      await createBlog(formDataToSend);
      setFormdata({ title: "", subdescription: "", description: "", media: [] });
  
    } catch (error) {
      console.log("Error creating a blog post:", error);
    }
  };
  

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    const newMedia = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // Generate a preview URL
    }));
    setFormdata({ ...formdata, media: [...formdata.media, ...newMedia] });
  };

  const handleRemoveFile = (index) => {
    const updatedMedia = formdata.media.filter((_, i) => i !== index);
    setFormdata({ ...formdata, media: updatedMedia });
  };

  return (
    <div className="max-w-4xl mx-auto pt-10 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Create New Blog Post</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700  mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formdata.title}
            onChange={(e) =>
              setFormdata({ ...formdata, title: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your blog title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Sub Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Description
          </label>
          <input
            type="text"
            name="subdescription"
            value={formdata.subdescription}
            onChange={(e) =>
              setFormdata({ ...formdata, subdescription: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.subdescription ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a subtitle for your blog"
          />
          {errors.subdescription && (
            <p className="mt-1 text-sm text-red-500">{errors.subdescription}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formdata.description}
            onChange={(e) =>
              setFormdata({ ...formdata, description: e.target.value })
            }
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your blog description"
            rows="5"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Media Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images/Videos
          </label>
          <input
            type="file"
            name="media"
            multiple
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            accept="image/*, video/*"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {formdata.media.map((media, index) => (
              <div key={index} className="relative">
                {media.file.type.startsWith("image") ? (
                  <img
                    src={media.url}
                    alt={`Uploaded ${index}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={media.url}
                    className="w-full h-32 object-cover rounded-lg"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300"
          >
            <Save className="h-5 w-5" />
            Publish Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateBlog;