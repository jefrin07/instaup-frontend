import React, { useState, useCallback, useRef } from "react";
import { MoreVertical, Upload, Trash2, User } from "lucide-react";
import Cropper from "react-easy-crop";
import { uploadAvatar, deleteAvatar } from "../../services/userProfile";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";

const getCroppedImg = async (imageSrc, croppedAreaPixels) => {
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
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
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.9
    );
  });
};

const AvatarImage = ({ previewProfile, setPreviewProfile }) => {
  const { setUserData, userData } = useAppContext();

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

  const handleAvatarChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
  };

  const handleCropSave = async () => {
    try {
      setIsSaving(true);
      if (!croppedAreaPixels) throw new Error("No crop area selected");

      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "avatar.jpg", {
        type: "image/jpeg",
      });

      // local preview
      setPreviewProfile(URL.createObjectURL(croppedFile));

      // upload
      const data = await uploadAvatar(croppedFile);
      setUserData((prev) => ({ ...prev, profile_picture: data.avatar }));
      setPreviewProfile(data.avatar);

      toast.success("Avatar updated!");
      setShowCropper(false);
      setImageSrc(null);
    } catch (error) {
      console.error(error);
      toast.error("Cropping failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your avatar?")) return;
    try {
      setIsDeleting(true);
      await deleteAvatar();
      setUserData((prev) => ({ ...prev, profile_picture: null }));
      setPreviewProfile(null);
      toast.success("Avatar deleted!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete avatar");
    } finally {
      setIsDeleting(false);
    }
  };

  // Determine which avatar to show
  const avatarSrc = previewProfile || userData?.profile_picture || null;

  // Only allow delete if uploaded avatar exists
  const canDelete = !!userData?.profile_picture;

  return (
    <div className="absolute -top-16 left-6">
      {/* Avatar Preview */}
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover"
        />
      ) : (
        <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-white shadow-md bg-slate-200">
          <User className="w-14 h-14 text-slate-500" />
        </div>
      )}

      {/* 3-dot menu */}
      <div className="absolute bottom-0 right-0">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 bg-white rounded-full shadow hover:bg-slate-100 transition"
        >
          <MoreVertical className="w-5 h-5 text-slate-700" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-100"
              onClick={() => {
                setMenuOpen(false);
                fileInputRef.current?.click();
              }}
            >
              <Upload className="w-4 h-4 text-indigo-600" /> Upload New
            </button>

            {canDelete && (
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
            handleAvatarChange(e.target.files[0]);
            e.target.value = "";
          }
        }}
      />

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative w-[95%] md:w-[500px] h-[500px] bg-white rounded-2xl p-4 shadow-lg flex flex-col">
            <div className="flex-1 relative rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={(val) => setZoom(Number(val))}
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

            {/* Action Buttons */}
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
                className={`px-4 py-2 rounded-lg shadow transition ${
                  isSaving
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
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

export default AvatarImage;
