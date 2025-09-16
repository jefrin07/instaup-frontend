import React, { useState, useCallback, useRef } from "react";
import { Edit3, MoreVertical, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { uploadCoverPic, deleteCoverPic } from "../../services/userProfile";

const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/jpeg");
  });
};

const CoverImage = ({ previewCover, setPreviewCover }) => {
  const fileInputRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCoverChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
  };

  const handleCropSave = async () => {
    if (!croppedAreaPixels) return;
    setIsSaving(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cover.jpg", {
        type: "image/jpeg",
      });

      setPreviewCover(URL.createObjectURL(croppedFile));

      const data = await uploadCoverPic(croppedFile);
      setPreviewCover(data.cover_picture);

      toast.success("Cover Picture updated!");
      setShowCropper(false);
      setImageSrc(null);
    } catch (error) {
      console.error(error);
      toast.error("Cover cropping failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the cover picture?"))
      return;
    try {
      setIsDeleting(true);
      await deleteCoverPic();
      setPreviewCover(null);
      toast.success("Cover Picture deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete cover picture");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative h-96 rounded-b-2xl overflow-hidden group">
      {/* Cover Preview */}
      {previewCover ? (
        <img
          src={previewCover}
          alt="cover"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300"></div>
      )}

      {/* 3-dot Menu */}
      <div className="absolute top-2 left-2">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
        >
          <MoreVertical className="w-5 h-5 text-slate-700" />
        </button>

        {menuOpen && (
          <div className="absolute left-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
              onClick={() => {
                setMenuOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 text-indigo-600" /> Upload New
            </button>

            {previewCover && (
              <button
                className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setMenuOpen(false);
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleCoverChange(e.target.files[0]);
            e.target.value = ""; // reset to allow same file
          }
        }}
      />

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative w-[95%] md:w-[700px] h-[500px] bg-white rounded-2xl p-4 shadow-lg flex flex-col">
            {/* Cropper Area */}
            <div className="flex-1 relative rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                cropShape="rect"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Zoom Slider */}
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs text-gray-500">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => {
                  setShowCropper(false);
                  setImageSrc(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg shadow text-white transition ${
                  isSaving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                onClick={handleCropSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverImage;
