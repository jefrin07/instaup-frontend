import React, { useEffect, useState, useCallback } from "react";
import { Image, User, X } from "lucide-react";
import { getCurrentUser } from "../services/authService";
import { addPost } from "../services/postService";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import getCroppedImg from "../lib/getCroppedImg";

// --- Subcomponents ---

const UserInfo = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3 w-full animate-pulse">
        <div className="w-14 h-14 rounded-full bg-slate-200" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-24 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user) return <p className="text-red-500">Failed to load user</p>;

  return (
    <div className="flex items-center gap-3">
      {user.profile_picture ? (
        <img
          src={user.profile_picture}
          alt="avatar"
          className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-white shadow-md bg-slate-200">
          <User className="w-7 h-7 text-slate-500" />
        </div>
      )}
      <div>
        <p className="font-semibold text-slate-800">{user.name || "Name"}</p>
        <p className="text-sm text-slate-500">@{user.username || "username"}</p>
      </div>
    </div>
  );
};

const ImagePreview = ({ images, onRemove }) => (
  <div className="flex gap-2 flex-wrap mb-4">
    {images.map((img, idx) => (
      <div key={idx} className="relative w-24 h-24">
        <img
          src={URL.createObjectURL(img)}
          alt="preview"
          className="w-full h-full object-cover rounded"
        />
        <button
          onClick={() => onRemove(idx)}
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    ))}
  </div>
);

const CropModal = ({ image, crop, zoom, onCropChange, onZoomChange, onCropComplete, onCancel, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded-lg relative w-96 h-96">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={onConfirm}>
          Crop
        </button>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const CreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [croppingImage, setCroppingImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [submitting, setSubmitting] = useState(false); // <-- new state

  useEffect(() => {
    (async () => {
      try {
        const res = await getCurrentUser();
        setUserData(res.user);
      } catch (err) {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onCropComplete = useCallback((_, areaPixels) => setCroppedAreaPixels(areaPixels), []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCroppingImage(reader.result);
      reader.readAsDataURL(file);
      e.target.value = null;
    }
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      setImages((prev) => [...prev, croppedBlob]);
      setCroppingImage(null);
    } catch (err) {
      toast.error("Failed to crop image");
    }
  };

  const handleRemoveImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    if (!postContent && images.length === 0) return toast.error("Post cannot be empty");

    setSubmitting(true); // <-- disable button
    const formData = new FormData();
    formData.append("content", postContent);
    formData.append("post_type", "text");
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await addPost(formData);
      toast.success(res.message);
      setPostContent("");
      setImages([]);
    } catch (err) {
      toast.error(err.message || "Failed to create post");
    } finally {
      setSubmitting(false); // <-- enable button
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Post</h1>
          <p className="text-slate-600">Share your thoughts with the world</p>
        </div>

        {/* Post Box */}
        <div className="bg-white rounded-xl shadow p-6">
          <UserInfo user={userData} loading={loading} />
          <textarea
            className="w-full p-4 border border-slate-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            disabled={submitting} // disable typing while submitting
          />

          <ImagePreview images={images} onRemove={handleRemoveImage} />

          <label className="flex items-center gap-2 cursor-pointer text-indigo-600 mb-4">
            <Image /> Add Image
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={submitting} />
          </label>

          {croppingImage && (
            <CropModal
              image={croppingImage}
              crop={crop}
              zoom={zoom}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onCancel={() => setCroppingImage(null)}
              onConfirm={handleCropConfirm}
            />
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting} // <-- disable button while submitting
            className={`mt-4 w-full px-4 py-2 rounded-lg transition ${
              submitting
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;


