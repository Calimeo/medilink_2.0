import React, { useState, useEffect } from "react";
import { DoctorsCard } from "../../import-export/ImportExport";
import axios from "axios";
import API from "@/axios/axios.js";

function AllDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get(
          "/api/v1/user/doctors",
          { withCredentials: true }
        );

        // ✅ Vérification corrigée
        if (data.success && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else {
          setError("Aucun docteur trouvé.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des docteurs :", err);
        setError("Erreur serveur. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-emerald-700 mb-8 text-center">
          Liste des docteurs
        </h1>

        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            Chargement des docteurs...
          </p>
        )}
        {error && !loading && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {!loading && doctors.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <DoctorsCard key={doctor._id} doctor={doctor} />
            ))}
          </section>
        )}

        {!loading && doctors.length === 0 && !error && (
          <p className="text-center text-gray-600">
            Aucun docteur disponible pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}

export default AllDoctorsPage;
