import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "@/axios/axios.js";
import { toast } from "react-toastify";

/**
 * Page patient : liste les créneaux libres d'un docteur (doctorId param)
 * Permet de réserver un créneau (availabilityId).
 *
 * route example: /book/doctor/:doctorId
 */

export default function PatientBookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [bookingId, setBookingId] = useState(null); // for UX while booking

  const token = localStorage.getItem("token");

  const fetchDoctorAndSlots = async () => {
    try {
      setLoading(true);
      // fetch doctor info (optional)
      const [{ data: docResp }, { data: slotsResp }] = await Promise.all([
        API.get(`/api/v1/user/doctor/${doctorId}`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: null })),
        API.get(`/api/v1/availability/${doctorId}`) // public endpoint for free slots
      ]);
      setDoctor(docResp?.doctor || null);
      setSlots(slotsResp || slotsResp === undefined ? slotsResp : []);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de récupérer les disponibilités.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!doctorId) return;
    fetchDoctorAndSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleBook = async (availabilityId) => {
    if (!reason.trim()) return toast.warn("Indiquez un motif de rendez-vous.");
    try {
      setBookingId(availabilityId);
      const res = await API.post(
        "/api/v1/appoitment/book",
        { availabilityId, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Réservé !");
      // mark locally
      setSlots((prev) => prev.map((s) => (s._id === availabilityId ? { ...s, isBooked: true } : s)));
      // optionally navigate to "my appointments"
      navigate("/my-appointments");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setBookingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">
              Réserver un rendez-vous
            </h1>
            <p className="text-sm text-gray-600">
              {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Sélection du médecin..."}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <label className="block text-sm text-gray-700 mb-2">Motif du rendez-vous</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex : douleurs, consultation..."
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-gray-800 mb-3">Créneaux disponibles</h2>

          {loading ? (
            <div className="text-gray-500">Chargement...</div>
          ) : slots.length === 0 ? (
            <div className="text-gray-500">Aucun créneau disponible pour le moment.</div>
          ) : (
            <div className="grid gap-3">
              {slots.map((s) => (
                <div key={s._id} className="flex items-center justify-between border rounded p-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{new Date(s.date).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{s.isBooked ? "Réservé" : "Libre"}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={s.isBooked || bookingId === s._id}
                      onClick={() => handleBook(s._id)}
                      className={`px-4 py-2 rounded-md text-white transition ${
                        s.isBooked ? "bg-gray-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {bookingId === s._id ? "Réservation..." : s.isBooked ? "Indisponible" : "Réserver"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
