import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { 
  FaPaperPlane, 
  FaUserCircle, 
  FaSearch, 
  FaEllipsisV,
  FaArrowLeft,
  FaPaperclip,
  FaSmile,
  FaMicrophone
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import API from "@/axios/axios.js";

const socket = io("http://localhost:4000", { withCredentials: true });

const ChatPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messageEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get("/api/v1/user/doctors", {
          withCredentials: true,
        });
        const doctorsList = data.users.filter((u) => u._id !== currentUserId);
        setDoctors(doctorsList);
        setFilteredDoctors(doctorsList);
      } catch (err) {
        console.error("Erreur chargement médecins", err);
      }
    };

    fetchDoctors();
  }, []);

  // Filtrer les médecins
  useEffect(() => {
    if (searchTerm) {
      const filtered = doctors.filter(d => 
        `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctors);
    }
  }, [searchTerm, doctors]);

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
      // Sur mobile, fermer le sidebar après sélection
      if (window.innerWidth < 768) {
        setIsMobileSidebarOpen(false);
      }
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

  // Formatage de l'heure
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Vérifier si c'est un nouveau jour
  const isNewDay = (currentMsg, previousMsg) => {
    if (!previousMsg) return true;
    const currentDate = new Date(currentMsg.createdAt).toDateString();
    const previousDate = new Date(previousMsg.createdAt).toDateString();
    return currentDate !== previousDate;
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Masquée sur mobile sauf quand ouverte */}
      <div 
        className={`w-full md:w-80 bg-white shadow-md transition-transform duration-300 ease-in-out z-10
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          fixed md:relative h-full`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-emerald-600">Messages</h2>
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
          </div>
          
          {/* Barre de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          {filteredDoctors.map((d) => (
            <div
              key={d._id}
              onClick={() => {
                setDoctor(d);
                fetchMessages(d._id);
              }}
              className={`p-3 cursor-pointer border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                doctor?._id === d._id ? "bg-emerald-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaUserCircle className="text-3xl text-emerald-500" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">Dr. {d.firstName} {d.lastName}</p>
                  <p className="text-sm text-gray-500 truncate">{d.specialty || "Médecin"}</p>
                </div>
                {/* Badge de notification */}
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          ))}
          
          {filteredDoctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun médecin trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay pour mobile quand la sidebar est ouverte */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header du chat */}
        {doctor ? (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <FaUserCircle className="text-3xl text-emerald-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
                <p className="text-sm text-gray-500">{doctor.specialty || "Médecin"}</p>
              </div>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FaEllipsisV className="text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <h3 className="font-semibold text-gray-900">Messages</h3>
            </div>
          </div>
        )}

        {/* Zone de messages */}
        <div className="flex-1 overflow-y-auto bg-white p-4">
          {doctor ? (
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => {
                const showDateHeader = isNewDay(msg, messages[i - 1]);
                return (
                  <React.Fragment key={i}>
                    {showDateHeader && (
                      <div className="flex justify-center my-4">
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${
                        msg.from === currentUserId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                          msg.from === currentUserId
                            ? "bg-emerald-500 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.from === currentUserId ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messageEndRef} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="bg-emerald-100 p-6 rounded-full mb-4">
                <FaUserCircle className="text-4xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Vos messages</h3>
              <p className="text-gray-500 mb-6">
                Sélectionnez un médecin pour commencer une conversation
              </p>
              <button 
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                Voir les médecins
              </button>
            </div>
          )}
        </div>

        {/* Input Area */}
        {doctor && (
          <div className="bg-white border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FaPaperclip className="text-gray-500" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200">
                  <FaSmile className="text-gray-500" />
                </button>
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-3 rounded-full transition ${
                  input.trim() 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700" 
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {input.trim() ? <IoMdSend className="text-xl" /> : <FaMicrophone />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;