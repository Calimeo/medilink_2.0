import React, { useState, useEffect } from 'react';
import API from "@/axios/axios.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaSync,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaClock,
  FaDollarSign,
  FaTimes,
  FaStar,
  FaClinicMedical,
  FaHospital,
  FaBuilding,
  FaStethoscope,
  FaArrowLeft,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [hospitalServices, setHospitalServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Charger tous les hôpitaux
  const fetchAllHospitals = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/v1/user/hospital');
      const hospitalsData = response.data.Hospitals || [];
      setHospitals(hospitalsData);
      setFilteredHospitals(hospitalsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des hôpitaux');
      console.error('Erreur fetchAllHospitals:', error);
      setHospitals([]);
      setFilteredHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les hôpitaux
  useEffect(() => {
    let results = hospitals;
    
    // Filtre par recherche
    if (searchTerm) {
      results = results.filter(hospital => 
        hospital.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      results = results.filter(hospital => 
        statusFilter === 'active' ? hospital.isActive !== false : hospital.isActive === false
      );
    }
    
    setFilteredHospitals(results);
  }, [searchTerm, statusFilter, hospitals]);

  // Obtenir les détails d'un hôpital
  const getHospitalDetails = async (hospitalId) => {
    try {
      setDetailsLoading(true);
      const response = await API.get(`/api/hospitals/${hospitalId}/details`);
      
      setSelectedHospital(response.data.hospital);
      setHospitalServices(response.data.services || []);
      setShowDetails(true);
      
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Hôpital non trouvé');
      } else if (error.response?.status === 400) {
        toast.error('Cet utilisateur n\'est pas un hôpital');
      } else {
        toast.error('Erreur lors du chargement des détails');
      }
      console.error('Erreur getHospitalDetails:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fermer les détails
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedHospital(null);
    setHospitalServices([]);
  };

  // Charger les hôpitaux au montage du composant
  useEffect(() => {
    fetchAllHospitals();
  }, []);

  const hospitalsCount = filteredHospitals?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FaHospital className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Liste des Hôpitaux</h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez l'ensemble des établissements hospitaliers partenaires et leurs services
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un hôpital, une ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              <FaFilter className="w-4 h-4 mr-2" />
              Filtres
            </button>
          </div>
          
          {/* Filtres dépliants */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Actifs
                </button>
                <button
                  onClick={() => setStatusFilter('inactive')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === 'inactive' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Inactifs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <div className="flex justify-center mb-3">
              <FaHospital className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-blue-600">{hospitals.length}</div>
            <div className="text-sm text-gray-600 font-medium">Hôpitaux total</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <div className="flex justify-center mb-3">
              <FaClinicMedical className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {hospitals.filter(h => h.isActive !== false).length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Hôpitaux actifs</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
            <div className="flex justify-center mb-3">
              <FaStar className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-600">
              {hospitals.filter(h => h.isActive === false).length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Hôpitaux inactifs</div>
          </div>
        </div>

        {/* Liste des hôpitaux */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-4 md:px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <h2 className="text-lg md:text-xl font-semibold text-white">
                Établissements hospitaliers ({hospitalsCount})
              </h2>
              <button
                onClick={fetchAllHospitals}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                <FaSync className="w-4 h-4 mr-2" />
                Actualiser
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">Chargement des hôpitaux...</span>
              </div>
            </div>
          ) : hospitalsCount > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredHospitals.map(hospital => (
                <div key={hospital._id} className="p-4 md:p-6 hover:bg-blue-50/30 transition-colors duration-200">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 md:gap-6">
                    {/* Informations principales */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                          {hospital.name}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          hospital.isActive === false 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {hospital.isActive === false ? 'Inactif' : 'Actif'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {/* Adresse */}
                        <div className="flex items-start space-x-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Adresse</p>
                            <p className="text-gray-600 text-sm">
                              {hospital.address || 'Non spécifiée'}
                              {hospital.city && `, ${hospital.city}`}
                              {hospital.postalCode && ` ${hospital.postalCode}`}
                            </p>
                          </div>
                        </div>
                        
                        {/* Contact */}
                        <div className="flex items-start space-x-2">
                          <FaPhone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Contact</p>
                            <p className="text-gray-600 text-sm">
                              {hospital.phone || 'Non spécifié'}
                              {hospital.email && (
                                <span className="block mt-1">
                                  <FaEnvelope className="w-3 h-3 text-gray-400 inline mr-1" />
                                  {hospital.email}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      {hospital.description && (
                        <div className="mt-3 flex items-start space-x-2">
                          <FaInfoCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-700">Description</p>
                            <p className="text-sm text-gray-600">
                              {hospital.description.length > 100 
                                ? `${hospital.description.substring(0, 100)}...` 
                                : hospital.description
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-2">
                      <button
                        onClick={() => getHospitalDetails(hospital._id)}
                        disabled={detailsLoading}
                        className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium text-sm"
                      >
                        <FaEye className="w-3 h-3 mr-1 md:mr-2" />
                        {detailsLoading ? 'Chargement...' : 'Détails'}
                      </button>
                      
                      {hospital.phone && (
                        <a
                          href={`tel:${hospital.phone}`}
                          className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium text-sm"
                        >
                          <FaPhone className="w-3 h-3 mr-1 md:mr-2" />
                          Appeler
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 md:p-12 text-center">
              <div className="text-gray-300 text-6xl mb-4">
                <FaHospital className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">Aucun hôpital trouvé</p>
              <p className="text-gray-400 text-sm">
                Aucun établissement hospitalier ne correspond à vos critères de recherche
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal des détails de l'hôpital */}
      {showDetails && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              {/* En-tête */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <button
                    onClick={closeDetails}
                    className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                  >
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedHospital.name}</h2>
                    {selectedHospital.email && (
                      <p className="text-gray-600 flex items-center mt-1 text-sm">
                        <FaEnvelope className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedHospital.email}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeDetails}
                  className="hidden md:block p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {detailsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des détails...</p>
                </div>
              ) : (
                <>
                  {/* Informations de l'hôpital */}
                  <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <FaInfoCircle className="w-5 h-5 mr-2 text-blue-600" />
                      Informations de l'établissement
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {selectedHospital.adresse && (
                        <div className="flex items-start space-x-3">
                          <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Adresse</p>
                            <p className="text-gray-600 text-sm">
                              {selectedHospital.adresse}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {selectedHospital.phone && (
                        <div className="flex items-start space-x-3">
                          <FaPhone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Téléphone</p>
                            <p className="text-gray-600 text-sm">{selectedHospital.phone}</p>
                          </div>
                        </div>
                      )}

                      {selectedHospital.doctorDepartment && (
                        <div className="flex items-start space-x-3">
                          <FaStethoscope className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Département</p>
                            <p className="text-gray-600 text-sm">{selectedHospital.doctorDepartment}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-3">
                        <FaStar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Statut</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedHospital.isActive === false 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {selectedHospital.isActive === false ? 'Inactif' : 'Actif'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedHospital.description && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                        <div className="flex items-start space-x-3">
                          <FaInfoCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
                            <p className="text-gray-600 text-sm leading-relaxed">{selectedHospital.description}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services de l'hôpital */}
                  <div className="mb-4 md:mb-6">
                    <div className="flex justify-between items-center mb-4 md:mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <FaClinicMedical className="w-5 h-5 mr-2 text-blue-600" />
                        Services offerts
                      </h3>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {hospitalServices.length} service{hospitalServices.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {hospitalServices.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 rounded-xl">
                        <FaClinicMedical className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Aucun service disponible pour cet hôpital</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {hospitalServices.map(service => (
                          <div key={service._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900 text-base">{service.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                service.availability === 'available' 
                                  ? 'bg-green-100 text-green-700'
                                  : service.availability === 'limited'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {service.availability === 'available' 
                                  ? 'Disponible' 
                                  : service.availability === 'limited'
                                  ? 'Limité'
                                  : 'Indisponible'}
                              </span>
                            </div>
                            
                            {service.description && (
                              <p className="text-gray-600 text-xs mb-3">{service.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-3 text-xs">
                              <div className="flex items-center text-gray-700">
                                <FaDollarSign className="w-3 h-3 text-green-600 mr-1" />
                                <span className="font-medium">{service.price} $</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaClock className="w-3 h-3 text-blue-600 mr-1" />
                                <span className="font-medium">{service.duration} min</span>
                              </div>
                              <div className="flex items-center text-gray-700">
                                <FaStethoscope className="w-3 h-3 text-purple-600 mr-1" />
                                <span className="font-medium">{service.category}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                {selectedHospital.phone && (
                  <a
                    href={`tel:${selectedHospital.phone}`}
                    className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <FaPhone className="w-4 h-4 mr-2" />
                    Appeler
                  </a>
                )}
                <button
                  onClick={closeDetails}
                  className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                >
                  <FaTimes className="w-4 h-4 mr-2" />
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalList;