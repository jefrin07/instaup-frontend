import React from "react";
import { dummyRecentMessagesData } from "../assets/assets"; // adjust path if needed

const RecenMessages = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold mb-2">Recent Messages</h3>

      <div className="flex flex-col gap-3">
        {dummyRecentMessagesData.map((msg) => {
          const sender = msg.from_user_id; // user object
          return (
            <div
              key={msg._id}
              className="flex items-center justify-between gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              {/* Profile section */}
              <div className="flex items-center gap-2">
                <img
                  src={sender.profile_picture}
                  alt={sender.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{sender.full_name}</p>
                  <p
                    className={`text-xs ${
                      msg.seen ? "text-gray-500" : "text-blue-600 font-semibold"
                    }`}
                  >
                    {msg.text.length > 25
                      ? msg.text.slice(0, 25) + "..."
                      : msg.text}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecenMessages;
