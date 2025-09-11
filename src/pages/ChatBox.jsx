import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { dummyUserData, dummyMessagesData } from "../assets/assets";

const ChatBox = () => {
  const [messages, setMessages] = useState(dummyMessagesData);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message = {
      _id: Date.now().toString(),
      from_user_id: dummyUserData._id,
      to_user_id: "user_2zwZSCMRXQ9GaEEVLgm6akQo96i",
      text: newMessage,
      message_type: "text",
      media_url: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setIsTyping(false);
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow">
        <img
          src={dummyUserData.profile_picture}
          alt={dummyUserData.full_name}
          className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div>
          <h2 className="font-semibold">{dummyUserData.full_name}</h2>
          <p className="text-sm opacity-80">@{dummyUserData.username}</p>
        </div>
      </div>

      {/* Chat area (scrollable only this part) */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-100 to-gray-200 space-y-4"
      >
        {messages.map((msg, i) => {
          const isMe = msg.from_user_id === dummyUserData._id;
          const showAvatar =
            !isMe &&
            (i === 0 || messages[i - 1].from_user_id === dummyUserData._id);

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && showAvatar && (
                <img
                  src="https://i.pravatar.cc/40?u=other"
                  alt="other"
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md ${
                  isMe
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {msg.text}
                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />
            <div className="flex gap-1 bg-white border rounded-full px-3 py-2 shadow-sm">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input area (fixed bottom) */}
      <div className="flex items-center gap-2 p-4 bg-gray-50 border-t">
        <button className="p-2 rounded-full hover:bg-gray-200 transition">
          <ImageIcon size={22} className="text-gray-500" />
        </button>
        <input
          type="text"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white shadow-md hover:scale-105 transition"
          onClick={handleSend}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
