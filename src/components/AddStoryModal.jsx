import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const AddStoryModal = ({ isOpen, onClose, onAddStory }) => {
  const [storyType, setStoryType] = useState("image"); // image, video, text
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [bgColor, setBgColor] = useState("#000000");

  const [usingCamera, setUsingCamera] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Create URL for file preview
  useEffect(() => {
    if (file) setFileURL(URL.createObjectURL(file));
    return () => {
      if (fileURL) URL.revokeObjectURL(fileURL);
    };
  }, [file]);

  // Start camera
  useEffect(() => {
    if (usingCamera) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: storyType === "video" })
        .then((stream) => {
          setMediaStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
          setUsingCamera(false);
        });
    } else {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        setMediaStream(null);
      }
    }
  }, [usingCamera, storyType]);

  if (!isOpen) return null;

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setFile(new File([blob], "photo.png", { type: "image/png" }));
      setUsingCamera(false);
    });
  };

  const handleStartRecording = () => {
    if (!mediaStream) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      setFile(new File([blob], "video.webm", { type: "video/webm" }));
      setRecording(false);
      setUsingCamera(false);
    };
    recorder.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
  };

  const handleAddStory = () => {
    if (!file && storyType !== "text") return;
    onAddStory?.({
      media_type: storyType,
      media_url: storyType === "text" ? null : fileURL,
      content: storyType === "text" ? textContent : "",
      background_color: storyType === "text" ? bgColor : "",
    });
    setFile(null);
    setFileURL(null);
    setTextContent("");
    setBgColor("#000000");
    setStoryType("image");
    setUsingCamera(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center select-none">
      <div className="bg-black w-full max-w-md h-full relative flex flex-col overflow-hidden rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold">Add to Your Story</h2>
          <button onClick={onClose} className="text-white">
            <X size={28} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-900 overflow-hidden">
          {storyType === "text" ? (
            <div
              className="w-full h-full flex items-center justify-center text-white text-3xl font-semibold text-center p-6 rounded"
              style={{ backgroundColor: bgColor }}
            >
              {textContent || "Your Text Story"}
            </div>
          ) : usingCamera ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="object-contain w-full h-full rounded"
            />
          ) : fileURL ? (
            storyType === "image" ? (
              <img src={fileURL} alt="preview" className="object-contain w-full h-full rounded" />
            ) : (
              <video src={fileURL} className="object-contain w-full h-full rounded" controls autoPlay loop />
            )
          ) : (
            <div className="text-white text-center">{storyType === "image" ? "Select an image" : "Select a video"}</div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-col gap-3 bg-black/90">
          {/* Story Type Selector */}
          <div className="flex gap-2">
            {["image", "video", "text"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setStoryType(type);
                  setFile(null);
                  setFileURL(null);
                  setTextContent("");
                  setUsingCamera(false);
                }}
                className={`flex-1 py-2 rounded-md text-sm font-semibold ${
                  storyType === type ? "bg-white text-black" : "bg-gray-700 text-white"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* File / Camera / Text */}
          {storyType === "text" ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write something..."
                className="p-2 rounded-md text-black w-full resize-none h-24"
              />
              <div className="flex items-center gap-2">
                <label className="text-white text-sm">Background:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 h-8 p-0 border-0 rounded"
                />
              </div>
            </div>
          ) : usingCamera ? (
            <div className="flex gap-2">
              {storyType === "image" ? (
                <button onClick={handleCapturePhoto} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                  Capture Photo
                </button>
              ) : recording ? (
                <button onClick={handleStopRecording} className="bg-red-500 text-white py-2 px-4 rounded-md">
                  Stop Recording
                </button>
              ) : (
                <button onClick={handleStartRecording} className="bg-blue-500 text-white py-2 px-4 rounded-md">
                  Start Recording
                </button>
              )}
              <button onClick={() => setUsingCamera(false)} className="bg-gray-700 text-white py-2 px-4 rounded-md">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input type="file" accept={storyType + "/*"} onChange={(e) => setFile(e.target.files[0])} className="text-white flex-1" />
              <button onClick={() => setUsingCamera(true)} className="bg-green-500 text-white py-2 px-4 rounded-md">
                Use Camera
              </button>
            </div>
          )}

          {/* Share */}
          <button onClick={handleAddStory} className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
            Share to Story
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStoryModal;
