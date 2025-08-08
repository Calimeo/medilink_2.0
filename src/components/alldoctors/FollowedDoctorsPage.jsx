import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const FollowedDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowedDoctors = async () => {
    try {
      const { data } = await API.get(
        "/api/v1/user/following",
        { withCredentials: true }
      );
      setDoctors(data.doctors || []);
    } catch (err) {
      toast.error("Impossible de charger les médecins suivis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowedDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-10">
          Médecins Suivis
        </h1>

        {loading && <p className="text-center text-gray-500">Chargement...</p>}

        {!loading && doctors.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition-all overflow-hidden"
              >
                <img
                  src={doctor.docAvatar?.url || "/doctor-placeholder.png"}
                  alt={doctor.firstName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{doctor.email}</p>
                  <p className="text-sm text-gray-600">📞 {doctor.phone}</p>
                  <p className="text-sm text-indigo-700 mt-2">
                    Département : {doctor.doctorDepartment || "Inconnu"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <p className="text-center text-gray-500">Aucun médecin suivi.</p>
        )}
      </div>
    </div>
  );
};

export default FollowedDoctorsPage;
