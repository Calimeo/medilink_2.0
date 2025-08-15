// components/ChatModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { io } from "socket.io-client";
import API from "@/axios/axios.js";

const socket = io("http://localhost:4000", { withCredentials: true });

const ChatModal = ({ doctor, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!doctor) return;
    socket.emit("join", doctor._id);
    API
      .get(`/api/v1/message/${doctor._id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data.messages))
      .catch(console.error);
  }, [doctor]);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (
        message.sender._id === doctor._id ||
        message.receiver === doctor._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [doctor]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      const { data } = await API.post(
        "/api/v1/send",
        { receiverId: doctor._id, content },
        { withCredentials: true }
      );
      socket.emit("sendMessage", data.data);
      setMessages((prev) => [...prev, data.data]);
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg relative p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <FaTimes />
        </button>

        <div className="h-96 overflow-y-auto mb-4 p-2 border rounded">
          {messages.map((message) => {
            const isCurrentUser = message.sender._id === currentUserId;
            return (
              <div
                key={message._id}
                className={`mb-3 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-200 text-gray-800 mr-auto'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Tapez votre message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;