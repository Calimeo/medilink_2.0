import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import API from "@/axios/axios.js";

const socket = io("http://localhost:4000", { withCredentials: true });

const ChatPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get("/api/v1/user/doctors", {
          withCredentials: true,
        });
        setDoctors(data.users.filter((u) => u._id !== currentUserId));
      } catch (err) {
        console.error("Erreur chargement médecins", err);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.from === doctor?._id || msg.to === doctor?._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [doctor]);

  const fetchMessages = async (doctorId) => {
    try {
      const { data } = await API.get(
        `/api/v1/message/${doctorId}`,
        { withCredentials: true }
      );
      setMessages(data.messages);
    } catch (err) {
      console.error("Erreur chargement messages", err);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !doctor) return;
    const msg = {
      to: doctor._id,
      content: input,
    };

    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, { ...msg, from: currentUserId, createdAt: new Date() }]);
    setInput("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">Médecins</h2>
        {doctors.map((d) => (
          <div
            key={d._id}
            onClick={() => {
              setDoctor(d);
              fetchMessages(d._id);
            }}
            className={`p-2 cursor-pointer rounded-lg hover:bg-emerald-100 ${
              doctor?._id === d._id ? "bg-emerald-100" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-2xl text-gray-500" />
              <div>
                <p className="font-medium">{d.firstName} {d.lastName}</p>
                <p className="text-sm text-gray-500">{d.email}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex flex-col w-3/4 p-4">
        <div className="flex-1 overflow-y-auto bg-white p-4 rounded-md shadow-inner">
          {doctor ? (
            <>
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                Discussion avec Dr. {doctor.firstName}
              </h3>
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.from === currentUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.from === currentUserId
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </>
          ) : (
            <p className="text-gray-600">Sélectionnez un médecin pour commencer une discussion.</p>
          )}
        </div>

        {/* Input */}
        {doctor && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Tapez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
