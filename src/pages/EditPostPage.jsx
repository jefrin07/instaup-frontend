import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSinglePost,
  updatePostContent,
  deletePostImage,
  uploadPostImages,
} from "../services/postService";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import CropModal from "../components/Profile/CropModal";
import getCroppedImg from "../lib/getCroppedImg";

const EditPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [tempContent, setTempContent] = useState("");

  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);

  // cropping states
  const [croppingImage, setCroppingImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await getSinglePost(postId);
        setPost(res.post);
        setTempContent(res.post.content);
      } catch (err) {
        toast.error("❌ Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // Update content only
  const handleUpdateContent = async () => {
    try {
      setSaving(true);
      await updatePostContent(postId, tempContent);
      setPost((prev) => ({ ...prev, content: tempContent }));
      setIsEditingContent(false);
      toast.success("✅ Content updated");
    } catch (err) {
      toast.error("❌ Failed to update content");
    } finally {
      setSaving(false);
    }
  };

  // Delete single image
  const handleDeleteImage = async (public_id) => {
    try {
      await deletePostImage(postId, public_id);
      setPost((prev) => ({
        ...prev,
        image_urls: prev.image_urls.filter(
          (img) => img.public_id !== public_id
        ),
      }));
      toast.success("🗑️ Image deleted");
    } catch (err) {
      toast.error("❌ Failed to delete image");
    }
  };

  // Upload new images
  const handleUploadImages = async () => {
    if (newImages.length === 0) return;
    try {
      setSaving(true);
      await uploadPostImages(postId, newImages);
      setNewImages([]);
      const res = await getSinglePost(postId);
      setPost(res.post);
      toast.success("📸 Images uploaded");
    } catch (err) {
      toast.error("❌ Failed to upload images");
    } finally {
      setSaving(false);
    }
  };

  // Cropping
  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped.jpeg", {
        type: "image/jpeg",
      });

      setNewImages((prev) => [...prev, croppedFile]);
      setCroppingImage(null);
      toast.success("✂️ Image cropped");
    } catch (err) {
      toast.error("❌ Failed to crop image");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Loading...
      </div>
    );
  }
  if (!post) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Edit Post</h1>

      <div className="space-y-8">
        {/* Section 1: Content */}
        <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
          <h2 className="font-semibold mb-3 text-slate-700">Content</h2>
          {isEditingContent ? (
            <div className="flex flex-col gap-3">
              <textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                className="w-full border rounded-xl p-3 text-slate-700 focus:ring-2 focus:ring-blue-400"
                rows={4}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleUpdateContent}
                  disabled={saving}
                  className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTempContent(post.content);
                    setIsEditingContent(false);
                  }}
                  className="flex items-center gap-1 px-4 py-2 border rounded-xl hover:bg-slate-50"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <p className="text-slate-700 flex-1 whitespace-pre-wrap">
                {post.content || "No content"}
              </p>
              <button
                type="button"
                onClick={() => setIsEditingContent(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <Pencil className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Existing Images */}
        <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
          <h2 className="font-semibold mb-3 text-slate-700">Images</h2>
          {post.image_urls?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.image_urls.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-xl overflow-hidden shadow-sm aspect-square"
                >
                  <img
                    src={img.url}
                    alt={`post-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.public_id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No images attached</p>
          )}
        </div>

        {/* Section 3: Upload New Images */}
        <div className="bg-white p-6 rounded-2xl shadow border border-slate-100">
          <h2 className="font-semibold mb-3 text-slate-700">
            Upload New Images
          </h2>
          <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 font-medium hover:text-blue-700">
            <Plus className="w-4 h-4" /> Choose file
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                if (files.length > 0) {
                  setCroppingImage(URL.createObjectURL(files[0]));
                }
              }}
            />
          </label>

          {newImages.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {newImages.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden shadow-sm aspect-square"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setNewImages((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleUploadImages}
                disabled={saving}
                className="mt-4 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Uploading..." : "Upload"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Crop modal */}
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
    </div>
  );
};

export default EditPostPage;
