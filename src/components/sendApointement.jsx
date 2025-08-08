import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const SendAppointmentPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
    message: "",
  });

  const getDoctorInfo = async () => {
    try {
      const { data } = await API.get(`/api/v1/user/doctor/${doctorId}`, {
        withCredentials: true,
      });
      setDoctor(data.doctor);
    } catch (error) {
      toast.error("Erreur de chargement du médecin");
    }
  };

  useEffect(() => {
    getDoctorInfo();
  }, [doctorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.reason) {
      return toast.warn("Veuillez remplir les champs requis");
    }

    try {
      const { data } = await API.post(
        `/api/v1/appoitment/send-appointment/${doctorId}`,
        { doctorId, ...formData },
        { withCredentials: true }
      );
      toast.success("Rendez-vous envoyé avec succès");
      navigate("/appointments"); // ou une autre page
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6">
          Demande de rendez-vous
        </h2>

        {doctor ? (
          <div className="mb-6">
            <p className="font-medium text-lg text-gray-700">
              Dr. {doctor.firstName} {doctor.lastName}
            </p>
            <p className="text-sm text-gray-500">{doctor.email}</p>
            <p className="text-sm text-gray-500">{doctor.phone}</p>
          </div>
        ) : (
          <p>Chargement des informations du médecin...</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Date du rendez-vous *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Heure *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Motif *</label>
            <input
              type="text"
              name="reason"
              placeholder="Ex : Douleurs abdominales"
              value={formData.reason}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message (facultatif)</label>
            <textarea
              name="message"
              rows="4"
              placeholder="Décrivez votre situation..."
              value={formData.message}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition"
          >
            Envoyer le rendez-vous
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendAppointmentPage;
