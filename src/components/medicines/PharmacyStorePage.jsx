// frontend/src/pages/PharmacyStorePage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const PharmacyStorePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

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
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product) => {
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
      <h1 className="text-3xl font-bold mb-4 text-emerald-700">Pharmacie</h1>

      <div className="mb-6">
        <label className="mr-2 font-medium">Filtrer par type :</label>
        <select
          className="border p-2 rounded"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white border shadow rounded-lg p-4 flex flex-col"
          >
            <img
              src={product.image?.url || "/placeholder.png"}
              alt={product.name}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="mt-2 font-semibold text-emerald-600">
              Prix : ${product.price}
            </p>
            <p className="text-sm text-gray-500">
              Stock : {product.stock} {product.unit || ""}
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-auto bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded mt-4"
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyStorePage;
