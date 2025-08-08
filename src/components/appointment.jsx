import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/api/v1/appoitment/patient", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAppointments(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce rendez-vous ?")) return;

    try {
      await API.delete(`/api/v1/appoitment/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Rendez-vous supprimé avec succès");
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleUpdate = async (id) => {
    const newReason = prompt("Nouvelle raison du rendez-vous :");
    const newDate = prompt("Nouvelle date (YYYY-MM-DD HH:mm):");

    if (!newReason || !newDate) {
      toast.info("Modification annulée");
      return;
    }

    try {
      await API.put(
        `/api/v1/appoitment/update/${id}`,
        { reason: newReason, date: newDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Rendez-vous mis à jour !");
      fetchAppointments();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-teal-700 mb-8">📅 Mes Rendez-vous</h1>

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-500">Aucun rendez-vous trouvé.</p>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-xl transition duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {new Date(appt.date).toLocaleDateString()} -{" "}
                    {new Date(appt.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </h2>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full 
                    ${appt.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      appt.status === "Approved" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"}`}>
                    {appt.status}
                  </span>
                </div>

                <p className="text-gray-700"><strong>Raison :</strong> {appt.reason}</p>
                <p className="text-gray-700 mb-4">
                  <strong>Visite effectuée :</strong> {appt.hasVisited ? "Oui" : "Non"}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleUpdate(appt._id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(appt._id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    🗑️ Supprimer
                  </button>
                  <button
                    onClick={() => setSelectedAppointment(appt)}
                    className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-900 transition"
                  >
                    📖 Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Détails en modale */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-teal-700">📝 Détails du rendez-vous</h2>
            <p><strong>Date :</strong> {new Date(selectedAppointment.date).toLocaleString()}</p>
            <p><strong>Raison :</strong> {selectedAppointment.reason}</p>
            <p><strong>Statut :</strong> {selectedAppointment.status}</p>
            <p><strong>Visite effectuée :</strong> {selectedAppointment.hasVisited ? "Oui" : "Non"}</p>
            {selectedAppointment.doctor && (
              <p><strong>Médecin :</strong> {selectedAppointment.doctor.email}</p>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsPage;
