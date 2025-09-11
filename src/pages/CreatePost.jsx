import React, { useState } from "react";
import { Image, X } from "lucide-react";
import ImageCropModal from "../components/ImageCropModal";

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [images, setImages] = useState([]);
  const [cropModal, setCropModal] = useState(null);

  const user = {
    full_name: "John Warren",
    username: "john_warren",
    profile_picture: "https://i.pravatar.cc/100?img=5",
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      cropped: null,
    }));
    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSaveCrop = (id, croppedImage) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, cropped: croppedImage } : img
      )
    );
  };

  const handlePublish = () => {
    if (!postContent.trim() && images.length === 0) return;
    console.log("New Post:", { postContent, images });
    setPostContent("");
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4">
      <div className="w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.profile_picture}
              alt={user.full_name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-slate-800">{user.full_name}</p>
              <p className="text-sm text-slate-500">@{user.username}</p>
            </div>
          </div>

          <textarea
            placeholder="What's happening?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            className="w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4"
          />

        {images.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
    {images.map((img) => (
      <div key={img.id} className="relative w-full pb-[100%]">
        <img
          src={img.cropped || img.id}
          alt="preview"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
        />
        {/* Remove button */}
        <button
          onClick={() => removeImage(img.id)}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Crop button */}
        <button
          onClick={() => setCropModal(img)}
          className="absolute bottom-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-md text-xs"
        >
          Crop
        </button>
      </div>
    ))}
  </div>
)}


          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-slate-500 hover:text-slate-700">
              <Image className="w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <button
              onClick={handlePublish}
              disabled={!postContent.trim() && images.length === 0}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>

      {cropModal && (
        <ImageCropModal
          image={cropModal}
          onClose={() => setCropModal(null)}
          onSave={handleSaveCrop}
        />
      )}
    </div>
  );
};

export default CreatePost;
