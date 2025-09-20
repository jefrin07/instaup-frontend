import React, { useState, useEffect, useRef } from "react";
import { X, Trash } from "lucide-react";

const AddStoryModal = ({ isOpen, onClose, onAddStory }) => {
  const [storyType, setStoryType] = useState("image");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [bgColor, setBgColor] = useState("#000000");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (file) setFileURL(URL.createObjectURL(file));
    return () => {
      if (fileURL) URL.revokeObjectURL(fileURL);
    };
  }, [file]);

  if (!isOpen) return null;

  const handleAddStory = () => {
    if (!file && storyType !== "text") return;

    const storyPayload = {
      story_type: storyType,
      media_file: storyType === "text" ? null : file,
      content: storyType === "text" ? textContent : "",
      bg_color: storyType === "text" ? bgColor : "",
    };

    onAddStory?.(storyPayload);

    // Reset
    setFile(null);
    setFileURL(null);
    setTextContent("");
    setBgColor("#000000");
    setStoryType("image");
    onClose();
  };

  // Drag & Drop (image only)
  const handleDrag = (e) => {
    if (storyType !== "image") return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    if (storyType !== "image") return;
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith("image/")) {
        alert("Please drop an image file only.");
        return;
      }
      setFile(droppedFile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 w-full max-w-md h-[90vh] flex flex-col rounded-xl shadow-2xl border border-gray-700 overflow-y-auto no-scrollbar animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-bold text-lg">Add to Your Story</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={28} />
          </button>
        </div>

        {/* Preview */}
        <div
          className={`flex-1 flex items-center justify-center p-4 border-b border-gray-700 ${
            dragActive ? "border-dashed border-4 border-blue-400" : ""
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            if (storyType === "image" && !file) fileInputRef.current?.click();
          }}
        >
          {storyType === "text" ? (
            <div
              className="w-full h-full flex items-center justify-center text-white text-2xl font-semibold text-center p-6 rounded-lg shadow-inner whitespace-pre-wrap break-words overflow-auto"
              style={{ backgroundColor: bgColor }}
            >
              {textContent || "Your Text Story"}
            </div>
          ) : fileURL ? (
            <div className="relative w-full h-full group">
              <img
                src={fileURL}
                alt="preview"
                className="object-contain w-full h-full rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setFileURL(null);
                }}
                className="absolute top-2 right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="text-gray-400 text-center text-lg italic">
              {dragActive
                ? "Drop your file here..."
                : "Drag & drop an image or click to select"}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-col gap-4 bg-gray-900">
          <div className="flex gap-2">
            {["image", "text"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setStoryType(type);
                  setFile(null);
                  setFileURL(null);
                  setTextContent("");
                }}
                className={`flex-1 py-2 rounded-lg font-semibold ${
                  storyType === type
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {storyType === "text" && (
            <div className="flex flex-col gap-2">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write something..."
                className="p-3 rounded-lg text-white bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-28"
              />
              <div className="flex items-center gap-2">
                <label className="text-white text-sm">Background:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 h-8 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAddStory}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600"
          >
            Share to Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStoryModal;
