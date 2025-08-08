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
          <FaTimes size={20} />
        </button>
        <h3 className="text-xl font-semibold mb-2">
          Discuter avec Dr. {doctor.firstName} {doctor.lastName}
        </h3>
        <div className="h-64 overflow-y-auto border rounded-md p-3 bg-gray-50 mb-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-1 flex ${
                msg.sender._id === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-md text-sm ${
                  msg.sender._id === currentUserId
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Votre message..."
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <button
            onClick={handleSend}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-md"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
