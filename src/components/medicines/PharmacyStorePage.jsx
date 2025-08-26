import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const PharmacyStorePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Charger panier depuis localStorage
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage")); // Pour actualiser les autres composants comme la Navbar
  }, [cart]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await API.get("/api/v1/products/p", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(data.products);
    } catch (err) {
      toast.error("Erreur lors du chargement des produits");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      toast.warning("Ce produit est en rupture de stock");
      return;
    }

    const exist = cart.find((item) => item._id === product._id);
    if (exist) {
      toast.info("Produit déjà dans le panier.");
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      toast.success("Produit ajouté au panier !");
    }
  };

  const filteredProducts =
    selectedType === "all"
      ? products
      : products.filter((p) => p.type === selectedType);

  const uniqueTypes = ["all", ...new Set(products.map((p) => p.type).filter(Boolean))];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-emerald-700">Pharmacie</h1>
          <p className="text-gray-500 mt-1">Trouvez les médicaments dont vous avez besoin</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrer par catégorie :</label>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-w-[200px]"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all" ? "Toutes les catégories" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
          <p className="mt-1 text-gray-500">Aucun produit disponible dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="relative h-48 bg-gray-100">
                {product.image?.url ? (
                  <img
                    src={product.image.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Rupture
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-emerald-600">
                      {product.price.toFixed(2)} gdes
                    </span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-gray-500' : 'text-red-500'}`}>
                      {product.stock > 0 ? `${product.stock} ${product.unit || 'dispo'}` : 'Rupture'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    product.stock > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacyStorePage;