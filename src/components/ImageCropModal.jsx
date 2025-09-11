import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import Cropper from "react-easy-crop";

// utility: generate cropped image
export const getCroppedImg = (imageSrc, croppedAreaPixels) => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
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

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    };
    image.onerror = reject;
  });
};

const ImageCropModal = ({ image, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveCrop = async () => {
    if (!croppedAreaPixels) return;
    const originalUrl = URL.createObjectURL(image.file);
    const croppedImage = await getCroppedImg(originalUrl, croppedAreaPixels);
    onSave(image.id, croppedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[90%] max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold mb-4">Crop Image</h2>

        <div className="relative w-full pb-[100%] bg-slate-100">
          <Cropper
            image={URL.createObjectURL(image.file)}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            cropShape="rect"
            showGrid={true}
          />
        </div>

        <div className="mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">
            Cancel
          </button>
          <button
            onClick={saveCrop}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Save Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
