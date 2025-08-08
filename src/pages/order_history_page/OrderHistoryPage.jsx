import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const MyPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get(
        "/api/v1/my-purchases",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPurchases(data.purchases);
    } catch (err) {
      toast.error("Erreur lors du chargement des achats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-emerald-700 mb-6">
        Mes Achats de Médicaments
      </h1>

      {loading ? (
        <p className="text-gray-600">Chargement...</p>
      ) : purchases.length === 0 ? (
        <p className="text-gray-600">Aucun achat trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-white shadow border rounded-lg p-4"
            >
              <img
                src={purchase.product?.image?.url || "/placeholder.png"}
                alt={purchase.product?.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {purchase.product?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {purchase.product?.description}
              </p>
              <p className="text-emerald-700 font-bold mt-2">
                Prix : ${purchase.product?.price}
              </p>
              <p className="text-sm text-gray-500">
                Catégorie : {purchase.product?.category}
              </p>
              <p className="text-sm text-gray-500">
                Acheté le : {new Date(purchase.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPurchasesPage;
