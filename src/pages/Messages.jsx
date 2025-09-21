import React, { useEffect, useState, useMemo } from "react";
import { Eye, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { useChatContext } from "../context/ChatContext.jsx";

const Messages = () => {
  const navigate = useNavigate();
  const { onlineUsers } = useAppContext();
  const { users, fetchFollowingUsers, unseenMessages, setSelectedUser } =
    useChatContext();
  const [loading, setLoading] = useState(true);

  // Fetch following users
  useEffect(() => {
    const fetchData = async () => {
      await fetchFollowingUsers();
      setLoading(false);
    };
    fetchData();
  }, [fetchFollowingUsers]);

  // Sort users by last message timestamp
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aTime = a.preview?.time ? new Date(a.preview.time).getTime() : 0;
      const bTime = b.preview?.time ? new Date(b.preview.time).getTime() : 0;
      return bTime - aTime;
    });
  }, [users]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Messages</h1>
          <p className="text-slate-600">Connect with friends and family</p>
        </div>

        {/* Chat List */}
        <div className="flex flex-col gap-4">
          {sortedUsers.length === 0 ? (
            <p className="text-slate-500 text-center mt-12">
              No conversations yet.
            </p>
          ) : (
            sortedUsers.map(({ user, preview }) => {
              const userId = user._id.toString();
              const isOnline = Array.isArray(onlineUsers)
                ? onlineUsers.includes(userId)
                : onlineUsers?.[userId] || false;
              const unseenCount = unseenMessages?.[userId] || 0;

              return (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user); // ✅ Set the clicked user as selected
                    navigate(`/messages/${user._id}`);
                  }}
                  className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer relative"
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <User className="w-14 h-14 rounded-full p-2 bg-slate-200 text-slate-500" />
                      )}
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                      {unseenCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {unseenCount}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div>
                      <p className="font-semibold text-slate-800">
                        {user.name}
                      </p>
                      <p
                        className={`text-sm mt-0.5 ${
                          isOnline ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        {isOnline ? "Online" : "Offline"}
                      </p>
                      {preview ? (
                        <p className="text-sm text-gray-600 mt-1 truncate max-w-xs">
                          {preview.sentByMe ? "You: " : ""}
                          {preview.message || "No messages yet"}
                          {preview.sentByMe && preview.seen === false && (
                            <span className="ml-2 text-blue-500 font-semibold">
                              • Unseen
                            </span>
                          )}
                          {!preview.sentByMe && preview.seen === false && (
                            <span className="ml-2 text-gray-400 font-semibold">
                              • Unread
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 italic mt-1">
                          No messages yet
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(user);
                        navigate(`/messages/${user._id}`);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/view-profile/${user._id}`);
                      }}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
