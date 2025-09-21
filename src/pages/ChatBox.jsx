import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useChatContext } from "../context/ChatContext.jsx";
import { useAppContext } from "../context/AppContext.jsx";
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const { selectedUser, messages, sendMessage, fetchChat } = useChatContext();
  const { onlineUsers } = useAppContext();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const { userId } = useParams();

  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (userId) fetchChat(userId);
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const isOnline = Array.isArray(onlineUsers)
    ? onlineUsers.includes(selectedUser._id)
    : onlineUsers?.[selectedUser._id] || false;

  const handleSend = async () => {
    if (!text && files.length === 0) return;
    setSending(true);
    try {
      await sendMessage(selectedUser._id, text, files);
      setText("");
      setFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));
  const openImageModal = (images, index) => {
    setModalImages(images);
    setCurrentIndex(index);
  };
  const prevImage = () =>
    setCurrentIndex((prev) => (prev === 0 ? modalImages.length - 1 : prev - 1));
  const nextImage = () =>
    setCurrentIndex((prev) => (prev === modalImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="flex flex-col flex-1 border-l border-gray-200 bg-white h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          {selectedUser.profile_picture ? (
            <img
              src={selectedUser.profile_picture}
              alt={selectedUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500" />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{selectedUser.name}</p>
            <p
              className={`text-sm ${
                isOnline ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId !== selectedUser._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div className="mr-2">
                  {selectedUser.profile_picture ? (
                    <img
                      src={selectedUser.profile_picture}
                      alt={selectedUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl break-words ${
                  isMe ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                } shadow relative`}
              >
                {msg.text && <p>{msg.text}</p>}
                {msg.image_urls?.length > 0 && (
                  <div
                    className={`mt-2 grid gap-2 ${
                      msg.image_urls.length === 1
                        ? "grid-cols-1"
                        : msg.image_urls.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 md:grid-cols-2"
                    }`}
                  >
                    {msg.image_urls.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={img.url}
                          alt="attachment"
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          onClick={() => openImageModal(msg.image_urls, idx)}
                        />
                        {idx === 3 && msg.image_urls.length > 4 && (
                          <div
                            className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold rounded-lg cursor-pointer"
                            onClick={() => openImageModal(msg.image_urls, idx)}
                          >
                            +{msg.image_urls.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {isMe && (
                  <p className="text-xs text-gray-300 text-right mt-1">
                    {msg.seen ? "✓✓ Seen" : "✓ Sent"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Files preview */}
      {files.length > 0 && (
        <div className="flex space-x-2 p-2 overflow-x-auto border-t border-gray-200 bg-gray-50">
          {files.map((file, index) => (
            <div key={index} className="relative w-20 h-20 flex-shrink-0">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <button
                className="absolute top-1 right-1 bg-black bg-opacity-50 p-1 rounded-full"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center p-3 border-t border-gray-200 flex-shrink-0">
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <label htmlFor="file-upload" className="p-2 cursor-pointer">
          <Paperclip className="w-5 h-5 text-gray-500" />
        </label>

        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !sending) handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className={`bg-blue-500 p-3 rounded-full text-white transition flex items-center justify-center ${
            sending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
        >
          {sending ? (
            <svg
              className="w-5 h-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Image modal */}
      {modalImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white"
            onClick={() => setModalImages([])}
          >
            <X className="w-6 h-6" />
          </button>
          {modalImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 text-white bg-black bg-opacity-40 p-2 rounded-full hover:bg-opacity-60"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          <img
            src={modalImages[currentIndex].url}
            alt="full view"
            className="max-h-[90%] max-w-[90%] rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
