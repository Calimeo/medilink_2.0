import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";

const PatientDoctorAvailability = () => {
  const { doctorId } = useParams(); // id du docteur dans l’URL
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Récupérer les créneaux disponibles
  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/availability/${doctorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAvailabilities(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Erreur lors du chargement des disponibilités");
      setLoading(false);
    }
  };

  // Réserver un créneau
  const handleBooking = async (availabilityId) => {
    try {
      const res = await axios.post(
        "/api/availability/book",
        { availabilityId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      toast.success(res.data.message);
      fetchAvailabilities(); // rafraîchir après réservation
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la réservation");
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, [doctorId]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-teal-600 mb-6">
          Disponibilités du docteur
        </h1>

        {loading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : availabilities.length === 0 ? (
          <p className="text-gray-500">Aucune disponibilité trouvée.</p>
        ) : (
          <ul className="space-y-4">
            {availabilities.map((a) => (
              <li
                key={a._id}
                className="flex items-center justify-between border p-4 rounded-md hover:bg-gray-50"
              >
                <span className="text-gray-700 font-medium">
                  {new Date(a.date).toLocaleString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <button
                  onClick={() => handleBooking(a._id)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                >
                  Réserver
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PatientDoctorAvailability;
