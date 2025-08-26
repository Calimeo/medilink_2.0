import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from "@/axios/axios.js";

const PatientBookingPage = ({ doctorId: initialDoctorId = '' }) => {
  const [doctorId, setDoctorId] = useState(initialDoctorId);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (initialDoctorId) {
      fetchAvailabilities();
    }
  }, [initialDoctorId]);

  const fetchAvailabilities = async () => {
    if (!doctorId) return;
    setLoading(true);
    setError('');
    setSelectedSlot(null);

    try {
      const response = await API.get(`/api/v1/availability/${doctorId}`);
      setAvailabilities(response.data);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors de la récupération des disponibilités");
      toast.error("Erreur lors de la récupération des créneaux");
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
    setBookingLoading(true);
    try {
      const res = await API.post(
        "/api/v1/availability/book",
        { slotId: slot._id, doctorId }, 
        { withCredentials: true }
      );

      toast.success(res.data.message || "Rendez-vous réservé !");
      setSelectedSlot(slot);

      // 🔄 Mise à jour de la liste après réservation
      fetchAvailabilities();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAvailabilities();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {!initialDoctorId && (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Disponibilités des médecins</h1>
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                  ID du médecin
                </label>
                <input
                  type="text"
                  id="doctorId"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Entrez l'ID du médecin"
                  required
                />
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Rechercher'}
                </button>
              </div>
            </div>
          </form>
        </>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {loading && <p className="text-center py-4">Chargement des disponibilités...</p>}

      {availabilities.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {initialDoctorId ? 'Créneaux disponibles' : 'Résultats de recherche'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availabilities.map((slot) => (
              <div 
                key={slot._id} 
                className={`p-4 border rounded-lg transition-all ${selectedSlot?._id === slot._id ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:shadow-md'}`}
              >
                <h3 className="font-medium text-gray-900">
                  {new Date(slot.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(slot.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <div className="mt-3">
                  <button
                    className={`px-4 py-2 text-sm rounded transition-colors ${
                      slot.isBooked
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                    disabled={slot.isBooked || bookingLoading}
                    onClick={() => handleBookSlot(slot)}
                  >
                    {slot.isBooked ? 'Déjà réservé' : bookingLoading ? 'Réservation...' : 'Réserver ce créneau'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !loading && doctorId && (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p>Aucune disponibilité trouvée pour ce médecin.</p>
          </div>
        )
      )}
    </div>
  );
};

export default PatientBookingPage;
