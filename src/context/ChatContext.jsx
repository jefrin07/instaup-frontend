import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import API from "../lib/api";
import { useAppContext } from "./AppContext.jsx";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const { socket, userData } = useAppContext();

  const selectedUserRef = useRef(selectedUser);

  // Keep ref updated
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Fetch following users
  const fetchFollowingUsers = useCallback(async () => {
    try {
      const res = await API.get("/api/chat/getFollowingUsers");
      setUsers(res.data.chats);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  }, []);

  // Fetch chat and mark all as seen
  const fetchChat = async (userId) => {
    try {
      const res = await API.get(`/api/chat/getChat/${userId}`);
      const chatMessages = res.data.messages.map((msg) => ({
        ...msg,
        seen: true,
      }));
      setMessages(chatMessages);
      setSelectedUser(res.data.chatWith);

      // reset unseen count
      setUnseenMessages((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });

      // mark all on server
      await Promise.all(
        chatMessages.map((msg) =>
          !msg.seen ? API.put(`/api/chat/mark/${msg._id}`) : null
        )
      );
    } catch (error) {
      console.error("❌ Error fetching chat:", error);
    }
  };

  // Send message
  const sendMessage = async (userId, text, files = []) => {
    try {
      const formData = new FormData();
      formData.append("text", text);
      files.forEach((file) => formData.append("files", file));

      const res = await API.post(`/api/chat/sendMsg/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages((prev) => [...prev, res.data.message]);
      return res.data.message;
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  // Socket listener (attach only once)
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderIdStr = newMessage.senderId?.toString();
      if (!senderIdStr) return;

      const currentSelectedUser = selectedUserRef.current;

      // Mark as seen if chat is open
      if (currentSelectedUser?._id === senderIdStr) {
        const seenMessage = { ...newMessage, seen: true };
        setMessages((prev) =>
          prev
            .map((msg) =>
              msg._id === newMessage._id ? { ...msg, seen: true } : msg
            )
            .concat(seenMessage)
        );
        API.put(`/api/chat/mark/${newMessage._id}`).catch(console.error);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [senderIdStr]: prev[senderIdStr] ? prev[senderIdStr] + 1 : 1,
        }));
      }

      // Update sender preview
      setUsers((prev) =>
        prev.map((u) => {
          const userId = u.user?._id?.toString();
          if (!userId) return u;

          if (userId === senderIdStr) {
            return {
              ...u,
              preview: {
                message:
                  newMessage.text ||
                  (newMessage.image_urls?.length ? "📷 Photo" : ""),
                time: newMessage.createdAt,
                sentByMe: senderIdStr === userData?._id?.toString(),
                seen: currentSelectedUser?._id === senderIdStr,
              },
            };
          }
          return u;
        })
      );
    };

    socket.on("New Message", handleNewMessage);

    return () => {
      socket.off("New Message", handleNewMessage);
    };
  }, [socket, userData?._id]);

  const value = {
    socket,
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    fetchFollowingUsers,
    fetchChat,
    sendMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => useContext(ChatContext);
